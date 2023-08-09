import type { AdaptyPaywall } from '@/types';
import type { Schema } from '@/types/schema';
import type { Properties } from './types';
import { ProductReferenceCoder } from './product-reference';
import { ArrayCoder } from './array';
import { Coder } from './coder';
import { JSONCoder } from './json';

type Model = AdaptyPaywall;
type Serializable = Schema['InOutput.AdaptyPaywall'];

export class AdaptyPaywallCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    abTestName: { key: 'ab_test_name', required: true, type: 'string' },
    hasViewConfiguration: {
      key: 'use_paywall_builder' as any,
      required: true,
      type: 'boolean',
    },
    id: { key: 'developer_id', required: true, type: 'string' },
    locale: {
      key: 'remote_config.lang' as any, // composite
      required: true,
      type: 'string',
    },
    name: { key: 'paywall_name', required: true, type: 'string' },
    products: {
      key: 'products',
      required: true,
      type: 'array',
      converter: new ArrayCoder(ProductReferenceCoder),
    },
    remoteConfigString: {
      key: 'remote_config.data' as any,
      required: false,
      type: 'string',
    },
    remoteConfig: {
      key: 'remote_config.data' as any,
      required: false,
      type: 'string' as any,
      converter: new JSONCoder(),
    },
    revision: { key: 'revision', required: true, type: 'number' },
    variationId: { key: 'variation_id', required: true, type: 'string' },
    version: { key: 'paywall_updated_at', required: true, type: 'number' },
    payloadData: { key: 'payload_data', required: false, type: 'string' },
  };
}
