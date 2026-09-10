#!/usr/bin/env node
/**
 * Toggles Adapty Kids Mode (COPPA / App Store Kids Category) for iOS on the
 * Swift Package Manager integration path (React Native 0.87+, `npx react-native spm`).
 *
 * Flips this package's default trait set in Package.swift between
 * `.default(enabledTraits: [])` and `.default(enabledTraits: ["AdaptyReactNativeKidsMode"])`.
 * The trait forwards to the native `KidsMode` trait of AdaptySDK-iOS, which compiles out
 * all IDFA / AdSupport / AppTrackingTransparency code.
 *
 * Why a postinstall hook: React Native's SwiftPM autolinking has no notion of package
 * traits, and the aggregator that references this library is regenerated on every sync,
 * so an app cannot enable the trait from its own project. Patching this manifest inside
 * the app's node_modules is the only lever — and it has to be re-applied after every
 * install, which is exactly what postinstall is for.
 *
 *   "scripts": { "postinstall": "adapty-spm-kids-mode enable" }          // enable (default)
 *   "scripts": { "postinstall": "adapty-spm-kids-mode disable" }  // turn it back off
 *
 * Commands: enable (default) | disable — same verbs as @adapty/capacitor.
 * Flags: --app-root=<path> when the app is not at INIT_CWD;
 *        --no-warnings (or ADAPTY_KIDS_MODE_NO_WARNINGS=1) to silence the checks below.
 *
 * The checks never fail the install — they warn. A CocoaPods app is the one that matters:
 * there Package.swift is never read, so the patch applies but changes nothing, and Kids
 * Mode has to come from ios/adapty_kids_mode.rb instead.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const TRAIT_NAME = 'AdaptyReactNativeKidsMode';
const ANCHOR_DISABLED = '.default(enabledTraits: [])';
const ANCHOR_ENABLED = `.default(enabledTraits: ["${TRAIT_NAME}"])`;

const COMMANDS = {
  enable: true,
  disable: false,
};

function applyKidsMode(manifestText, enabled) {
  const from = enabled ? ANCHOR_DISABLED : ANCHOR_ENABLED;
  const to = enabled ? ANCHOR_ENABLED : ANCHOR_DISABLED;
  if (manifestText.includes(to)) {
    return { text: manifestText, changed: false };
  }
  if (!manifestText.includes(from)) {
    throw new Error(
      `Kids Mode anchor not found in Package.swift: expected "${from}" or "${to}". ` +
        'The manifest format may have changed — do not ship a kids-category build until this is resolved.',
    );
  }
  return { text: manifestText.replace(from, to), changed: true };
}

/**
 * Positive proof that the app is SwiftPM-integrated, mirroring what React Native
 * itself looks for: `findInjectedXcodeproj` in scripts/spm/generate-spm-xcodeproj.js
 * tests for the .spm-injected.json marker, and RN's own CI gates its SwiftPM jobs on
 * that same file. The marker has existed since the very first SwiftPM commit, so there
 * is no RN version that injects SwiftPM without writing it.
 *
 * The pbxproj fallback covers a project someone wired up by hand instead of through
 * `react-native spm`: the injected build phase and the generated-code package reference
 * are both present in every injected project.
 */
function findSpmXcodeproj(iosDir) {
  let entries;
  try {
    entries = fs.readdirSync(iosDir);
  } catch {
    return null;
  }
  for (const name of entries) {
    if (!name.endsWith('.xcodeproj')) continue;
    const proj = path.join(iosDir, name);
    if (fs.existsSync(path.join(proj, '.spm-injected.json'))) {
      return proj;
    }
    try {
      const pbxproj = fs.readFileSync(path.join(proj, 'project.pbxproj'), 'utf8');
      if (
        pbxproj.includes('Sync SPM Autolinking') ||
        pbxproj.includes('relativePath = build/generated/ios')
      ) {
        return proj;
      }
    } catch {
      // no pbxproj to read; try the next .xcodeproj
    }
  }
  return null;
}

/**
 * Whether the app's Podfile declares React Native — the same test RN uses in
 * `podfileHasRnIntegration`. RN and CocoaPods must never both provide React Native,
 * so this stays a hard veto even when the SwiftPM marker is present.
 */
function podfileDeclaresReactNative(iosDir) {
  try {
    const contents = fs.readFileSync(path.join(iosDir, 'Podfile'), 'utf8');
    return /use_react_native!|use_native_modules!|prepare_react_native_project!/.test(contents);
  } catch {
    return false;
  }
}

function resolveIosDir(appRoot) {
  return path.join(appRoot, 'ios');
}

/**
 * Reasons this patch may not reach the build. Every one of these reads a file that lives
 * in the repo, so they work the same on any OS — the machine running the install does not
 * have to be the one that builds iOS.
 */
function collectWarnings(iosDir) {
  const warnings = [];
  if (podfileDeclaresReactNative(iosDir)) {
    warnings.push(
      'adapty-spm-kids-mode: WARNING — this app integrates iOS through CocoaPods, where\n' +
        '  Package.swift is never read. Kids Mode is NOT active: the build still links AdSupport.\n' +
        '  Add `adapty_enable_kids_mode(installer)` to the post_install block in ios/Podfile.\n' +
        '  Docs: https://adapty.io/docs/kids-mode-react-native',
    );
  } else if (findSpmXcodeproj(iosDir) == null) {
    warnings.push(
      `adapty-spm-kids-mode: WARNING — could not confirm a SwiftPM integration under ${iosDir}.\n` +
        '  No .xcodeproj there carries React Native\'s .spm-injected.json marker, so Kids Mode\n' +
        '  may not reach the build. If the iOS project lives elsewhere, pass\n' +
        '  --app-root=path/to/app; if iOS is not set up yet, run `cd ios && npx react-native spm`.',
    );
  }
  return warnings;
}

function runCli(argv, manifestPath, appRoot, options = {}) {
  const { env = process.env } = options;
  const flags = argv.filter((a) => a.startsWith('--'));
  const args = argv.filter((a) => !a.startsWith('--'));
  const appRootFlag = flags.find((a) => a.startsWith('--app-root='));
  const root = appRootFlag ? appRootFlag.slice('--app-root='.length) : appRoot;
  const quiet =
    flags.includes('--no-warnings') || env.ADAPTY_KIDS_MODE_NO_WARNINGS === '1';

  const command = args[0] ?? 'enable';
  if (!(command in COMMANDS)) {
    console.error(
      `adapty-spm-kids-mode: unknown command "${command}" (expected "enable" or "disable")`,
    );
    return 2;
  }
  const enabled = COMMANDS[command];

  const source = fs.readFileSync(manifestPath, 'utf8');
  const result = applyKidsMode(source, enabled);
  if (result.changed) {
    fs.writeFileSync(manifestPath, result.text);
    console.log(`adapty-spm-kids-mode: Kids Mode ${enabled ? 'ENABLED' : 'DISABLED'} in ${manifestPath}`);
    console.log(
      'adapty-spm-kids-mode: clean the build folder before the next iOS build ' +
        '(Xcode > Product > Clean Build Folder)',
    );
  } else {
    console.log(
      `adapty-spm-kids-mode: Kids Mode already ${enabled ? 'enabled' : 'disabled'}.`,
    );
  }

  // Warn last so it is the final thing on screen, and never fail the install over it.
  if (!quiet) {
    for (const warning of collectWarnings(resolveIosDir(root))) {
      console.warn(warning);
      console.warn('adapty-spm-kids-mode: silence this with --no-warnings.');
    }
  }
  return 0;
}

module.exports = {
  applyKidsMode,
  collectWarnings,
  findSpmXcodeproj,
  podfileDeclaresReactNative,
  runCli,
  ANCHOR_DISABLED,
  ANCHOR_ENABLED,
  TRAIT_NAME,
};

if (require.main === module) {
  const manifestPath = path.join(__dirname, '..', 'Package.swift');
  // npm and yarn both set INIT_CWD to the directory the install was started from —
  // the consuming app's root when this runs as its postinstall hook.
  const appRoot = process.env.INIT_CWD || process.cwd();
  try {
    process.exitCode = runCli(process.argv.slice(2), manifestPath, appRoot);
  } catch (err) {
    console.error(`adapty-spm-kids-mode: FAILED — ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
