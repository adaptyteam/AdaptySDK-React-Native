/**
 * Pins the RNAdapty codegen spec: every app's codegen generates the native
 * interfaces from it, so a drifted signature breaks native builds downstream.
 */
import path from 'path';
import { MODULE_NAME } from '@/bridge';

interface TypeAnnotation {
  type: string;
  elementType?: TypeAnnotation;
}

interface MethodSchema {
  name: string;
  typeAnnotation: {
    params: { typeAnnotation: TypeAnnotation }[];
    returnTypeAnnotation: TypeAnnotation;
  };
}

interface ModuleSchema {
  moduleName: string;
  spec: { methods: MethodSchema[] };
}

interface CodegenSchema {
  modules: Record<string, ModuleSchema>;
}

// The codegen parser ships without typings
const { TypeScriptParser } =
  require('@react-native/codegen/lib/parsers/typescript/parser') as {
    TypeScriptParser: new () => { parseFile(file: string): CodegenSchema };
  };

const SPEC_PATH = path.join(__dirname, '..', 'specs', 'NativeRNAdapty.ts');

function parseSpec(): ModuleSchema {
  const schema = new TypeScriptParser().parseFile(SPEC_PATH);
  expect(Object.keys(schema.modules)).toEqual(['NativeRNAdapty']);
  const module = schema.modules['NativeRNAdapty'];
  if (!module) throw new Error('NativeRNAdapty module is missing');
  return module;
}

describe('RNAdapty codegen spec', () => {
  it('parses into the RNAdapty module schema', () => {
    const module = parseSpec();
    expect(module.moduleName).toBe('RNAdapty');

    const methods = module.spec.methods.map(m => [
      m.name,
      m.typeAnnotation.params.map(p => p.typeAnnotation.type),
      m.typeAnnotation.returnTypeAnnotation.type,
    ]);
    expect(methods).toEqual([
      [
        'handle',
        ['StringTypeAnnotation', 'GenericObjectTypeAnnotation'],
        'PromiseTypeAnnotation',
      ],
      ['addListener', ['StringTypeAnnotation'], 'VoidTypeAnnotation'],
      ['removeListeners', ['NumberTypeAnnotation'], 'VoidTypeAnnotation'],
    ]);

    const handle = module.spec.methods.find(m => m.name === 'handle');
    expect(handle?.typeAnnotation.returnTypeAnnotation.elementType?.type).toBe(
      'StringTypeAnnotation',
    );
  });

  it('is wired by package.json codegenConfig', () => {
    const { codegenConfig } = require('../../package.json') as {
      codegenConfig: unknown;
    };
    expect(codegenConfig).toEqual({
      name: 'RNAdaptySpec',
      type: 'modules',
      jsSrcsDir: 'src/specs',
      android: { javaPackageName: 'com.adapty.react' },
    });
  });

  it('keeps the JS module name in sync with the spec', () => {
    expect(MODULE_NAME).toBe(parseSpec().moduleName);
  });
});
