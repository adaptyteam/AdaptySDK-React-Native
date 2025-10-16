#!/usr/bin/env node
var fs = require('fs');
var prompt = require('prompt-sync')();

var filename = '.adapty-credentials.json';
var token_key = 'token';
var ios_bundle_key = 'ios_bundle';
var android_application_id_key = 'android_application_id';
var placement_id_key = 'placement_id';

// Parse command line arguments
var args = process.argv.slice(2);
var forceBundleUpdate = args.includes('--force-bundle');

var exists = fs.existsSync(filename);

if (!exists) {
  console.log('Adapty credentials file not found. Creating...');

  const json = read_credentials_sync();
  write_credentials_sync(json);
  process.exit(0);
}

var result = fs.readFileSync(filename, 'utf8');
var file = JSON.parse(result);
const json = read_credentials_sync(file);
write_credentials_sync(json);

function read_credentials_sync(obj = {}) {
  var result = {};

  // Adapty token
  var cache_token = obj[token_key];
  var input_token = prompt(
    `Enter your Adapty token${cache_token ? ` (${cache_token})` : ''}: `,
  );

  if (input_token) {
    result[token_key] = input_token;
  } else if (cache_token) {
    result[token_key] = cache_token;
  }

  // iOS BundleID
  var cache_bundle = obj[ios_bundle_key];
  var input_ios_bundle = prompt(
    `Enter your iOS bundle identifier${cache_bundle ? ` (${cache_bundle})` : ''
    }: `,
  );

  if (input_ios_bundle) {
    result[ios_bundle_key] = input_ios_bundle;
  } else if (cache_bundle) {
    result[ios_bundle_key] = cache_bundle;
  }

  // Android Application ID
  var cache_android_app_id = obj[android_application_id_key];
  var input_android_app_id = prompt(
    `Enter your Android application ID${cache_android_app_id ? ` (${cache_android_app_id})` : ''
    }: `,
  );

  if (input_android_app_id) {
    result[android_application_id_key] = input_android_app_id;
  } else if (cache_android_app_id) {
    result[android_application_id_key] = cache_android_app_id;
  }

  // Placement ID
  var cache_placement = obj[placement_id_key];
  var input_placement_id = prompt(
    `Enter your placement ID${cache_placement ? ` (${cache_placement})` : ''}: `,
  );

  if (input_placement_id) {
    result[placement_id_key] = input_placement_id;
  } else if (cache_placement) {
    result[placement_id_key] = cache_placement;
  }

  if (result[ios_bundle_key] !== cache_bundle || forceBundleUpdate) {
    if (forceBundleUpdate) {
      console.log(`[CREDENTIALS] Force bundle update flag detected, updating Xcode project...`);
    } else {
      console.log(`[CREDENTIALS] Bundle ID changed from "${cache_bundle}" to "${result[ios_bundle_key]}", updating Xcode project...`);
    }
    write_ios_bundle(result[ios_bundle_key]);
    console.info('Don\'t forget to set your team in Xcode!');
  } else {
    console.log(`[CREDENTIALS] Bundle ID unchanged (${result[ios_bundle_key]}), because no update needed`);
  }

  if (result[android_application_id_key] !== cache_android_app_id || forceBundleUpdate) {
    if (forceBundleUpdate) {
      console.log(`[CREDENTIALS] Force bundle update flag detected, updating Android build.gradle...`);
    } else {
      console.log(`[CREDENTIALS] Android Application ID changed from "${cache_android_app_id}" to "${result[android_application_id_key]}", updating build.gradle...`);
    }
    write_android_application_id(result[android_application_id_key]);
  } else {
    console.log(`[CREDENTIALS] Android Application ID unchanged (${result[android_application_id_key]}), because no update needed`);
  }

  return result;
}

function write_credentials_sync(obj) {
  var str = JSON.stringify(obj, null, 2);

  try {
    fs.writeFileSync(filename, str);
  } catch (error) {
    console.error(err);
    process.exit(1);
  }
}

// write_ios_bundle rewrites project.pbxproj file with new bundle identifier
function write_ios_bundle(new_bundle) {
  var xcode_dirname = '';

  try {
    var iosFiles = fs.readdirSync('ios');

    iosFiles.forEach(filename => {
      if (filename.endsWith('.xcodeproj')) {
        xcode_dirname = filename;
      }
    });
  } catch (error) {
    console.error(`[CREDENTIALS] Error reading ios directory: ${error.message}`);
    process.exit(1);
  }

  if (!xcode_dirname) {
    console.error('[CREDENTIALS] Error: xcode project not found in ios directory');
    process.exit(1);
  }

  var pbxprojPath = `ios/${xcode_dirname}/project.pbxproj`;

  try {
    var ios_content = fs.readFileSync(pbxprojPath, 'utf8');

    // Count current bundle identifiers
    var currentBundles = ios_content.match(/PRODUCT_BUNDLE_IDENTIFIER = [^;]+;/g);

    var ios_content_new = ios_content.replace(
      /PRODUCT_BUNDLE_IDENTIFIER = [^;]+;/g,
      `PRODUCT_BUNDLE_IDENTIFIER = ${new_bundle};`,
    );

    fs.writeFileSync(pbxprojPath, ios_content_new);
    console.log('[CREDENTIALS] ✅ Successfully updated iOS bundle identifier in project.pbxproj');
  } catch (error) {
    console.error(`[CREDENTIALS] Error updating project file: ${error.message}`);
    process.exit(1);
  }
}

function write_android_application_id(new_app_id) {
  var buildGradlePath = 'android/app/build.gradle';

  try {
    if (!fs.existsSync(buildGradlePath)) {
      console.error('[CREDENTIALS] Error: build.gradle not found in android/app directory');
      return;
    }

    var buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

    // Replace applicationId in defaultConfig
    var buildGradleContentNew = buildGradleContent.replace(
      /applicationId\s+"[^"]+"/g,
      `applicationId "${new_app_id}"`
    );

    fs.writeFileSync(buildGradlePath, buildGradleContentNew);
    console.log('[CREDENTIALS] ✅ Successfully updated Android application ID in build.gradle');
  } catch (error) {
    console.error(`[CREDENTIALS] Error updating Android build.gradle: ${error.message}`);
  }
}

