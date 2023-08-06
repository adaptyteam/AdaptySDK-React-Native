import { AdaptyPaywall } from '../types';
import { AdaptyPaywallCoder } from './adapty-paywall';

describe('AdaptyPaywallCoder', () => {
  let coder: AdaptyPaywallCoder;

  beforeEach(() => {
    coder = new AdaptyPaywallCoder();
  });

  it('should decode and encode back', () => {
    const input = {
      revision: 1,
      use_paywall_builder: true,
      products: [{ vendor_product_id: 'weekly.premium.599' }],
      variation_id: 'bdaca0ea-04ea-47a8-8f5f-8a6f65edbd51',
      developer_id: '111',
      paywall_name: '111',
      ab_test_name: '111',
      remote_config: { lang: 'en', data: '' },
      paywall_updated_at: 1676361063649,
    };

    const result = coder.decode(input);

    expect(result).toEqual({
      revision: 1,
      hasViewConfiguration: true,
      products: [{ vendorId: 'weekly.premium.599', ios: {} }],
      variationId: 'bdaca0ea-04ea-47a8-8f5f-8a6f65edbd51',
      id: '111',
      name: '111',
      abTestName: '111',
      locale: 'en',
      remoteConfigString: '',
      remoteConfig: {},
      version: 1676361063649,
    } satisfies AdaptyPaywall);

    const recoded = coder.encode(result);

    expect(input).toEqual(recoded);
  });
});
