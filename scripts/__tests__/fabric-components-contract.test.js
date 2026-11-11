/* eslint-env jest */
'use strict';

/**
 * Pins the iOS Fabric component views to the codegen names and to codegenConfig.
 * A mapped class that is missing aborts every RN 0.77+ new-arch app at launch, and a
 * spec without its `Cls` function breaks RN 0.75-0.76 static links, so neither can drift.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const { codegenConfig } = JSON.parse(read('package.json'));

const COMPONENTS = [
  { name: 'AdaptyFlowView', cls: 'AdaptyFlowComponentView', legacy: 'AdaptyFlowViewManager.m', props: ['viewId', 'flowJson'] },
  { name: 'AdaptyOnboardingView', cls: 'AdaptyOnboardingComponentView', legacy: 'AdaptyOnboardingViewManager.m', props: ['viewId', 'onboardingJson'] },
];

it('maps only the components checked below', () => {
  const names = COMPONENTS.map((c) => c.name);
  expect(Object.keys(codegenConfig.ios.components)).toEqual(names);
  expect(Object.keys(codegenConfig.ios.componentProvider)).toEqual(names);
});

describe.each(COMPONENTS)('$cls', (c) => {
  const mm = read(`ios/${c.cls}.mm`);
  const legacy = read(`ios/${c.legacy}`);

  it('compiles only on the new architecture', () => {
    expect(mm.trimStart().startsWith('#ifdef RCT_NEW_ARCH_ENABLED')).toBe(true);
    expect(mm.trimEnd().endsWith('#endif')).toBe(true);
  });

  it('is a non-recycled component view with its codegen descriptor', () => {
    expect(mm).toMatch(new RegExp(`@interface ${c.cls} : RCTViewComponentView <RCT${c.name}ViewProtocol>`));
    expect(mm).toMatch(/\+ \(void\)load\s*\{\s*\[super load\];\s*\}/);
    expect(mm).toMatch(/\+ \(BOOL\)shouldBeRecycled\s*\{\s*return NO;\s*\}/);
    expect(mm).toContain(`concreteComponentDescriptorProvider<${c.name}ComponentDescriptor>()`);
  });

  it('forwards every spec prop only when it changed', () => {
    // the whole branch, so a cross-wired assignment or a dropped nil guard fails
    for (const p of c.props) {
      const branch = [
        `if (oldViewProps.${p} != newViewProps.${p}) {`,
        `_wrapper.${p} = [NSString stringWithUTF8String:newViewProps.${p}.c_str()] ?: @"";`,
      ]
        .map((line) => line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ +/g, '\\s*'))
        .join('\\s*');
      expect(mm).toMatch(new RegExp(branch));
    }
  });

  it('exports a C-linkage Cls function returning the class', () => {
    expect(mm).toContain(`extern "C" Class<RCTComponentViewProtocol> ${c.name}Cls(void);`);
    expect(mm).toMatch(new RegExp(`Class<RCTComponentViewProtocol> ${c.name}Cls\\(void\\)\\s*\\{\\s*return ${c.cls}\\.class;\\s*\\}`));
  });

  it('is mapped for RN 0.77-0.79 and 0.80+ codegen', () => {
    expect(codegenConfig.ios.componentProvider[c.name]).toBe(c.cls);
    expect(codegenConfig.ios.components[c.name]).toEqual({ className: c.cls });
  });

  it('keeps the legacy view manager compiling without both interop layers', () => {
    expect(legacy.indexOf('#ifdef RCT_EXPORT_MODULE_NO_LOAD')).toBeGreaterThan(-1);
    expect(legacy.indexOf('#ifdef RCT_EXPORT_MODULE_NO_LOAD')).toBeLessThan(legacy.indexOf('RCT_EXTERN_MODULE('));
    expect(legacy.trimEnd().endsWith('#endif')).toBe(true);
    // the import stays outside the guard, or the file compiles to nothing on every RN version
    expect(legacy.trimStart().startsWith('#import')).toBe(true);
    expect(legacy.lastIndexOf('#import')).toBeLessThan(legacy.indexOf('#ifdef RCT_EXPORT_MODULE_NO_LOAD'));
  });

  it('diffs against the current props and lets the base class advance them', () => {
    expect(mm).toContain(`std::static_pointer_cast<const ${c.name}Props>(_props)`);
    expect(mm).not.toMatch(/static_pointer_cast<[^>]*>\(oldProps\)/); // oldProps is null on insert
    expect(mm).toMatch(/\[super updateProps:props oldProps:oldProps\];\s*\}\s*@end/);
  });
});
