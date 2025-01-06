const fs = require('fs');
const path = require('path');

// Paths
const rootDir = path.join(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const jsFilePath = path.join(rootDir, 'src', 'version.ts');

// Get package version from package.json
const packageJson = require(packageJsonPath);
const packageVersion = packageJson.version;

// JS
fs.writeFileSync(jsFilePath, `export default '${packageVersion}';\n`);
console.log(`${jsFilePath} --> ${packageVersion}`);
