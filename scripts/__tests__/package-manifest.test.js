/* eslint-env jest */
'use strict';

/**
 * Guards the SwiftPM manifest against silent drift.
 *
 * Package.swift cannot be checked by `swift build`: its React dependency resolves only
 * through a symlink React Native's autolinker creates inside a consuming app. And the
 * CocoaPods path never reads it at all, so every existing build job is blind to it.
 * These are the invariants that would otherwise break for SwiftPM users only, after
 * release, with no build failure anywhere.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const MANIFEST = fs.readFileSync(path.join(ROOT, 'Package.swift'), 'utf8');
const PODSPEC = fs.readFileSync(
  path.join(ROOT, 'react-native-adapty-sdk.podspec'),
  'utf8',
);

/** Source files under ios/, relative to it — the same set the podspec globs. */
function iosSources(extension) {
  const iosDir = path.join(ROOT, 'ios');
  const found = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name.endsWith('.xcodeproj')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(extension)) found.push(path.relative(iosDir, full));
    }
  };
  walk(iosDir);
  return found.sort();
}

/** The `sources: [...]` list of one target in the manifest. */
function declaredSources(targetName) {
  const afterTarget = MANIFEST.split(`name: "${targetName}"`)[1];
  expect(afterTarget).toBeDefined();
  const list = afterTarget.split('sources: [')[1].split(']')[0];
  return [...list.matchAll(/"([^"]+)"/g)].map((m) => m[1]).sort();
}

describe('AdaptySDK-iOS pin', () => {
  // CocoaPods reads only the podspec and SwiftPM only the manifest, so a bump that
  // touches one ships a different native SDK to each half of the userbase — and nothing
  // fails at build time, because the JS layer calls AdaptyPlugin by method name.
  it('is the same version in Package.swift and the podspec', () => {
    const manifestPin = MANIFEST.match(/exact:\s*"([\d.]+)"/);
    const podspecPin = PODSPEC.match(/kind:\s*'exactVersion',\s*version:\s*'([\d.]+)'/);
    expect(manifestPin).not.toBeNull();
    expect(podspecPin).not.toBeNull();
    expect(manifestPin[1]).toBe(podspecPin[1]);
  });
});

describe('target sources', () => {
  // The podspec globs ios/**; the manifest lists files by hand, because SwiftPM cannot
  // compile Swift and Objective-C in one target. A new file added to ios/ builds under
  // CocoaPods and is silently absent under SwiftPM until these lists are updated.
  it('cover every Swift file in ios/', () => {
    expect(declaredSources('AdaptyReactNative')).toEqual(iosSources('.swift'));
  });

  it('cover every Objective-C file in ios/', () => {
    expect(declaredSources('AdaptyReactNativeObjC')).toEqual(iosSources('.m'));
  });

  it('keep each language in its own target', () => {
    expect(declaredSources('AdaptyReactNative').every((f) => f.endsWith('.swift'))).toBe(true);
    expect(declaredSources('AdaptyReactNativeObjC').every((f) => f.endsWith('.m'))).toBe(true);
  });
});

describe('Kids Mode trait anchor', () => {
  // scripts/kids-mode.cjs rewrites this exact string. Reformatting the manifest would
  // make every consumer's `adapty-spm-kids-mode` postinstall throw, failing their install.
  const { ANCHOR_DISABLED, TRAIT_NAME } = require('../kids-mode.cjs');

  it('is present verbatim, and off by default', () => {
    expect(MANIFEST).toContain(ANCHOR_DISABLED);
  });

  it('declares the trait the anchor switches on', () => {
    expect(MANIFEST).toContain(`name: "${TRAIT_NAME}"`);
  });
});

describe('deployment target', () => {
  it('matches the podspec', () => {
    const manifestVersion = MANIFEST.match(/\.iOS\(\.v(\d+)\)/)[1];
    const podspecVersion = PODSPEC.match(/:ios\s*=>\s*"(\d+)\.\d+"/)[1];
    expect(manifestVersion).toBe(podspecVersion);
  });
});
