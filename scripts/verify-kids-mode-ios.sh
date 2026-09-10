#!/usr/bin/env bash
#
# Verify Adapty Kids Mode (iOS) end-to-end for React Native, on either integration path.
#
# Builds an example app with the AdaptySDK-iOS `KidsMode` trait toggled, then inspects EVERY
# Mach-O inside the built .app (app stub, debug dylib, embedded frameworks) for IDFA/AdSupport
# (+ ATT) with otool/nm.
#
# Usage: scripts/verify-kids-mode-ios.sh <on|off|both> [pods|spm]
#   on   - Kids Mode enabled;  assert tokens ABSENT  (CI + local)
#   off  - Kids Mode disabled; assert tokens PRESENT (local negative control)
#   both - off then on (positive + negative control) (local)
#
#   pods - examples/AdaptyDevtools     (CocoaPods; default, what CI runs)
#   spm  - examples/AdaptyDevtoolsSpm  (React Native SwiftPM, `npx react-native spm`)
#
# The two paths differ ONLY in how the trait is toggled and how the app is built:
#   pods: `pod install` with ADAPTY_KIDS_MODE=1 drives the shipped `ios/adapty_kids_mode.rb`
#         helper, which writes `traits = (KidsMode,)` onto the AdaptySDK-iOS package reference
#         in the generated Pods.xcodeproj. Built from the .xcworkspace.
#   spm:  the SDK's `adapty-spm-kids-mode` CLI flips the default trait set in
#         node_modules/react-native-adapty/Package.swift. CocoaPods never reads that manifest and
#         SwiftPM never reads the podspec, so each path needs its own toggle. Built from the
#         .xcodeproj — there is no workspace.
#
# Prereqs: the chosen example's deps installed + `yarn update-sdk-full` run (delivers the local
#          SDK build — the Podfile helper for pods, the Kids Mode CLI for spm).
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DERIVED_DATA="$REPO_ROOT/.derivedData-kids-mode"
SPM_DIR="$REPO_ROOT/.spm-kids-mode"

# Tokens that must vanish when Kids Mode is on.
FRAMEWORK_PATTERN='AdSupport|AppTrackingTransparency'
SYMBOL_PATTERN='ASIdentifierManager|ATTrackingManager'
# Positive sentinel — Adapty RN code MUST be visible, else the inspection is vacuous.
SENTINEL_SYMBOL='RNAdapty'

log() { printf '\n=== %s ===\n' "$*"; }
fatal() { echo "FATAL: $*" >&2; exit 1; }

frameworks_present() { grep -qiE "$FRAMEWORK_PATTERN"; }
symbols_present()    { grep -qE  "$SYMBOL_PATTERN"; }
sentinel_present()   { grep -q   "$SENTINEL_SYMBOL"; }

# --- target configuration -----------------------------------------------------------------

configure_target() { # $1 = pods|spm
  TARGET="$1"
  case "$TARGET" in
    pods)
      EXAMPLE_DIR="$REPO_ROOT/examples/AdaptyDevtools"
      APP_NAME="AdaptyRnSdkExample"
      XC_CONTAINER=(-workspace "$EXAMPLE_DIR/ios/$APP_NAME.xcworkspace")
      ;;
    spm)
      EXAMPLE_DIR="$REPO_ROOT/examples/AdaptyDevtoolsSpm"
      APP_NAME="AdaptyDevtoolsSpm"
      XC_CONTAINER=(-project "$EXAMPLE_DIR/ios/$APP_NAME.xcodeproj")
      ;;
    *) echo "usage: $0 <on|off|both> [pods|spm]" >&2; exit 2 ;;
  esac
  IOS_DIR="$EXAMPLE_DIR/ios"
  SCHEME="$APP_NAME"
  POD_HELPER="$EXAMPLE_DIR/node_modules/react-native-adapty/ios/adapty_kids_mode.rb"
  SPM_CLI="$EXAMPLE_DIR/node_modules/react-native-adapty/scripts/kids-mode.cjs"
  SPM_MANIFEST="$EXAMPLE_DIR/node_modules/react-native-adapty/Package.swift"
}

# CocoaPods: prefer the example's bundler if its bundle is installed (local dev),
# else the system pod (CI, mirroring the build-ios job).
select_pod() {
  POD=(pod)
  if [[ -f "$EXAMPLE_DIR/Gemfile" ]] && command -v bundle >/dev/null 2>&1 \
     && ( cd "$EXAMPLE_DIR" && bundle check >/dev/null 2>&1 ); then
    POD=(bundle exec pod)
  fi
}

# --- toggles ------------------------------------------------------------------------------

# pods: re-run pod install with/without ADAPTY_KIDS_MODE. Through the Podfile helper this
# (re)writes `traits = (KidsMode,)` in Pods.xcodeproj.
pod_toggle() { # $1 = on|off
  local mode="$1"
  [[ -f "$POD_HELPER" ]] || fatal "helper not found at $POD_HELPER — run 'cd $EXAMPLE_DIR && yarn update-sdk-full' first."
  # --repo-update mirrors the proven build-ios job and is cheap with the CocoaPods CDN.
  if [[ "$mode" == "on" ]]; then
    ( cd "$IOS_DIR" && ADAPTY_KIDS_MODE=1 "${POD[@]}" install --repo-update )
  else
    ( cd "$IOS_DIR" && "${POD[@]}" install --repo-update )
  fi
}

# spm: flip the default trait set in the installed SDK's Package.swift, then PROVE it landed.
# The CLI is invoked by path rather than through the app's `yarn kids-mode:*` scripts, so the
# verification does not depend on node_modules/.bin being linked. This workflow is the ONLY place
# the kids variant is built — the example itself defaults to Kids Mode OFF so that the trait
# configuration shipping users get is what the other CI builds compile.
spm_toggle() { # $1 = on|off
  local mode="$1" verb anchor
  [[ -f "$SPM_CLI" ]] || fatal "Kids Mode CLI not found at $SPM_CLI — run 'cd $EXAMPLE_DIR && yarn update-sdk-full' first."
  if [[ "$mode" == "on" ]]; then
    verb=enable; anchor='.default(enabledTraits: ["AdaptyReactNativeKidsMode"])'
  else
    verb=disable; anchor='.default(enabledTraits: [])'
  fi
  node "$SPM_CLI" "$verb" --app-root="$EXAMPLE_DIR"
  grep -qF "$anchor" "$SPM_MANIFEST" \
    || fatal "Package.swift does not carry the expected anchor after '$verb': $anchor"
  # Autolinking regenerates the aggregator that references our package; harmless when
  # unchanged, and required if the pack was just reinstalled.
  ( cd "$IOS_DIR" && npx react-native spm >/dev/null )
}

toggle_kids_mode() { # $1 = on|off
  case "$TARGET" in
    pods) pod_toggle "$1" ;;
    spm)  spm_toggle "$1" ;;
  esac
}

restore_state() {
  case "$TARGET" in
    pods) ( cd "$IOS_DIR" && "${POD[@]}" install >/dev/null 2>&1 ) || \
            echo "WARN: failed to restore Pods to Kids-Mode-off" >&2 ;;
    # The example's default is Kids Mode OFF (nothing re-applies the toggle), so restore that.
    spm)  node "$SPM_CLI" disable --app-root="$EXAMPLE_DIR" >/dev/null 2>&1 || \
            echo "WARN: failed to restore Kids Mode to disabled" >&2 ;;
  esac
}

# --- build & inspect ----------------------------------------------------------------------

build_app() {
  rm -rf "$DERIVED_DATA"   # force recompile so the toggled trait takes effect
  # Re-resolve against the (cached) checkouts so the toggled trait is picked up even when
  # .spm-kids-mode is reused between the off and on builds of a `both` run.
  xcodebuild -resolvePackageDependencies "${XC_CONTAINER[@]}" -scheme "$SCHEME" \
    -clonedSourcePackagesDirPath "$SPM_DIR" -skipPackagePluginValidation
  xcodebuild "${XC_CONTAINER[@]}" -scheme "$SCHEME" \
    -destination generic/platform=iOS \
    -configuration Debug \
    -derivedDataPath "$DERIVED_DATA" \
    -clonedSourcePackagesDirPath "$SPM_DIR" \
    -skipPackagePluginValidation \
    ONLY_ACTIVE_ARCH=YES \
    CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO \
    build
}

# Every Mach-O inside the built .app: the app stub, debug dylib, and embedded frameworks.
list_binaries() {
  local app
  app="$(find "$DERIVED_DATA/Build/Products" -type d -name "$APP_NAME.app" -print -quit 2>/dev/null || true)"
  if [[ -z "$app" ]]; then fatal "$APP_NAME.app not found under $DERIVED_DATA/Build/Products"; fi
  find "$app" -type f \( -name "$APP_NAME" -o -name '*.dylib' -o -path '*.framework/*' \) 2>/dev/null | while IFS= read -r f; do
    if file -b "$f" 2>/dev/null | grep -q 'Mach-O'; then printf '%s\n' "$f"; fi
  done
}

assert_mode() { # $1 = on|off
  local mode="$1" bins otool_all="" nm_all="" fw sym
  bins="$(list_binaries)"
  if [[ -z "$bins" ]]; then fatal "no Mach-O binaries found inside $APP_NAME.app"; fi
  while IFS= read -r b; do
    [[ -n "$b" ]] || continue
    otool_all+="$(otool -L "$b" 2>/dev/null || true)"$'\n'
    nm_all+="$(nm "$b" 2>/dev/null || true)"$'\n'
  done <<< "$bins"

  # here-strings (not pipes) — nm output is multi-MB; a pipe + grep -q early-exit triggers
  # SIGPIPE under `set -o pipefail` and would falsely report "absent".
  if ! sentinel_present <<< "$nm_all"; then
    fatal "sentinel '$SENTINEL_SYMBOL' not found in any $APP_NAME.app binary — inspection is vacuous."
  fi
  if frameworks_present <<< "$otool_all"; then fw=present; else fw=absent; fi
  if symbols_present    <<< "$nm_all";    then sym=present; else sym=absent; fi
  echo "target=$TARGET  kids-mode=$mode  frameworks=$fw  symbols=$sym  sentinel=ok"

  if [[ "$mode" == "on" ]]; then
    if [[ "$fw" == "present" || "$sym" == "present" ]]; then
      echo "FAIL: Kids Mode ON but AdSupport/ATT still linked/referenced." >&2; exit 1
    fi
  else
    if [[ "$fw" != "present" || "$sym" != "present" ]]; then
      echo "FAIL: Kids Mode OFF but AdSupport/ATT not fully present — inspection looks wrong." >&2; exit 1
    fi
  fi
}

run_mode() { # $1 = on|off
  local mode="$1"
  log "[$TARGET] Kids Mode $mode — toggle"
  toggle_kids_mode "$mode"
  log "[$TARGET] Kids Mode $mode — build $APP_NAME"
  build_app
  log "[$TARGET] Kids Mode $mode — inspect $APP_NAME.app Mach-O binaries"
  assert_mode "$mode"
}

main() {
  local cmd="${1:-}"
  case "$cmd" in
    on|off|both) ;;
    *) echo "usage: $0 <on|off|both> [pods|spm]" >&2; exit 2 ;;
  esac
  configure_target "${2:-pods}"
  select_pod
  trap restore_state EXIT
  case "$cmd" in
    on)   run_mode on ;;
    off)  run_mode off ;;
    both) run_mode off; run_mode on ;;
  esac
  log "[$TARGET] Kids Mode verification ($cmd): PASSED"
}

if [[ "${BASH_SOURCE[0]}" == "${0:-}" ]]; then
  main "$@"
fi
