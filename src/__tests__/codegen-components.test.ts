/**
 * Pins the Fabric component specs: app codegen generates the native props,
 * descriptors and protocols from them, and they must agree with the native
 * view managers and with the hand-written static view configs.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import {
  FLOW_VIEW_CONFIG,
  ONBOARDING_VIEW_CONFIG,
} from '@/ui/native-components';

interface PropSchema {
  name: string;
  optional: boolean;
  typeAnnotation: { type: string };
}

interface ComponentSchema {
  props: PropSchema[];
  events: unknown[];
  commands: unknown[];
}

interface CodegenSchema {
  modules: Record<string, { components?: Record<string, ComponentSchema> }>;
}

// The codegen parser ships without typings
const { TypeScriptParser } =
  require('@react-native/codegen/lib/parsers/typescript/parser') as {
    TypeScriptParser: new () => { parseFile(file: string): CodegenSchema };
  };

const { transformSync } =
  require('@babel/core') as typeof import('@babel/core');

const ROOT = path.join(__dirname, '..', '..');
const read = (file: string): string =>
  fs.readFileSync(path.join(ROOT, file), 'utf8');

const COMPONENTS = [
  {
    name: 'AdaptyFlowView',
    spec: 'src/specs/AdaptyFlowViewNativeComponent.ts',
    props: ['viewId', 'flowJson'],
    android:
      'android/src/main/kotlin/com/adapty/react/AdaptyFlowViewManager.kt',
    iosLegacy: 'ios/AdaptyFlowViewManager.m',
  },
  {
    name: 'AdaptyOnboardingView',
    spec: 'src/specs/AdaptyOnboardingViewNativeComponent.ts',
    props: ['viewId', 'onboardingJson'],
    android:
      'android/src/main/kotlin/com/adapty/react/AdaptyOnboardingViewManager.kt',
    iosLegacy: 'ios/AdaptyOnboardingViewManager.m',
  },
];

function parseComponent(spec: string, name: string): ComponentSchema {
  const schema = new TypeScriptParser().parseFile(path.join(ROOT, spec));
  const components = Object.values(schema.modules).flatMap(m =>
    Object.entries(m.components ?? {}),
  );
  expect(components.map(([n]) => n)).toEqual([name]);
  const component = components[0]?.[1];
  if (!component) throw new Error(`${name} component is missing`);
  return component;
}

/** The view config the codegen babel plugin derives from a spec, as apps bundling it get. */
function pluginViewConfig(spec: string): unknown {
  const filename = path.join(ROOT, spec);
  const result = transformSync(fs.readFileSync(filename, 'utf8'), {
    filename,
    babelrc: false,
    configFile: false,
    plugins: [require.resolve('@react-native/babel-plugin-codegen')],
    presets: [
      [
        '@babel/preset-env',
        { targets: { node: 'current' }, modules: 'commonjs' },
      ],
      '@babel/preset-typescript',
    ],
  });
  if (!result?.code) throw new Error(`babel produced no code for ${spec}`);
  const module = { exports: {} as Record<string, unknown> };
  const fakeRequire = (id: string): unknown =>
    id.endsWith('NativeComponentRegistry') ? { get: () => null } : {};
  vm.runInNewContext(result.code, {
    module,
    exports: module.exports,
    require: fakeRequire,
  });
  return module.exports['__INTERNAL_VIEW_CONFIG'];
}

describe.each(COMPONENTS)('$name component spec', c => {
  it('declares exactly the native props, as required strings, with no events or commands', () => {
    const component = parseComponent(c.spec, c.name);
    expect(
      component.props.map(p => [p.name, p.typeAnnotation.type, p.optional]),
    ).toEqual(c.props.map(p => [p, 'StringTypeAnnotation', false]));
    expect(component.events).toEqual([]);
    expect(component.commands).toEqual([]);
  });

  it('matches the Android view manager name and @ReactProp setters', () => {
    const src = read(c.android);
    expect(src.match(/override fun getName\(\): String = "(\w+)"/)?.[1]).toBe(
      c.name,
    );
    expect(
      [...src.matchAll(/@ReactProp\(name = "(\w+)"\)/g)].map(m => m[1]),
    ).toEqual(c.props);
  });

  it('matches the iOS legacy view manager exports', () => {
    const src = read(c.iosLegacy);
    expect(
      src.match(/RCT_EXTERN_MODULE\((\w+),/)?.[1]?.replace(/Manager$/, ''),
    ).toBe(c.name);
    expect(
      [...src.matchAll(/RCT_EXPORT_VIEW_PROPERTY\((\w+), NSString\)/g)].map(
        m => m[1],
      ),
    ).toEqual(c.props);
  });
});

it('keeps the component specs out of the build', () => {
  // tsconfig.build.json has comments, so it is not JSON
  const exclude = read('tsconfig.build.json').match(
    /"exclude":\s*\[([^\]]*)\]/,
  );
  expect(exclude?.[1]).toContain('"src/specs/*NativeComponent.ts"');
});

it.each([
  ['src/specs/AdaptyFlowViewNativeComponent.ts', FLOW_VIEW_CONFIG],
  ['src/specs/AdaptyOnboardingViewNativeComponent.ts', ONBOARDING_VIEW_CONFIG],
])(
  'pins the hand-written view config of %s to the codegen babel plugin output',
  (spec, config) => {
    expect(pluginViewConfig(spec)).toEqual(config);
  },
);
