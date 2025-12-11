import { AdaptyUiOnboardingStateParamsCoder } from './adapty-ui-onboarding-state-params';
import type { AdaptyUiOnboardingStateParams } from '@/ui/types';
import type { Def } from '@/types/schema';

type Model = AdaptyUiOnboardingStateParams;
const mocks: Def['AdaptyUI.OnboardingsStateParams'][] = [
  {
    id: 'param_1',
    value: 'option_a',
    label: 'Option A',
  },
  {
    id: 'param_2',
    value: 'option_b',
    label: 'Option B',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    id: mock.id,
    value: mock.value,
    label: mock.label,
  };
}

describe('AdaptyUiOnboardingStateParamsCoder', () => {
  let coder: AdaptyUiOnboardingStateParamsCoder;

  beforeEach(() => {
    coder = new AdaptyUiOnboardingStateParamsCoder();
  });

  it.each(mocks)('should decode to expected result', mock => {
    const decoded = coder.decode(mock);

    expect(decoded).toStrictEqual(toModel(mock));
  });

  it.each(mocks)('should decode/encode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    expect(encoded).toStrictEqual(mock);
  });
});
