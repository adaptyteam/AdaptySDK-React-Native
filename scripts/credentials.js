var fs = require('fs');
var prompt = require('prompt-sync')();

var filename = '.adapty-credentials.json';
var token_key = "token";

function readCredentialsSync(obj = {}) {
  var result = {};

  var cacheToken = obj[token_key];
  var inputToken = prompt(`Enter your Adapty token${cacheToken ? ` (${cacheToken})` : ''}: `);

  if (inputToken) {
    result[token_key] = inputToken;
  } else if (cacheToken) {
    result[token_key] = cacheToken;
  }

  return result;
}

function writeCredentialsSync(obj) {
  var str = JSON.stringify(obj, null, 2);

  try {
    fs.writeFileSync(filename, str);
  } catch (error) {
    console.error(err);
    process.exit(1);
  }
}

var exists = fs.existsSync(filename);

if (!exists) {
  console.log('Adapty credentials file not found. Creating...');

  const json = readCredentialsSync();
  writeCredentialsSync(json);

  process.exit(0);
}

var result = fs.readFileSync(filename, 'utf8');
var file = JSON.parse(result);
const json = readCredentialsSync(file);
writeCredentialsSync(json);