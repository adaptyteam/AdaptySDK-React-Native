import { AdaptyPlacementCoder } from './adapty-placement';
import type { AdaptyPlacement } from '@/types';
import type { Def } from '@/types/schema';

type Model = AdaptyPlacement;
const mocks: Def['AdaptyPlacement'][] = [
  {
    ab_test_name: 'test_ab',
    audience_name: 'test_audience',
    developer_id: 'placement_123',
    revision: 1,
    placement_audience_version_id: 'version_123',
    is_tracking_purchases: true,
  },
  {
    ab_test_name: 'another_ab',
    audience_name: 'another_audience',
    developer_id: 'placement_456',
    revision: 2,
    placement_audience_version_id: 'version_456',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    abTestName: mock.ab_test_name,
    audienceName: mock.audience_name,
    id: mock.developer_id,
    revision: mock.revision,
    audienceVersionId: mock.placement_audience_version_id,
    ...(mock.is_tracking_purchases !== undefined && {
      isTrackingPurchases: mock.is_tracking_purchases,
    }),
  };
}

describe('AdaptyPlacementCoder', () => {
  let coder: AdaptyPlacementCoder;

  beforeEach(() => {
    coder = new AdaptyPlacementCoder();
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
