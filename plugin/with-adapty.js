const {
  createRunOncePlugin,
  withAndroidManifest,
  AndroidConfig,
} = require('expo/config-plugins');

const pkg = require('react-native-adapty/package.json');

const BACKUP_RULES_PATH = '@xml/rn_adapty_backup_rules';
const EXTRACTION_RULES_PATH = '@xml/rn_adapty_data_extraction_rules';

const withAdapty = (config, { replaceAndroidBackupConfig = false } = {}) => {
  withAndroidManifest(config, (config) => {
    if (!replaceAndroidBackupConfig) {
      console.log('[react-native-adapty] Android backup config replacement disabled, skipping');
      return config;
    }
    
    const manifest = config.modResults.manifest;
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);

    // Add tools namespace for manifest merging
    if (!manifest.$) {
      manifest.$ = {};
    }
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    // Apply backup rules with tools:replace to override any existing rules
    mainApplication.$['android:fullBackupContent'] = BACKUP_RULES_PATH;
    mainApplication.$['android:dataExtractionRules'] = EXTRACTION_RULES_PATH;
    
    // Merge tools:replace with existing values from other plugins to avoid overwriting other attributes
    const requiredReplaceAttrs = ['android:fullBackupContent', 'android:dataExtractionRules'];
    const existingReplace = mainApplication.$['tools:replace'];
    if (existingReplace) {
      const existingAttrs = existingReplace.split(',').map(attr => attr.trim());
      const mergedAttrs = [...new Set([...existingAttrs, ...requiredReplaceAttrs])];
      mainApplication.$['tools:replace'] = mergedAttrs.join(',');
    } else {
      mainApplication.$['tools:replace'] = requiredReplaceAttrs.join(',');
    }
    
    console.log('[react-native-adapty] Successfully applied Android backup rules');
    return config;
  });
  return config;
};

module.exports = createRunOncePlugin(withAdapty, pkg.name, pkg.version);

