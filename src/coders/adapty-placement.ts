import type { AdaptyPlacement } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { SimpleCoder } from './coder';

type Model = AdaptyPlacement;
type Serializable = Def['AdaptyPlacement'];

export class AdaptyPlacementCoder extends SimpleCoder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    abTestName: { key: 'ab_test_name', required: true, type: 'string' },
    audienceName: { key: 'audience_name', required: true, type: 'string' },
    id: { key: 'developer_id', required: true, type: 'string' },
    revision: { key: 'revision', required: true, type: 'number' },
    audienceVersionId: {
      key: 'placement_audience_version_id',
      required: true,
      type: 'string',
    },
    isTrackingPurchases: {
      key: 'is_tracking_purchases',
      required: false,
      type: 'boolean',
    },
  };
}
