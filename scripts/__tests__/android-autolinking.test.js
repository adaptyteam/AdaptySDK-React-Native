/* eslint-env jest */
'use strict';

/**
 * Guards AdaptyPackage discovery by the RN CLI autolinking of RN 0.75 (CLI 14). It only
 * recognises `implements ReactPackage` or `extends TurboReactPackage`, so a package that
 * only extends BaseReactPackage is silently dropped from the app build.
 */
const fs = require('fs');
const path = require('path');

const PACKAGE_JAVA = path.join(
  __dirname,
  '..',
  '..',
  'android/src/main/kotlin/com/adapty/react/AdaptyPackage.java',
);

// Verbatim from @react-native-community/cli-platform-android@14 build/config/findPackageClassName.js (matchClassName)
function matchClassName(file) {
  const nativeModuleMatch = file.match(
    /class\s+(\w+[^(\s]*)[\s\w():]*(\s+implements\s+|:)[\s\w():,]*[^{]*ReactPackage/,
  );
  if (nativeModuleMatch) {
    return nativeModuleMatch;
  } else {
    return file.match(
      /class\s+(\w+[^(\s]*)[\s\w():]*(\s+extends\s+|:)[\s\w():,]*[^{]*TurboReactPackage/,
    );
  }
}

describe('Android autolinking', () => {
  it('keeps AdaptyPackage detectable by RN CLI 14 (RN 0.75)', () => {
    const match = matchClassName(fs.readFileSync(PACKAGE_JAVA, 'utf8'));
    expect(match?.[1]).toBe('AdaptyPackage');
  });
});
