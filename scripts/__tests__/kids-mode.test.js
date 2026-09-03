/* eslint-env jest */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  applyKidsMode,
  collectWarnings,
  findSpmXcodeproj,
  podfileDeclaresReactNative,
  runCli,
  ANCHOR_DISABLED,
  ANCHOR_ENABLED,
} = require('../kids-mode.cjs');

const FIXTURE = `// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "ReactNativeAdapty",
    traits: [
        .default(enabledTraits: []),
        .trait(
            name: "AdaptyReactNativeKidsMode",
            description: "COPPA build."
        )
    ]
)
`;

// A SwiftPM app keeps a Podfile as a marker, but without RN integration in it.
const SPM_PODFILE = "platform :ios, '15.1'\n\ntarget 'App' do\nend\n";
const PODS_PODFILE = "target 'App' do\n  config = use_native_modules!\n  use_react_native!(:path => config[:reactNativePath])\nend\n";

/**
 * @param {{podfile?: string|null, spm?: 'marker'|'pbxproj'|null}} opts
 */
function makeApp({ podfile = null, spm = null } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'adapty-kids-app-'));
  const ios = path.join(dir, 'ios');
  fs.mkdirSync(ios, { recursive: true });
  if (podfile !== null) {
    fs.writeFileSync(path.join(ios, 'Podfile'), podfile);
  }
  if (spm !== null) {
    const proj = path.join(ios, 'App.xcodeproj');
    fs.mkdirSync(proj, { recursive: true });
    if (spm === 'marker') {
      fs.writeFileSync(path.join(proj, '.spm-injected.json'), '{"rootUuid":"X"}');
    } else {
      // hand-wired project: no marker, but the injected build phase is there
      fs.writeFileSync(path.join(proj, 'project.pbxproj'), 'name = "Sync SPM Autolinking";');
    }
  }
  return dir;
}

describe('applyKidsMode', () => {
  it('enables the trait in a pristine manifest', () => {
    const result = applyKidsMode(FIXTURE, true);
    expect(result.changed).toBe(true);
    expect(result.text).toContain(ANCHOR_ENABLED);
    expect(result.text).not.toContain(ANCHOR_DISABLED);
  });

  it('is a no-op when already enabled', () => {
    const enabled = applyKidsMode(FIXTURE, true).text;
    const again = applyKidsMode(enabled, true);
    expect(again.changed).toBe(false);
    expect(again.text).toBe(enabled);
  });

  it('disable after enable restores the manifest byte-for-byte', () => {
    const enabled = applyKidsMode(FIXTURE, true).text;
    const restored = applyKidsMode(enabled, false);
    expect(restored.changed).toBe(true);
    expect(restored.text).toBe(FIXTURE);
  });

  it('throws loudly when the anchor is missing', () => {
    expect(() => applyKidsMode('let package = Package()', true)).toThrow(/anchor not found/i);
  });
});

describe('findSpmXcodeproj', () => {
  it('finds a project by React Native\'s .spm-injected.json marker', () => {
    const app = makeApp({ podfile: SPM_PODFILE, spm: 'marker' });
    expect(findSpmXcodeproj(path.join(app, 'ios'))).toContain('App.xcodeproj');
  });

  it('falls back to the injected build phase for a hand-wired project', () => {
    const app = makeApp({ podfile: SPM_PODFILE, spm: 'pbxproj' });
    expect(findSpmXcodeproj(path.join(app, 'ios'))).toContain('App.xcodeproj');
  });

  it('finds nothing in a CocoaPods project', () => {
    const app = makeApp({ podfile: PODS_PODFILE });
    expect(findSpmXcodeproj(path.join(app, 'ios'))).toBeNull();
  });

  it('finds nothing when the directory does not exist', () => {
    expect(findSpmXcodeproj('/definitely/not/here')).toBeNull();
  });
});

describe('podfileDeclaresReactNative', () => {
  it('is true for a CocoaPods Podfile', () => {
    const app = makeApp({ podfile: PODS_PODFILE });
    expect(podfileDeclaresReactNative(path.join(app, 'ios'))).toBe(true);
  });

  it('is false for a SwiftPM marker Podfile', () => {
    const app = makeApp({ podfile: SPM_PODFILE });
    expect(podfileDeclaresReactNative(path.join(app, 'ios'))).toBe(false);
  });

  it('is false when there is no Podfile', () => {
    expect(podfileDeclaresReactNative(path.join(makeApp(), 'ios'))).toBe(false);
  });
});

describe('runCli', () => {
  let dir;
  let manifest;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'adapty-kids-manifest-'));
    manifest = path.join(dir, 'Package.swift');
    fs.writeFileSync(manifest, FIXTURE);
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('enables by default, with no command', () => {
    const app = makeApp({ podfile: SPM_PODFILE, spm: 'marker' });
    expect(runCli([], manifest, app)).toBe(0);
    expect(fs.readFileSync(manifest, 'utf8')).toContain(ANCHOR_ENABLED);
  });

  it('accepts enable', () => {
    const command = 'enable';
    const app = makeApp({ podfile: SPM_PODFILE, spm: 'marker' });
    expect(runCli([command], manifest, app)).toBe(0);
    expect(fs.readFileSync(manifest, 'utf8')).toContain(ANCHOR_ENABLED);
  });

  it('accepts disable', () => {
    const command = 'disable';
    const app = makeApp({ podfile: SPM_PODFILE, spm: 'marker' });
    fs.writeFileSync(manifest, applyKidsMode(FIXTURE, true).text);
    expect(runCli([command], manifest, app)).toBe(0);
    expect(fs.readFileSync(manifest, 'utf8')).toBe(FIXTURE);
  });

  // The verbs deliberately match @adapty/capacitor; on/off are not accepted.
  it.each([['sometimes'], ['on'], ['off']])(
    'rejects "%s" without touching the manifest',
    (command) => {
      const app = makeApp({ podfile: SPM_PODFILE, spm: 'marker' });
      expect(runCli([command], manifest, app)).toBe(2);
      expect(fs.readFileSync(manifest, 'utf8')).toBe(FIXTURE);
    },
  );

  it('patches a CocoaPods app but warns that Kids Mode is not active', () => {
    const app = makeApp({ podfile: PODS_PODFILE });
    expect(runCli(['enable'], manifest, app)).toBe(0);
    expect(fs.readFileSync(manifest, 'utf8')).toContain(ANCHOR_ENABLED);
    expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/WARNING.*CocoaPods/s));
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringMatching(/adapty\.io\/docs\/kids-mode-react-native/),
    );
  });

  it('warns when SwiftPM cannot be confirmed, and still patches', () => {
    const app = makeApp({ podfile: SPM_PODFILE });
    expect(runCli(['enable'], manifest, app)).toBe(0);
    expect(fs.readFileSync(manifest, 'utf8')).toContain(ANCHOR_ENABLED);
    expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/could not confirm/i));
  });

  it('says nothing extra when the app is a proven SwiftPM one', () => {
    const app = makeApp({ podfile: SPM_PODFILE, spm: 'marker' });
    expect(runCli(['enable'], manifest, app)).toBe(0);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('--no-warnings silences the checks but still patches', () => {
    const app = makeApp({ podfile: PODS_PODFILE });
    expect(runCli(['enable', '--no-warnings'], manifest, app)).toBe(0);
    expect(fs.readFileSync(manifest, 'utf8')).toContain(ANCHOR_ENABLED);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('ADAPTY_KIDS_MODE_NO_WARNINGS=1 does the same', () => {
    const app = makeApp({ podfile: PODS_PODFILE });
    const opts = { env: { ADAPTY_KIDS_MODE_NO_WARNINGS: '1' } };
    expect(runCli(['enable'], manifest, app, opts)).toBe(0);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('accepts --app-root for an app outside the install directory', () => {
    const app = makeApp({ podfile: SPM_PODFILE, spm: 'marker' });
    expect(runCli(['enable', `--app-root=${app}`], manifest, '/nowhere')).toBe(0);
    expect(fs.readFileSync(manifest, 'utf8')).toContain(ANCHOR_ENABLED);
  });
});

describe('collectWarnings', () => {
  it('reports CocoaPods, and only that, for a pods app', () => {
    const warnings = collectWarnings(path.join(makeApp({ podfile: PODS_PODFILE }), 'ios'));
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatch(/CocoaPods/);
  });

  it('is silent for a proven SwiftPM app', () => {
    const app = makeApp({ podfile: SPM_PODFILE, spm: 'marker' });
    expect(collectWarnings(path.join(app, 'ios'))).toEqual([]);
  });

  it('reads only repo files, so it behaves the same on any OS', () => {
    const app = makeApp({ podfile: SPM_PODFILE, spm: 'pbxproj' });
    expect(collectWarnings(path.join(app, 'ios'))).toEqual([]);
  });
});
