import fsp from 'fs/promises';
import path from 'path';
import {
  AndroidConfig,
  ConfigPlugin,
  IOSConfig,
  createRunOncePlugin,
  withAndroidManifest,
  withDangerousMod,
  withXcodeProject,
} from 'expo/config-plugins';

const pkg = require('react-native-adapty/package.json') as {
  name: string;
  version: string;
};

const BACKUP_RULES_PATH = '@xml/rn_adapty_backup_rules';
const EXTRACTION_RULES_PATH = '@xml/rn_adapty_data_extraction_rules';

const ANDROID_ASSETS_DIR = path.join('app', 'src', 'main', 'assets');
const IOS_RESOURCES_GROUP = 'Resources';

export type FallbackFileInput = { ios?: string; android?: string };

export interface AdaptyPluginProps {
  replaceAndroidBackupConfig?: boolean;
  fallbackFile?: FallbackFileInput;
}

type NormalizedFallback = { ios?: string; android?: string } | null;

function normalizeFallbackFile(
  input: FallbackFileInput | undefined,
): NormalizedFallback {
  if (input == null) return null;
  if (typeof input !== 'object' || Array.isArray(input)) {
    throw new Error(
      '[react-native-adapty] `fallbackFile` must be an object with `ios` and/or `android` keys',
    );
  }
  return { ios: input.ios, android: input.android };
}

// Register a JSON file as a bundle resource in the iOS Xcode project so the
// SDK can load it via Bundle.main.path(forResource:ofType:). Mirrors the
// non-image branch of expo-asset's withAssetsIos, kept inline so this plugin
// depends only on the public expo/config-plugins API.
const withFallbackIos: ConfigPlugin<string> = (config, sourcePath) => {
  return withXcodeProject(config, config => {
    const { projectRoot, platformProjectRoot } = config.modRequest;
    const absolutePath = path.resolve(projectRoot, sourcePath);
    const relativePath = path.relative(platformProjectRoot, absolutePath);
    const filename = path.basename(sourcePath);

    IOSConfig.XcodeUtils.ensureGroupRecursively(
      config.modResults,
      IOS_RESOURCES_GROUP,
    );
    IOSConfig.XcodeUtils.addResourceFileToGroup({
      filepath: relativePath,
      groupName: IOS_RESOURCES_GROUP,
      project: config.modResults,
      isBuildFile: true,
      verbose: false,
    });
    console.log(
      `[react-native-adapty] Registered ${filename} as iOS bundle resource`,
    );

    return config;
  });
};

// Copy a JSON file into android/app/src/main/assets/<basename> so the SDK
// can read it through AssetManager.open(). Files under assets/ have no
// Android-side filename restrictions (unlike res/raw/), so no name
// validation is needed here.
const withFallbackAndroid: ConfigPlugin<string> = (config, sourcePath) => {
  const filename = path.basename(sourcePath);

  return withDangerousMod(config, [
    'android',
    async config => {
      const { projectRoot, platformProjectRoot } = config.modRequest;
      const absolutePath = path.resolve(projectRoot, sourcePath);
      const assetsDir = path.join(platformProjectRoot, ANDROID_ASSETS_DIR);
      const destPath = path.join(assetsDir, filename);

      await fsp.mkdir(assetsDir, { recursive: true });
      await fsp.copyFile(absolutePath, destPath);
      console.log(
        `[react-native-adapty] Copied ${filename} to android assets/`,
      );
      return config;
    },
  ]);
};

const withAdapty: ConfigPlugin<AdaptyPluginProps | undefined> = (
  config,
  props,
) => {
  const { replaceAndroidBackupConfig = false, fallbackFile } = props ?? {};
  const fallback = normalizeFallbackFile(fallbackFile);

  if (fallback) {
    if (fallback.ios) {
      config = withFallbackIos(config, fallback.ios);
    }
    if (fallback.android) {
      config = withFallbackAndroid(config, fallback.android);
    }
  }

  withAndroidManifest(config, config => {
    if (!replaceAndroidBackupConfig) {
      console.log(
        '[react-native-adapty] Android backup config replacement disabled, skipping',
      );
      return config;
    }

    const manifest = config.modResults.manifest;
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );

    if (!manifest.$) {
      manifest.$ = {} as typeof manifest.$;
    }

    const manifestAttrs = manifest.$ as Record<string, string | undefined>;
    const appAttrs = mainApplication.$ as Record<string, string | undefined>;

    // Add tools namespace for manifest merging
    manifestAttrs['xmlns:tools'] = 'http://schemas.android.com/tools';

    // Apply backup rules with tools:replace to override any existing rules
    appAttrs['android:fullBackupContent'] = BACKUP_RULES_PATH;
    appAttrs['android:dataExtractionRules'] = EXTRACTION_RULES_PATH;

    // Merge tools:replace with existing values from other plugins to avoid overwriting other attributes
    const requiredReplaceAttrs = [
      'android:fullBackupContent',
      'android:dataExtractionRules',
    ];
    const existingReplace = appAttrs['tools:replace'];
    if (existingReplace) {
      const existingAttrs = existingReplace.split(',').map(attr => attr.trim());
      const mergedAttrs = [
        ...new Set([...existingAttrs, ...requiredReplaceAttrs]),
      ];
      appAttrs['tools:replace'] = mergedAttrs.join(',');
    } else {
      appAttrs['tools:replace'] = requiredReplaceAttrs.join(',');
    }

    console.log(
      '[react-native-adapty] Successfully applied Android backup rules',
    );
    return config;
  });

  return config;
};

export default createRunOncePlugin(withAdapty, pkg.name, pkg.version);
