#!/usr/bin/env bash
#
# Verify Adapty Kids Mode (iOS) end-to-end for React Native.
#
# Builds examples/AdaptyDevtools with the AdaptySDK-iOS `KidsMode` SPM trait toggled
# via the shipped `ios/adapty_kids_mode.rb` Podfile helper (opt-in with ADAPTY_KIDS_MODE=1),
# then inspects EVERY Mach-O inside AdaptyRnSdkExample.app (app stub, debug dylib, embedded
# frameworks) for IDFA/AdSupport (+ ATT) with otool/nm.
#
# Usage: scripts/verify-kids-mode-ios.sh <on|off|both>
#   on   - Kids Mode enabled;  assert tokens ABSENT  (CI + local)
#   off  - Kids Mode disabled; assert tokens PRESENT (local negative control)
#   both - off then on (positive + negative control) (local)
#
# Prereqs: examples/AdaptyDevtools deps installed + `yarn update-sdk-full` run
#          (delivers ios/adapty_kids_mode.rb into the example's node_modules).
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXAMPLE_DIR="$REPO_ROOT/examples/AdaptyDevtools"
IOS_DIR="$EXAMPLE_DIR/ios"
WORKSPACE="$IOS_DIR/AdaptyRnSdkExample.xcworkspace"
SCHEME="AdaptyRnSdkExample"
DERIVED_DATA="$REPO_ROOT/.derivedData-kids-mode"
SPM_DIR="$REPO_ROOT/.spm-kids-mode"
HELPER="$EXAMPLE_DIR/node_modules/react-native-adapty/ios/adapty_kids_mode.rb"

# Tokens that must vanish when Kids Mode is on.
# NOTE: AppTrackingTransparency|ATTrackingManager are part of the FULL promise, but
# AdaptySDK-iOS 4.0.0 imports ATT unconditionally in AdaptyProfileParameters.Builder.swift
# (not gated by !KidsMode). Task 3 narrows these to the IDFA/AdSupport core until the SDK
# fix lands; re-enable by restoring the "|AppTrackingTransparency" / "|ATTrackingManager".
FRAMEWORK_PATTERN='AdSupport|AppTrackingTransparency'
SYMBOL_PATTERN='ASIdentifierManager|ATTrackingManager'
# Positive sentinel — Adapty RN code MUST be visible, else the inspection is vacuous.
SENTINEL_SYMBOL='RNAdapty'

log() { printf '\n=== %s ===\n' "$*"; }

frameworks_present() { grep -qiE "$FRAMEWORK_PATTERN"; }
symbols_present()    { grep -qE  "$SYMBOL_PATTERN"; }
sentinel_present()   { grep -q   "$SENTINEL_SYMBOL"; }

# CocoaPods: prefer the example's bundler if its bundle is installed (local dev),
# else the system pod (CI, mirroring the build-ios job).
POD=(pod)
if [[ -f "$EXAMPLE_DIR/Gemfile" ]] && command -v bundle >/dev/null 2>&1 \
   && ( cd "$EXAMPLE_DIR" && bundle check >/dev/null 2>&1 ); then
  POD=(bundle exec pod)
fi

# Toggle the trait the user's way: re-run pod install with/without ADAPTY_KIDS_MODE.
# Through the Podfile helper this (re)writes `traits = (KidsMode,)` in Pods.xcodeproj.
pod_install() { # $1 = on|off
  local mode="$1"
  if [[ ! -f "$HELPER" ]]; then
    echo "FATAL: helper not found at $HELPER — run 'cd $EXAMPLE_DIR && yarn update-sdk-full' first." >&2
    exit 1
  fi
  # --repo-update mirrors the proven build-ios job and is cheap with the CocoaPods CDN;
  # it avoids "Unable to find a specification" if the runner's spec cache lags Podfile.lock.
  if [[ "$mode" == "on" ]]; then
    ( cd "$IOS_DIR" && ADAPTY_KIDS_MODE=1 "${POD[@]}" install --repo-update )
  else
    ( cd "$IOS_DIR" && "${POD[@]}" install --repo-update )
  fi
}

restore_pods() { ( cd "$IOS_DIR" && "${POD[@]}" install >/dev/null 2>&1 ) || \
  echo "WARN: failed to restore Pods to Kids-Mode-off" >&2; }

build_app() {
  rm -rf "$DERIVED_DATA"   # force recompile so the toggled trait takes effect
  # Re-resolve against the (cached) checkouts so the toggled trait is picked up even when
  # .spm-kids-mode is reused between the off and on builds of a `both` run.
  xcodebuild -resolvePackageDependencies -workspace "$WORKSPACE" -scheme "$SCHEME" \
    -clonedSourcePackagesDirPath "$SPM_DIR" -skipPackagePluginValidation
  xcodebuild -workspace "$WORKSPACE" -scheme "$SCHEME" \
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
  app="$(find "$DERIVED_DATA/Build/Products" -type d -name 'AdaptyRnSdkExample.app' -print -quit 2>/dev/null || true)"
  if [[ -z "$app" ]]; then echo "FATAL: AdaptyRnSdkExample.app not found under $DERIVED_DATA/Build/Products" >&2; exit 1; fi
  find "$app" -type f \( -name AdaptyRnSdkExample -o -name '*.dylib' -o -path '*.framework/*' \) 2>/dev/null | while IFS= read -r f; do
    if file -b "$f" 2>/dev/null | grep -q 'Mach-O'; then printf '%s\n' "$f"; fi
  done
}

assert_mode() { # $1 = on|off
  local mode="$1" bins otool_all="" nm_all="" fw sym
  bins="$(list_binaries)"
  if [[ -z "$bins" ]]; then echo "FATAL: no Mach-O binaries found inside AdaptyRnSdkExample.app" >&2; exit 1; fi
  while IFS= read -r b; do
    [[ -n "$b" ]] || continue
    otool_all+="$(otool -L "$b" 2>/dev/null || true)"$'\n'
    nm_all+="$(nm "$b" 2>/dev/null || true)"$'\n'
  done <<< "$bins"

  # here-strings (not pipes) — nm output is multi-MB; a pipe + grep -q early-exit triggers
  # SIGPIPE under `set -o pipefail` and would falsely report "absent".
  if ! sentinel_present <<< "$nm_all"; then
    echo "FATAL: sentinel '$SENTINEL_SYMBOL' not found in any App.app binary — inspection is vacuous." >&2
    exit 1
  fi
  if frameworks_present <<< "$otool_all"; then fw=present; else fw=absent; fi
  if symbols_present    <<< "$nm_all";    then sym=present; else sym=absent; fi
  echo "kids-mode=$mode  frameworks=$fw  symbols=$sym  sentinel=ok"

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
  log "Kids Mode $mode — pod install (toggle trait)"
  pod_install "$mode"
  log "Kids Mode $mode — build App"
  build_app
  log "Kids Mode $mode — inspect AdaptyRnSdkExample.app Mach-O binaries"
  assert_mode "$mode"
}

main() {
  local cmd="${1:-}"
  case "$cmd" in
    on|off|both) ;;
    *) echo "usage: $0 <on|off|both>" >&2; exit 2 ;;
  esac
  trap restore_pods EXIT
  case "$cmd" in
    on)   run_mode on ;;
    off)  run_mode off ;;
    both) run_mode off; run_mode on ;;
  esac
  log "Kids Mode verification ($cmd): PASSED"
}

if [[ "${BASH_SOURCE[0]}" == "${0:-}" ]]; then
  main "$@"
fi
