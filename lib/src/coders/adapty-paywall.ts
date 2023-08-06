import type { AdaptyPaywall } from '../types';
import { AdaptyProductReferenceCoder } from './adapty-product-reference';
import { ArrayCoder } from './array';
import { Coder } from './coder';
import { JSONCoder } from './json';
import { Properties } from './types';

type Model = AdaptyPaywall;
type Serializable = Record<string, any>;

export class AdaptyPaywallCoder extends Coder<Model, Serializable> {
  protected properties: Properties<Model, Serializable> = {
    id: {
      key: 'developer_id',
      required: true,
      type: 'string',
    },
    name: {
      key: 'paywall_name',
      required: true,
      type: 'string',
    },
    abTestName: {
      key: 'ab_test_name',
      required: true,
      type: 'string',
    },
    variationId: {
      key: 'variation_id',
      required: true,
      type: 'string',
    },
    revision: {
      key: 'revision',
      required: true,
      type: 'number',
    },
    hasViewConfiguration: {
      key: 'use_paywall_builder',
      required: true,
      type: 'boolean',
    },
    locale: {
      key: 'remote_config.lang',
      required: true,
      type: 'string',
    },
    remoteConfigString: {
      key: 'remote_config.data',
      required: false,
      type: 'string',
    },
    remoteConfig: {
      key: 'remote_config.data',
      required: false,
      type: 'string' as any,
      converter: new JSONCoder(),
    },
    products: {
      key: 'products',
      required: true,
      type: 'array',
      converter: new ArrayCoder(AdaptyProductReferenceCoder),
    },
    version: {
      key: 'paywall_updated_at',
      required: true,
      type: 'number',
    },
  };
}
