import { AdaptyOnboardingCoder } from './adapty-onboarding';
import type { AdaptyOnboarding } from '@/types';
import type { Def } from '@/types/schema';

type Model = AdaptyOnboarding;
const mocks: Def['AdaptyOnboarding'][] = [
  {
    placement: {
      ab_test_name: 'test_ab',
      audience_name: 'test_audience',
      developer_id: 'placement_123',
      revision: 1,
      placement_audience_version_id: 'version_123',
      is_tracking_purchases: true,
    },
    onboarding_id: 'onboarding_123',
    onboarding_name: 'Premium Onboarding',
    variation_id: 'variation_456',
    response_created_at: 1640995200000,
    onboarding_builder: {
      config_url: 'https://example.com',
      lang: 'en',
    },
    remote_config: {
      lang: 'en',
      data: '{"feature": "premium", "theme": "dark"}',
    },
    payload_data: '{"custom": "payload"}',
  },
  {
    placement: {
      ab_test_name: 'test_ab_2',
      audience_name: 'test_audience_2',
      developer_id: 'placement_789',
      revision: 2,
      placement_audience_version_id: 'version_789',
    },
    onboarding_id: 'onboarding_789',
    onboarding_name: 'Basic Onboarding',
    variation_id: 'variation_123',
    response_created_at: 1640995300000,
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    placement: {
      abTestName: mock.placement.ab_test_name,
      audienceName: mock.placement.audience_name,
      id: mock.placement.developer_id,
      revision: mock.placement.revision,
      audienceVersionId: mock.placement.placement_audience_version_id,
      ...(mock.placement.is_tracking_purchases !== undefined && {
        isTrackingPurchases: mock.placement.is_tracking_purchases,
      }),
    },
    id: mock.onboarding_id,
    name: mock.onboarding_name,
    variationId: mock.variation_id,
    hasViewConfiguration: mock.onboarding_builder !== undefined,
    ...(mock.response_created_at && { version: mock.response_created_at }),
    ...(mock.onboarding_builder && {
      onboardingBuilder: {
        url: mock.onboarding_builder.config_url,
        lang: mock.onboarding_builder.lang,
      },
    }),
    ...(mock.remote_config && {
      remoteConfig: {
        lang: mock.remote_config.lang,
        data: JSON.parse(mock.remote_config.data),
        dataString: mock.remote_config.data,
      },
    }),
    ...(mock.payload_data && { payloadData: mock.payload_data }),
  };
}

describe('AdaptyOnboardingCoder', () => {
  let coder: AdaptyOnboardingCoder;

  beforeEach(() => {
    coder = new AdaptyOnboardingCoder();
  });

  it.each(mocks)('should decode to expected result', mock => {
    const decoded = coder.decode(mock);
    const expected = toModel(mock);

    expect(decoded.placement).toStrictEqual(expected.placement);
    expect(decoded.id).toBe(expected.id);
    expect(decoded.name).toBe(expected.name);
    expect(decoded.variationId).toBe(expected.variationId);
    expect(decoded.hasViewConfiguration).toBe(expected.hasViewConfiguration);
    expect(decoded.version).toBe(expected.version);
    expect(decoded.onboardingBuilder).toStrictEqual(expected.onboardingBuilder);
    expect(decoded.payloadData).toBe(expected.payloadData);

    if (expected.remoteConfig) {
      expect(decoded.remoteConfig?.lang).toBe(expected.remoteConfig.lang);
      expect(decoded.remoteConfig?.data).toStrictEqual(
        expected.remoteConfig.data,
      );
      expect(decoded.remoteConfig?.dataString).toBeTruthy();
    }
  });

  it.each(mocks)('should decode/encode', mock => {
    const decoded = coder.decode(mock);
    const encoded = coder.encode(decoded);

    const { hasViewConfiguration, ...encodableDecoded } = decoded;
    const reDecoded = coder.decode(encoded);
    const { hasViewConfiguration: _, ...encodableReDecoded } = reDecoded;

    expect(encodableReDecoded).toStrictEqual(encodableDecoded);
  });
});
