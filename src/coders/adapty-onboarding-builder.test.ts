import { AdaptyOnboardingBuilderCoder } from './adapty-onboarding-builder';
import type { AdaptyOnboardingBuilder } from '@/types';
import type { Def } from '@/types/schema';

type Model = AdaptyOnboardingBuilder;
type Serializable = Required<Def['AdaptyOnboarding']>['onboarding_builder'];

const mocks: Serializable[] = [
  {
    config_url: 'https://config.adapty.io/onboarding',
    lang: 'en',
  },
  {
    config_url: 'https://config.adapty.io/onboarding-v2',
    lang: 'es',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    url: mock.config_url,
    lang: mock.lang,
  };
}

describe('AdaptyOnboardingBuilderCoder', () => {
  let coder: AdaptyOnboardingBuilderCoder;

  beforeEach(() => {
    coder = new AdaptyOnboardingBuilderCoder();
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
