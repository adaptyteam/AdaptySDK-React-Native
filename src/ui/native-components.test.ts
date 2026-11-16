import fs from 'fs';
import path from 'path';

const REGISTRY =
  'react-native/Libraries/NativeComponent/NativeComponentRegistry';
const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'src');

const source = (file: string): string =>
  fs.readFileSync(path.resolve(ROOT, file), 'utf8');

const collect = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return entry.name === '__tests__' || full === path.join(SRC, 'specs')
        ? []
        : collect(full);
    }
    return /\.tsx?$/.test(entry.name) &&
      !/\.(test|spec)\.tsx?$/.test(entry.name)
      ? [full]
      : [];
  });

// every non-test .ts/.tsx under src/ outside src/specs
const runtimeFiles = collect(SRC);

describe('native components', () => {
  afterEach(() => {
    jest.dontMock(REGISTRY);
    jest.resetModules();
  });

  it('registers one static view config per component, under the native name', () => {
    const get = jest.fn((name: string, provider: () => unknown) => ({
      name,
      config: provider(),
    }));
    jest.resetModules();
    jest.doMock(REGISTRY, () => ({ get }));
    const m = require('./native-components');
    expect(get).toHaveBeenCalledTimes(2);
    expect(m.AdaptyFlowViewHost).toEqual({
      name: 'AdaptyFlowView',
      config: {
        uiViewClassName: 'AdaptyFlowView',
        validAttributes: { viewId: true, flowJson: true },
      },
    });
    expect(m.AdaptyOnboardingViewHost).toEqual({
      name: 'AdaptyOnboardingView',
      config: {
        uiViewClassName: 'AdaptyOnboardingView',
        validAttributes: { viewId: true, onboardingJson: true },
      },
    });
  });

  it('serves the mocks on web', () => {
    const web = require('./native-components.web');
    expect(web.AdaptyFlowViewHost).toBe(
      require('./AdaptyFlowView.mock').AdaptyFlowViewMock,
    );
    expect(web.AdaptyOnboardingViewHost).toBe(
      require('./AdaptyOnboardingView.mock').AdaptyOnboardingViewMock,
    );
  });

  it('keeps RN deep imports and codegen specs out of the runtime graph', () => {
    expect(runtimeFiles.length).toBeGreaterThan(0);
    for (const file of runtimeFiles) {
      expect(source(file)).not.toMatch(
        /requireNativeComponent|codegenNativeComponent|specs\/Adapty\w+NativeComponent/,
      );
    }
    expect(source('src/ui/native-components.web.ts')).not.toMatch(
      /react-native\/Libraries/,
    );
  });
});
