const fs = require('fs');
const path = require('path');

// Paths
const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const plistFilePath = path.join(
  rootDir,
  'lib',
  'ios',
  'CrossplatformVersion.plist',
);
const jsFilePath = path.join(rootDir, 'lib', 'src', 'version.ts');

// Get package version from package.json
const packageJson = require(packageJsonPath);
const packageVersion = packageJson.version;

// iOS
let plistContent = fs.readFileSync(plistFilePath, 'utf8');
plistContent = plistContent.replace(
  /<key>version<\/key>\s*<string>.*<\/string>/,
  `<key>version</key>\n\t<string>${packageVersion}</string>`,
);
fs.writeFileSync(plistFilePath, plistContent);
console.log(`${plistFilePath} --> ${packageVersion}`);

// JS
fs.writeFileSync(jsFilePath, `export default '${packageVersion}';\n`);
console.log(`${jsFilePath} --> ${packageVersion}`);
