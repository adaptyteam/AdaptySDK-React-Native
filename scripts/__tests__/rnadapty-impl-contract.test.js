/* eslint-env jest */
'use strict';

/**
 * RNAdapty.mm declares the Swift RNAdaptyImpl class by hand instead of importing the
 * generated *-Swift.h. Nothing checks that declaration against Swift at compile time:
 * a renamed selector links fine and crashes with "unrecognized selector" at runtime.
 * This pins both sides to the same explicit ObjC names.
 */
const fs = require('fs');
const path = require('path');

const IOS = path.join(__dirname, '..', '..', 'ios');
const EXPECTED = ['handle:args:completion:', 'hasListeners', 'initWithSendEvent:', 'supportedEvents'];

/** Selectors of the hand-declared `@interface RNAdaptyImpl … @end`, minus NS_UNAVAILABLE ones. */
function declaredSelectors(source) {
  const block = source.match(/@interface RNAdaptyImpl\s*:\s*\w+([\s\S]*?)@end/);
  expect(block).not.toBeNull();
  return block[1]
    .split(';')
    .map((decl) => decl.replace(/\s+/g, ' ').trim())
    .filter((decl) => /^[-+@]/.test(decl) && !decl.includes('NS_UNAVAILABLE'))
    .map((decl) => {
      if (decl.startsWith('@property')) {
        return decl.match(/(\w+)\s*$/)[1];
      }
      // Drop the return type, then collect `name:` parts, or the bare name of a unary selector.
      const signature = decl.replace(/^[-+]\s*\([^)]*\)\s*/, '');
      const parts = [...signature.matchAll(/(\w+)\s*:\s*\((?:[^()]|\([^()]*\))*\)\s*\w+/g)];
      return parts.length > 0 ? parts.map((m) => `${m[1]}:`).join('') : signature.match(/^\w+/)[0];
    })
    .sort();
}

describe('RNAdaptyImpl ObjC contract', () => {
  it('declares exactly the expected selectors in RNAdapty.mm', () => {
    const mm = fs.readFileSync(path.join(IOS, 'RNAdapty.mm'), 'utf8');
    expect(declaredSelectors(mm)).toEqual(EXPECTED);
  });

  it('pins every selector with an explicit @objc name in RNAdaptyImpl.swift', () => {
    const swift = fs.readFileSync(path.join(IOS, 'RNAdaptyImpl.swift'), 'utf8');
    expect(swift).toContain('@objc(RNAdaptyImpl)');
    for (const name of EXPECTED) {
      expect(swift).toContain(`@objc(${name})`);
    }
  });
});
