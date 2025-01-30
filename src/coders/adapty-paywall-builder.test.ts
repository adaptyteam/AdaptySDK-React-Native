import { AdaptyPaywallBuilderCoder } from './adapty-paywall-builder';
import type { AdaptyPaywallBuilder } from '@/types';
import type { Def } from '@/types/schema';

type Model = AdaptyPaywallBuilder;
const mocks: Required<Def['AdaptyPaywall']>['paywall_builder'][] = [
  {
    paywall_builder_id: 'paywallBuilder1',
    lang: 'en',
  },
  {
    paywall_builder_id: 'paywallBuilder2',
    lang: 'fr',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    lang: mock.lang,
    id: mock.paywall_builder_id,
  };
}

describe('AdaptyPaywallBuilderCoder', () => {
  let coder: AdaptyPaywallBuilderCoder;

  beforeEach(() => {
    coder = new AdaptyPaywallBuilderCoder();
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
