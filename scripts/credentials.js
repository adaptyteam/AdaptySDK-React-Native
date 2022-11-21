var fs = require('fs');
var prompt = require('prompt-sync')();

var filename = '.adapty-credentials.json';
var token_key = 'token';
var ios_bundle_key = 'ios_bundle';

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

  if (result[ios_bundle_key] !== cache_bundle) {
    write_ios_bundle(result[ios_bundle_key]);
    console.info('Don\'t forget to set your team in Xcode!');
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
  fs.readdirSync('ios').forEach(filename => {
    if (filename.endsWith('.xcodeproj')) {
      xcode_dirname = filename;
    }
  });

  if (!xcode_dirname) {
    console.error('xcode project not found in ios directory');
    process.exit(1);
  }

  var ios_content = fs.readFileSync(
    `ios/${xcode_dirname}/project.pbxproj`,
    'utf8',
  );

  var ios_content_new = ios_content.replace(
    /PRODUCT_BUNDLE_IDENTIFIER = [^;]+;/g,
    `PRODUCT_BUNDLE_IDENTIFIER = ${new_bundle};`,
  );

  fs.writeFileSync(`ios/${xcode_dirname}/project.pbxproj`, ios_content_new);
}
