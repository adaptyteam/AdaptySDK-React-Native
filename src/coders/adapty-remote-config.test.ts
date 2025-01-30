import { AdaptyRemoteConfigCoder } from './adapty-remote-config';
import type { AdaptyRemoteConfig } from '@/types';
import type { Def } from '@/types/schema';

type Model = AdaptyRemoteConfig;
const mocks: Required<Def['AdaptyPaywall']>['remote_config'][] = [
  {
    lang: 'en',
    data: '{"key":"value"}', // A custom JSON string configured in Adapty Dashboard
  },
  {
    lang: 'en',
    data: '',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    lang: mock.lang,
    data: mock.data ? JSON.parse(mock.data) : {},
    dataString: mock.data,
  };
}

describe('AdaptyRemoteConfigCoder', () => {
  let coder: AdaptyRemoteConfigCoder;

  beforeEach(() => {
    coder = new AdaptyRemoteConfigCoder();
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
