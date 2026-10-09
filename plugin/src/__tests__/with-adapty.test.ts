import { AndroidConfig } from 'expo/config-plugins';
import * as XML from '@expo/config-plugins/build/utils/XML';
import type {
  ExportedConfig,
  Mod,
} from '@expo/config-plugins/build/Plugin.types';

import withAdapty, {
  type AdaptyPluginProps,
  type FallbackFileInput,
} from '../with-adapty';

// Expo types `ConfigPlugin` as returning `ExpoConfig`, but in practice the
// returned object is `ExportedConfig` (with `mods` attached). The helper
// applies the plugin to a fresh fixture and asserts the richer return type
// so tests can read `config.mods` without per-call casts.
function applyPlugin(props?: AdaptyPluginProps): ExportedConfig {
  return withAdapty(
    { name: 'test-app', slug: 'test-app' },
    props,
  ) as ExportedConfig;
}

// Sample AndroidManifest.xml fixtures
const SAMPLE_MANIFEST_XML = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.example.app">
  <application
    android:name=".MainApplication"
    android:label="@string/app_name"
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:allowBackup="true"
    android:theme="@style/AppTheme">
    <activity
      android:name=".MainActivity"
      android:label="@string/app_name"
      android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
  </application>
</manifest>`;

const MANIFEST_WITH_EXISTING_BACKUP = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.example.app">
  <application
    android:name=".MainApplication"
    android:label="@string/app_name"
    android:fullBackupContent="@xml/existing_backup_rules"
    android:dataExtractionRules="@xml/existing_extraction_rules">
    <activity
      android:name=".MainActivity"
      android:label="@string/app_name">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
      </intent-filter>
    </activity>
  </application>
</manifest>`;

const MANIFEST_WITH_EXISTING_TOOLS_REPLACE = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" 
          xmlns:tools="http://schemas.android.com/tools"
          package="com.example.app">
  <application
    android:name=".MainApplication"
    android:label="@string/app_name"
    tools:replace="android:allowBackup">
    <activity
      android:name=".MainActivity"
      android:label="@string/app_name">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
      </intent-filter>
    </activity>
  </application>
</manifest>`;

async function getFixtureManifestAsync(
  xml = SAMPLE_MANIFEST_XML,
): Promise<AndroidConfig.Manifest.AndroidManifest> {
  return (await XML.parseXMLAsync(
    xml,
  )) as unknown as AndroidConfig.Manifest.AndroidManifest;
}

describe('withAdapty expo config plugin', () => {
  // Mock console.log to avoid cluttering test output
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('when replaceAndroidBackupConfig is false', () => {
    it('should not modify manifest when disabled', async () => {
      const manifest = await getFixtureManifestAsync();
      const originalManifest = await getFixtureManifestAsync();

      const config = applyPlugin({ replaceAndroidBackupConfig: false });

      // Plugin adds mod, but mod should not modify the manifest
      expect(config.mods).toBeDefined();
      expect(config.mods.android.manifest).toBeDefined();

      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: manifest,
      } as any);

      const app = AndroidConfig.Manifest.getMainApplication(modResults);
      const originalApp =
        AndroidConfig.Manifest.getMainApplication(originalManifest);

      // Manifest should not be modified
      expect(app.$['android:fullBackupContent']).toBe(
        originalApp.$['android:fullBackupContent'],
      );
      expect(app.$['android:dataExtractionRules']).toBe(
        originalApp.$['android:dataExtractionRules'],
      );
      expect(modResults.manifest.$['xmlns:tools']).toBeUndefined();

      // Console should show it's skipped
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[react-native-adapty] Android backup config replacement disabled, skipping',
      );
    });

    it('should not modify manifest with default options', async () => {
      const manifest = await getFixtureManifestAsync();

      const config = applyPlugin();

      // Plugin adds mod even with default options
      expect(config.mods).toBeDefined();

      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: manifest,
      } as any);

      const app = AndroidConfig.Manifest.getMainApplication(modResults);

      // Default behavior is disabled, so no changes should be made
      expect(app.$['android:fullBackupContent']).not.toBe(
        '@xml/rn_adapty_backup_rules',
      );
      expect(modResults.manifest.$['xmlns:tools']).toBeUndefined();
    });
  });

  describe('when replaceAndroidBackupConfig is true', () => {
    it('should add backup rules to manifest', async () => {
      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      // Plugin should add the manifest mod
      expect(config.mods).toBeDefined();
      expect(config.mods.android).toBeDefined();
      expect(config.mods.android.manifest).toBeDefined();

      // Call the mod with test data
      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: await getFixtureManifestAsync(),
      } as any);

      const manifestRoot = modResults.manifest;
      const app = AndroidConfig.Manifest.getMainApplication(modResults);

      // Verify tools namespace was added
      expect(manifestRoot.$['xmlns:tools']).toBe(
        'http://schemas.android.com/tools',
      );

      // Verify backup rules were set
      expect(app.$['android:fullBackupContent']).toBe(
        '@xml/rn_adapty_backup_rules',
      );
      expect(app.$['android:dataExtractionRules']).toBe(
        '@xml/rn_adapty_data_extraction_rules',
      );

      // Verify tools:replace was set
      expect(app.$['tools:replace']).toBe(
        'android:fullBackupContent,android:dataExtractionRules',
      );

      // Verify console log was called
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[react-native-adapty] Successfully applied Android backup rules',
      );
    });

    it('should replace existing backup rules', async () => {
      const manifest = await getFixtureManifestAsync(
        MANIFEST_WITH_EXISTING_BACKUP,
      );
      const app = AndroidConfig.Manifest.getMainApplication(manifest);

      // Verify initial state
      expect(app.$['android:fullBackupContent']).toBe(
        '@xml/existing_backup_rules',
      );
      expect(app.$['android:dataExtractionRules']).toBe(
        '@xml/existing_extraction_rules',
      );

      // Apply plugin
      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: manifest,
      } as any);

      const modifiedApp = AndroidConfig.Manifest.getMainApplication(modResults);

      // Verify old values were replaced
      expect(modifiedApp.$['android:fullBackupContent']).toBe(
        '@xml/rn_adapty_backup_rules',
      );
      expect(modifiedApp.$['android:dataExtractionRules']).toBe(
        '@xml/rn_adapty_data_extraction_rules',
      );
      expect(modifiedApp.$['tools:replace']).toBe(
        'android:fullBackupContent,android:dataExtractionRules',
      );
    });

    it('should merge with existing tools:replace attributes', async () => {
      const manifest = await getFixtureManifestAsync(
        MANIFEST_WITH_EXISTING_TOOLS_REPLACE,
      );
      const app = AndroidConfig.Manifest.getMainApplication(manifest);

      // Verify initial tools:replace
      expect(app.$['tools:replace']).toBe('android:allowBackup');

      // Apply plugin
      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: manifest,
      } as any);

      const modifiedApp = AndroidConfig.Manifest.getMainApplication(modResults);
      const finalReplace = modifiedApp.$['tools:replace'];

      // Verify merged result includes both old and new attributes
      expect(finalReplace).toContain('android:allowBackup');
      expect(finalReplace).toContain('android:fullBackupContent');
      expect(finalReplace).toContain('android:dataExtractionRules');

      // Should not have duplicates
      const attrs = finalReplace.split(',');
      const uniqueAttrs = [...new Set(attrs)];
      expect(attrs.length).toBe(uniqueAttrs.length);
      expect(uniqueAttrs.length).toBe(3);
    });

    it('should handle manifest without $ property', async () => {
      const manifest = await getFixtureManifestAsync();
      // Remove the $ property to test initialization
      delete manifest.manifest.$;

      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: manifest,
      } as any);

      const manifestRoot = modResults.manifest;

      // Should create the $ property
      expect(manifestRoot.$).toBeDefined();
      expect(manifestRoot.$['xmlns:tools']).toBe(
        'http://schemas.android.com/tools',
      );
    });

    it('should be idempotent when applied multiple times', async () => {
      const manifest = await getFixtureManifestAsync();

      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      // Apply once
      const { modResults: firstResult } = await config.mods.android.manifest({
        modRequest: {},
        modResults: await getFixtureManifestAsync(),
      } as any);

      const firstFormatted = XML.format(firstResult);
      const firstApp = AndroidConfig.Manifest.getMainApplication(firstResult);

      // Apply again with the result
      const { modResults: secondResult } = await config.mods.android.manifest({
        modRequest: {},
        modResults: firstResult,
      } as any);

      const secondFormatted = XML.format(secondResult);
      const secondApp = AndroidConfig.Manifest.getMainApplication(secondResult);

      // Results should be identical
      expect(secondFormatted).toBe(firstFormatted);
      expect(secondApp.$['tools:replace']).toBe(firstApp.$['tools:replace']);
      expect(secondApp.$['tools:replace']).toBe(
        'android:fullBackupContent,android:dataExtractionRules',
      );
    });

    it('should preserve other application attributes', async () => {
      const manifest = await getFixtureManifestAsync();
      const app = AndroidConfig.Manifest.getMainApplication(manifest);

      // Store original attributes
      const originalLabel = app.$['android:label'];
      const originalIcon = app.$['android:icon'];
      const originalAllowBackup = app.$['android:allowBackup'];

      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: manifest,
      } as any);

      const modifiedApp = AndroidConfig.Manifest.getMainApplication(modResults);

      // Verify original attributes are preserved
      expect(modifiedApp.$['android:label']).toBe(originalLabel);
      expect(modifiedApp.$['android:icon']).toBe(originalIcon);
      expect(modifiedApp.$['android:allowBackup']).toBe(originalAllowBackup);

      // Verify new attributes are added
      expect(modifiedApp.$['android:fullBackupContent']).toBe(
        '@xml/rn_adapty_backup_rules',
      );
      expect(modifiedApp.$['android:dataExtractionRules']).toBe(
        '@xml/rn_adapty_data_extraction_rules',
      );
    });

    it('should handle empty tools:replace gracefully', async () => {
      const manifest = await getFixtureManifestAsync();
      const app = AndroidConfig.Manifest.getMainApplication(manifest);

      // Set empty tools:replace
      app.$['tools:replace'] = '';

      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: manifest,
      } as any);

      const modifiedApp = AndroidConfig.Manifest.getMainApplication(modResults);

      // Should handle empty string correctly
      expect(modifiedApp.$['tools:replace']).toContain(
        'android:fullBackupContent',
      );
      expect(modifiedApp.$['tools:replace']).toContain(
        'android:dataExtractionRules',
      );
    });
  });

  describe('plugin configuration', () => {
    it('should be wrapped with createRunOncePlugin', () => {
      expect(typeof withAdapty).toBe('function');
      expect(withAdapty.name).toBeDefined();
    });

    it('should have correct plugin metadata', () => {
      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      // createRunOncePlugin adds _internal metadata
      expect(config._internal).toBeDefined();
    });

    it('should accept options parameter', () => {
      // Should work with no options
      expect(() =>
        withAdapty({ name: 'test', slug: 'test' }, undefined),
      ).not.toThrow();

      // Should work with empty options
      expect(() =>
        withAdapty({ name: 'test', slug: 'test' }, {}),
      ).not.toThrow();

      // Should work with full options
      expect(() =>
        withAdapty(
          { name: 'test', slug: 'test' },
          { replaceAndroidBackupConfig: true },
        ),
      ).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle manifest with minimal structure', async () => {
      const minimalManifest =
        await XML.parseXMLAsync(`<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="com.test">
  <application android:name=".MainApplication">
    <activity android:name=".MainActivity">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
      </intent-filter>
    </activity>
  </application>
</manifest>`);

      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: minimalManifest,
      } as any);

      const app = AndroidConfig.Manifest.getMainApplication(modResults);

      expect(app.$['android:fullBackupContent']).toBe(
        '@xml/rn_adapty_backup_rules',
      );
      expect(app.$['android:dataExtractionRules']).toBe(
        '@xml/rn_adapty_data_extraction_rules',
      );
    });

    it('should handle tools:replace with whitespace', async () => {
      const manifest = await getFixtureManifestAsync(
        MANIFEST_WITH_EXISTING_TOOLS_REPLACE,
      );
      const app = AndroidConfig.Manifest.getMainApplication(manifest);

      // Add whitespace to tools:replace
      app.$['tools:replace'] = '  android:allowBackup  ,  android:theme  ';

      const config = applyPlugin({ replaceAndroidBackupConfig: true });

      const { modResults } = await config.mods.android.manifest({
        modRequest: {},
        modResults: manifest,
      } as any);

      const modifiedApp = AndroidConfig.Manifest.getMainApplication(modResults);
      const finalReplace = modifiedApp.$['tools:replace'];

      // Should handle whitespace correctly
      expect(finalReplace).toContain('android:allowBackup');
      expect(finalReplace).toContain('android:theme');
      expect(finalReplace).toContain('android:fullBackupContent');
      expect(finalReplace).toContain('android:dataExtractionRules');

      // Should not have duplicates
      const attrs = finalReplace.split(',');
      const uniqueAttrs = [...new Set(attrs)];
      expect(attrs.length).toBe(uniqueAttrs.length);
    });
  });

  describe('fallbackFile option', () => {
    // createRunOncePlugin stamps `_internal` on the config it processes
    // and short-circuits on subsequent invocations of the same object,
    // so each test needs its own fresh config object.

    it('should not register any fallback mods when fallbackFile is omitted', () => {
      const config = applyPlugin();

      // Only the manifest mod from withAndroidManifest should be present
      expect(config.mods?.ios?.xcodeproj).toBeUndefined();
      expect(config.mods?.android?.dangerous).toBeUndefined();
      expect(config.mods?.android?.manifest).toBeDefined();
    });

    it('should throw when fallbackFile is a string', () => {
      expect(() =>
        // Cast through unknown because the public type intentionally forbids
        // the string form. The runtime guard is the contract this test pins.
        applyPlugin({
          fallbackFile:
            './assets/fallback.json' as unknown as FallbackFileInput,
        }),
      ).toThrow(/`fallbackFile` must be an object/);
    });

    it('should throw when fallbackFile is an array', () => {
      expect(() =>
        applyPlugin({ fallbackFile: [] as unknown as FallbackFileInput }),
      ).toThrow(/`fallbackFile` must be an object/);
    });

    it('should register only iOS mod when fallbackFile.ios is provided alone', () => {
      const config = applyPlugin({
        fallbackFile: { ios: './assets/ios_fallback.json' },
      });

      expect(config.mods?.ios?.xcodeproj).toBeDefined();
      expect(config.mods?.android?.dangerous).toBeUndefined();
    });

    it('should register only Android mod when fallbackFile.android is provided alone', () => {
      const config = applyPlugin({
        fallbackFile: { android: './assets/android_fallback.json' },
      });

      expect(config.mods?.ios?.xcodeproj).toBeUndefined();
      expect(config.mods?.android?.dangerous).toBeDefined();
    });

    it('should register both mods when fallbackFile object has both platforms', () => {
      const config = applyPlugin({
        fallbackFile: {
          ios: './assets/ios_fallback.json',
          android: './assets/android_fallback.json',
        },
      });

      expect(config.mods?.ios?.xcodeproj).toBeDefined();
      expect(config.mods?.android?.dangerous).toBeDefined();
    });

    it('should coexist with replaceAndroidBackupConfig', () => {
      const config = applyPlugin({
        replaceAndroidBackupConfig: true,
        fallbackFile: {
          ios: './assets/ios_fallback.json',
          android: './assets/android_fallback.json',
        },
      });

      // Both Android mods should be present
      expect(config.mods?.android?.dangerous).toBeDefined();
      expect(config.mods?.android?.manifest).toBeDefined();
      expect(config.mods?.ios?.xcodeproj).toBeDefined();
    });

    it('should treat null/undefined inside object as missing platform', () => {
      const config = applyPlugin({
        fallbackFile: { ios: undefined, android: './assets/fallback.json' },
      });

      expect(config.mods?.ios?.xcodeproj).toBeUndefined();
      expect(config.mods?.android?.dangerous).toBeDefined();
    });

    it('should throw when fallbackFile is an empty string', () => {
      // Empty string used to be silently treated as missing while the string
      // shorthand existed; now any non-object truthy value should throw, and
      // the empty-string case isn't worth a special-case carve-out.
      expect(() =>
        applyPlugin({ fallbackFile: '' as unknown as FallbackFileInput }),
      ).toThrow(/`fallbackFile` must be an object/);
    });

    it('should treat empty string platform entries as missing', () => {
      const config = applyPlugin({
        fallbackFile: { ios: '', android: './assets/fallback.json' },
      });

      expect(config.mods?.ios?.xcodeproj).toBeUndefined();
      expect(config.mods?.android?.dangerous).toBeDefined();
    });

    it('should register no mods when both platform entries are empty', () => {
      const config = applyPlugin({
        fallbackFile: { ios: '', android: '' },
      });

      expect(config.mods?.ios?.xcodeproj).toBeUndefined();
      expect(config.mods?.android?.dangerous).toBeUndefined();
    });
  });

  describe('fallbackFile mod behavior', () => {
    const os = require('os');
    const fs = require('fs');
    const fsp = require('fs/promises');
    const nodePath = require('path');
    const { IOSConfig } = require('expo/config-plugins');

    let tmpRoot: string;
    beforeEach(async () => {
      tmpRoot = await fsp.mkdtemp(
        nodePath.join(os.tmpdir(), 'adapty-plugin-test-'),
      );
      await fsp.mkdir(nodePath.join(tmpRoot, 'assets'));
      await fsp.writeFile(
        nodePath.join(tmpRoot, 'assets', 'fallback.json'),
        '{"a":1}',
      );
    });

    afterEach(async () => {
      await fsp.rm(tmpRoot, { recursive: true, force: true });
    });

    it('Android dangerous mod copies the JSON to app/src/main/assets/<basename>', async () => {
      const config = applyPlugin({
        fallbackFile: { android: './assets/fallback.json' },
      });

      await config.mods.android.dangerous({
        modRequest: {
          projectRoot: tmpRoot,
          platformProjectRoot: nodePath.join(tmpRoot, 'android'),
        },
        modResults: {},
      } as any);

      const expectedPath = nodePath.join(
        tmpRoot,
        'android',
        'app',
        'src',
        'main',
        'assets',
        'fallback.json',
      );
      expect(fs.existsSync(expectedPath)).toBe(true);
      expect(await fsp.readFile(expectedPath, 'utf8')).toBe('{"a":1}');
    });

    it('Android dangerous mod creates the assets/ directory tree if missing', async () => {
      const config = applyPlugin({
        fallbackFile: { android: './assets/fallback.json' },
      });

      const platformRoot = nodePath.join(tmpRoot, 'android');
      // platformRoot intentionally does not exist yet.

      await config.mods.android.dangerous({
        modRequest: { projectRoot: tmpRoot, platformProjectRoot: platformRoot },
        modResults: {},
      } as any);

      expect(
        fs.existsSync(
          nodePath.join(platformRoot, 'app', 'src', 'main', 'assets'),
        ),
      ).toBe(true);
    });

    it('iOS xcodeproj mod registers the JSON via IOSConfig.XcodeUtils.addResourceFileToGroup', async () => {
      const ensureSpy = jest
        .spyOn(IOSConfig.XcodeUtils, 'ensureGroupRecursively')
        .mockImplementation(() => null);
      const addSpy = jest
        .spyOn(IOSConfig.XcodeUtils, 'addResourceFileToGroup')
        .mockImplementation(() => null);

      try {
        const config = applyPlugin({
          fallbackFile: { ios: './assets/fallback.json' },
        });

        const fakeProject = { __fake: true };
        await config.mods.ios.xcodeproj({
          modRequest: {
            projectRoot: tmpRoot,
            platformProjectRoot: nodePath.join(tmpRoot, 'ios'),
          },
          modResults: fakeProject,
        } as any);

        // Group must exist before files are added to it.
        expect(ensureSpy).toHaveBeenCalledWith(fakeProject, 'Resources');
        // The filepath given to Xcode is platform-relative (ios/ → ../assets/...).
        expect(addSpy).toHaveBeenCalledWith({
          filepath: nodePath.join('..', 'assets', 'fallback.json'),
          groupName: 'Resources',
          project: fakeProject,
          isBuildFile: true,
          verbose: false,
        });
      } finally {
        ensureSpy.mockRestore();
        addSpy.mockRestore();
      }
    });

    it('Android dangerous mod throws when the source JSON is missing', async () => {
      const config = applyPlugin({
        fallbackFile: { android: './assets/missing.json' },
      });

      await expect(
        config.mods.android.dangerous({
          modRequest: {
            projectRoot: tmpRoot,
            platformProjectRoot: nodePath.join(tmpRoot, 'android'),
          },
          modResults: {},
        } as any),
      ).rejects.toThrow(/ENOENT|no such file/i);
    });
  });

  describe('iosDisableSPM option', () => {
    const SPEC_REPO =
      'https://github.com/adaptyteam/AdaptySDK-CocoaPods-Specs.git';
    const EXPECTED_BLOCK = [
      '  # @generated begin react-native-adapty-cocoapods - expo prebuild (DO NOT MODIFY)',
      "  require Pod::Executable.execute_command('node', ['-p',",
      "    'require.resolve(",
      '      "react-native-adapty/ios/adapty_podfile.rb",',
      '      {paths: [process.argv[1]]},',
      "    )', __dir__]).strip",
      '  adapty_disable_spm!',
      '  # @generated end react-native-adapty-cocoapods',
      '  config = use_native_modules!',
    ].join('\n');

    // Trimmed Expo SDK 51 template Podfile.
    const SAMPLE_PODFILE = `require File.join(File.dirname(\`node --print "require.resolve('expo/package.json')"\`), "scripts/autolinking")

require 'json'
podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}

platform :ios, podfile_properties['ios.deploymentTarget'] || '13.4'

prepare_react_native_project!

target 'myapp' do
  use_expo_modules!
  config = use_native_modules!
end
`;

    const PODFILE_WITH_CDN_SOURCE = `source 'https://cdn.cocoapods.org/'

${SAMPLE_PODFILE}`;

    // Stale blocks in formats only pre-release plugin builds wrote (never published), or a
    // hand-edited block. This one sits before the first target: the flag and global sources.
    const PODFILE_WITH_GLOBAL_SOURCES_BLOCK = SAMPLE_PODFILE.replace(
      "target 'myapp' do",
      [
        '# @generated begin react-native-adapty-cocoapods - expo prebuild (DO NOT MODIFY)',
        '$AdaptyDisableSPM = true',
        `source '${SPEC_REPO}'`,
        "source 'https://cdn.cocoapods.org/'",
        '# @generated end react-native-adapty-cocoapods',
        "target 'myapp' do",
      ].join('\n'),
    );

    // This stale block sits inside the target: the flag and the pinned pods.
    const PODFILE_WITH_INLINE_PODS_BLOCK = SAMPLE_PODFILE.replace(
      '  use_expo_modules!',
      [
        '  # @generated begin react-native-adapty-cocoapods - expo prebuild (DO NOT MODIFY)',
        '  $AdaptyDisableSPM = true',
        `  pod 'Adapty', :source => '${SPEC_REPO}'`,
        `  pod 'AdaptyUI', :source => '${SPEC_REPO}'`,
        `  pod 'AdaptyPlugin', :source => '${SPEC_REPO}'`,
        '  # @generated end react-native-adapty-cocoapods',
        '  use_expo_modules!',
      ].join('\n'),
    );

    // `ModConfig` does not type the `podfile` mod that `withPodfile` registers.
    function getPodfileMod(config: ExportedConfig): Mod | undefined {
      return (config.mods?.ios as Record<string, Mod> | undefined)?.podfile;
    }

    async function runPodfileMod(
      config: ExportedConfig,
      contents: string,
    ): Promise<string> {
      const { modResults } = await getPodfileMod(config)({
        modRequest: {},
        modResults: { path: '/app/ios/Podfile', language: 'rb', contents },
      } as any);
      return modResults.contents;
    }

    function countOccurrences(src: string, needle: string): number {
      return src.split(needle).length - 1;
    }

    it('should leave a Podfile without the block unchanged when iosDisableSPM is omitted', async () => {
      const contents = await runPodfileMod(applyPlugin(), SAMPLE_PODFILE);

      expect(contents).toBe(SAMPLE_PODFILE);
    });

    it('should leave a Podfile without the block unchanged when iosDisableSPM is false', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: false }),
        SAMPLE_PODFILE,
      );

      expect(contents).toBe(SAMPLE_PODFILE);
    });

    it('should remove the block when iosDisableSPM is turned off', async () => {
      const generated = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE,
      );

      await expect(
        runPodfileMod(applyPlugin({ iosDisableSPM: false }), generated),
      ).resolves.toBe(SAMPLE_PODFILE);
      await expect(runPodfileMod(applyPlugin(), generated)).resolves.toBe(
        SAMPLE_PODFILE,
      );
    });

    it('should remove a stale block before the target when turned off', async () => {
      await expect(
        runPodfileMod(
          applyPlugin({ iosDisableSPM: false }),
          PODFILE_WITH_GLOBAL_SOURCES_BLOCK,
        ),
      ).resolves.toBe(SAMPLE_PODFILE);
    });

    it('should not require use_native_modules! when iosDisableSPM is off', async () => {
      const podfile = "platform :ios, '15.0'\ntarget 'myapp' do\nend\n";

      await expect(
        runPodfileMod(applyPlugin({ iosDisableSPM: false }), podfile),
      ).resolves.toBe(podfile);
    });

    it('should call adapty_disable_spm! right before use_native_modules!', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE,
      );

      expect(contents).toContain(
        `target 'myapp' do\n  use_expo_modules!\n${EXPECTED_BLOCK}\n`,
      );
    });

    it('should anchor on the call form of the Expo SDK 52+ template', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE.replace(
          '  config = use_native_modules!',
          [
            "  if ENV['EXPO_USE_COMMUNITY_AUTOLINKING'] == '1'",
            "    config_command = ['node', '-e', 'config']",
            '  else',
            "    config_command = ['npx', 'expo-modules-autolinking', 'react-native-config']",
            '  end',
            '',
            '  config = use_native_modules!(config_command)',
          ].join('\n'),
        ),
      );

      expect(contents).toContain(
        `  end\n\n${EXPECTED_BLOCK}(config_command)\n`,
      );
      expect(countOccurrences(contents, 'adapty_disable_spm!')).toBe(1);
    });

    // The Expo SDK 51 template wraps use_native_modules! at the top level, before any target.
    // The log line, absent from the template, mentions the call mid-line, as a looser regex
    // would match.
    it('should not anchor on a mention in the top-level SDK 51 override', async () => {
      const override = [
        "use_autolinking_method_symbol = ('use' + '_native' + '_modules!').to_sym",
        'origin_autolinking_method = self.method(use_autolinking_method_symbol)',
        'self.define_singleton_method(use_autolinking_method_symbol) do |*args|',
        "  Pod::UI.puts('Wrapping use_native_modules! with expo-modules-autolinking')",
        '  origin_autolinking_method.call()',
        'end',
        '',
        "platform :ios, podfile_properties['ios.deploymentTarget'] || '13.4'",
      ].join('\n');
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE.replace(
          "platform :ios, podfile_properties['ios.deploymentTarget'] || '13.4'",
          override,
        ),
      );

      expect(contents).toContain(
        `target 'myapp' do\n  use_expo_modules!\n${EXPECTED_BLOCK}\n`,
      );
      expect(countOccurrences(contents, 'adapty_disable_spm!')).toBe(1);
    });

    it('should skip an earlier target that only calls use_expo_modules!', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE.replace(
          "target 'myapp' do",
          "target 'NotificationService' do\n  use_expo_modules!\nend\n\ntarget 'myapp' do",
        ),
      );

      expect(contents).toContain(
        "target 'NotificationService' do\n  use_expo_modules!\nend\n",
      );
      expect(contents).toContain(
        `target 'myapp' do\n  use_expo_modules!\n${EXPECTED_BLOCK}\n`,
      );
      expect(countOccurrences(contents, 'adapty_disable_spm!')).toBe(1);
    });

    // There the extension's call declares the RN pod first, so the block must precede it.
    it('should anchor in an earlier target that calls use_native_modules!', async () => {
      const extension =
        "target 'ShareExtension' do\n  use_expo_modules!\n  config = use_native_modules!\nend\n";
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE.replace(
          "target 'myapp' do",
          `${extension}\ntarget 'myapp' do`,
        ),
      );

      expect(contents).toContain(
        `target 'ShareExtension' do\n  use_expo_modules!\n${EXPECTED_BLOCK}\nend\n`,
      );
      expect(countOccurrences(contents, 'adapty_disable_spm!')).toBe(1);
    });

    // Extension plugins append their targets after the app target; the global is set by then.
    it('should anchor in the app target before a later extension that calls use_native_modules!', async () => {
      const extension =
        "\ntarget 'ShareExtension' do\n  use_expo_modules!\n  config = use_native_modules!\nend\n";
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE + extension,
      );

      expect(contents).toContain(
        `target 'myapp' do\n  use_expo_modules!\n${EXPECTED_BLOCK}\n`,
      );
      expect(contents).toContain(extension);
      expect(countOccurrences(contents, 'adapty_disable_spm!')).toBe(1);
    });

    it('should leave the pod list and the spec repo to the Podfile helper', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE,
      );

      expect(contents).not.toContain('$AdaptyDisableSPM');
      expect(contents).not.toContain(SPEC_REPO);
      expect(contents).not.toMatch(/^\s*pod\s/m);
    });

    it('should not declare any global source', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE,
      );

      expect(contents).not.toMatch(/^\s*source\s/m);
    });

    it('should be idempotent when the Podfile mod runs twice', async () => {
      const first = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE,
      );
      const second = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        first,
      );

      expect(second).toBe(first);
      expect(countOccurrences(second, 'adapty_disable_spm!')).toBe(1);
    });

    it('should leave the sources declared by the user untouched', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        PODFILE_WITH_CDN_SOURCE,
      );

      expect(contents.startsWith("source 'https://cdn.cocoapods.org/'\n")).toBe(
        true,
      );
      expect(contents).toContain(EXPECTED_BLOCK);
    });

    it('should replace a stale block before the target', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        PODFILE_WITH_GLOBAL_SOURCES_BLOCK,
      );

      expect(contents).toBe(
        await runPodfileMod(
          applyPlugin({ iosDisableSPM: true }),
          SAMPLE_PODFILE,
        ),
      );
      expect(contents).not.toMatch(/^\s*source\s/m);
    });

    it('should replace a stale inline pods block', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        PODFILE_WITH_INLINE_PODS_BLOCK,
      );

      expect(contents).toBe(
        await runPodfileMod(
          applyPlugin({ iosDisableSPM: true }),
          SAMPLE_PODFILE,
        ),
      );
    });

    it('should remove a stale inline pods block when turned off', async () => {
      await expect(
        runPodfileMod(
          applyPlugin({ iosDisableSPM: false }),
          PODFILE_WITH_INLINE_PODS_BLOCK,
        ),
      ).resolves.toBe(SAMPLE_PODFILE);
    });

    it('should replace the block in a Podfile with CRLF line endings', async () => {
      const generated = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE,
      );
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        generated.replace(/\n/g, '\r\n'),
      );

      expect(countOccurrences(contents, 'adapty_disable_spm!')).toBe(1);
      expect(
        countOccurrences(contents, '# @generated end react-native-adapty'),
      ).toBe(1);
      expect(contents).not.toMatch(/[^\r]\n/);
    });

    it('should keep CRLF line endings when removing the block', async () => {
      const generated = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE,
      );

      await expect(
        runPodfileMod(
          applyPlugin({ iosDisableSPM: false }),
          generated.replace(/\n/g, '\r\n'),
        ),
      ).resolves.toBe(SAMPLE_PODFILE.replace(/\n/g, '\r\n'));
    });

    it('should anchor on the real use_native_modules! call, not a commented-out one', async () => {
      const contents = await runPodfileMod(
        applyPlugin({ iosDisableSPM: true }),
        SAMPLE_PODFILE.replace(
          '  config = use_native_modules!',
          '  # config = use_native_modules!\n  config = use_native_modules!',
        ),
      );

      expect(contents).toContain(
        `  # config = use_native_modules!\n${EXPECTED_BLOCK}\n`,
      );
      expect(countOccurrences(contents, 'adapty_disable_spm!')).toBe(1);
    });

    describe('with unpaired or repeated markers', () => {
      const BLOCK_BEGIN =
        '# @generated begin react-native-adapty-cocoapods - expo prebuild (DO NOT MODIFY)';
      const BLOCK_END = '# @generated end react-native-adapty-cocoapods';

      // Prebuild without --clean feeds each run the previous run's Podfile.
      async function runThreeTimes(
        iosDisableSPM: boolean,
        podfile: string,
      ): Promise<string[]> {
        const outputs: string[] = [];
        let contents = podfile;
        for (let run = 0; run < 3; run++) {
          contents = await runPodfileMod(
            applyPlugin({ iosDisableSPM }),
            contents,
          );
          outputs.push(contents);
        }
        return outputs;
      }

      let generated: string;
      beforeEach(async () => {
        generated = await runPodfileMod(
          applyPlugin({ iosDisableSPM: true }),
          SAMPLE_PODFILE,
        );
      });

      it('should converge with a stray END above a valid block', async () => {
        const withStrayEnd = (podfile: string) =>
          podfile.replace(
            "target 'myapp' do",
            `${BLOCK_END}\ntarget 'myapp' do`,
          );
        const podfile = withStrayEnd(generated);

        const on = await runThreeTimes(true, podfile);
        expect(on).toEqual([podfile, podfile, podfile]);
        expect(countOccurrences(on[2], 'adapty_disable_spm!')).toBe(1);

        const off = await runThreeTimes(false, podfile);
        const stripped = withStrayEnd(SAMPLE_PODFILE);
        expect(off).toEqual([stripped, stripped, stripped]);
      });

      it('should converge with two complete blocks', async () => {
        const podfile = generated.replace(
          "target 'myapp' do",
          [
            BLOCK_BEGIN,
            '$AdaptyDisableSPM = true',
            BLOCK_END,
            "target 'myapp' do",
          ].join('\n'),
        );

        await expect(runThreeTimes(true, podfile)).resolves.toEqual([
          generated,
          generated,
          generated,
        ]);
        await expect(runThreeTimes(false, podfile)).resolves.toEqual([
          SAMPLE_PODFILE,
          SAMPLE_PODFILE,
          SAMPLE_PODFILE,
        ]);
      });

      // Its block's extent is unknown: off leaves the Podfile as is, on drops only that line.
      it('should converge with an unclosed BEGIN', async () => {
        const podfile = SAMPLE_PODFILE.replace(
          '  config = use_native_modules!',
          `  ${BLOCK_BEGIN}\n  config = use_native_modules!`,
        );

        await expect(runThreeTimes(true, podfile)).resolves.toEqual([
          generated,
          generated,
          generated,
        ]);
        await expect(runThreeTimes(false, podfile)).resolves.toEqual([
          podfile,
          podfile,
          podfile,
        ]);
      });

      it('should converge with reversed markers', async () => {
        const podfile = SAMPLE_PODFILE.replace(
          '  config = use_native_modules!',
          `  ${BLOCK_END}\n  ${BLOCK_BEGIN}\n  config = use_native_modules!`,
        );

        const on = await runThreeTimes(true, podfile);
        const expected = generated.replace(
          `  ${BLOCK_BEGIN}`,
          `  ${BLOCK_END}\n  ${BLOCK_BEGIN}`,
        );
        expect(on).toEqual([expected, expected, expected]);
        expect(countOccurrences(on[2], 'adapty_disable_spm!')).toBe(1);

        await expect(runThreeTimes(false, podfile)).resolves.toEqual([
          podfile,
          podfile,
          podfile,
        ]);
      });
    });

    it('should throw when the Podfile has no use_native_modules! call', async () => {
      await expect(
        runPodfileMod(
          applyPlugin({ iosDisableSPM: true }),
          "platform :ios, '15.0'\ntarget 'myapp' do\n  use_expo_modules!\nend\n",
        ),
      ).rejects.toThrow(/\[react-native-adapty\].*`use_native_modules!`/);
    });

    it('should throw when iosDisableSPM is not a boolean', () => {
      expect(() =>
        applyPlugin({ iosDisableSPM: 'true' as unknown as boolean }),
      ).toThrow(/\[react-native-adapty\] `iosDisableSPM` must be a boolean/);
      expect(() =>
        applyPlugin({ iosDisableSPM: 1 as unknown as boolean }),
      ).toThrow(/\[react-native-adapty\] `iosDisableSPM` must be a boolean/);
    });

    it('should coexist with fallbackFile.ios', () => {
      const config = applyPlugin({
        iosDisableSPM: true,
        fallbackFile: { ios: './assets/ios_fallback.json' },
      });

      expect(getPodfileMod(config)).toBeDefined();
      expect(config.mods?.ios?.xcodeproj).toBeDefined();
    });
  });
});
