import type { AdaptyPaywall } from '@/types';
import type { Schema } from '@/types/schema';
import type { Properties } from './types';
import { ProductReferenceCoder } from './product-reference';
import { ArrayCoder } from './array';
import { Coder } from './coder';
import { AdaptyRemoteConfigCoder } from './adapty-remote-config';
import { AdaptyPaywallBuilderCoder } from './adapty-paywall-builder';

type Model = AdaptyPaywall;
type CodableModel = Omit<Model, 'hasViewConfiguration'>;
type Serializable = Schema['InOutput.AdaptyPaywall'];

export class AdaptyPaywallCoder extends Coder<Model, CodableModel, Serializable> {
  protected properties: Properties<CodableModel, Serializable> = {
    abTestName: { key: 'ab_test_name', required: true, type: 'string' },
    placementId: { key: 'developer_id', required: true, type: 'string' },
    instanceIdentity: { key: 'paywall_id', required: true, type: 'string' },
    name: { key: 'paywall_name', required: true, type: 'string' },
    products: {
      key: 'products',
      required: true,
      type: 'array',
      converter: new ArrayCoder(ProductReferenceCoder),
    },
    remoteConfig: {
      key: 'remote_config',
      required: false,
      type: 'object',
      converter: new AdaptyRemoteConfigCoder(),
    },
    revision: { key: 'revision', required: true, type: 'number' },
    variationId: { key: 'variation_id', required: true, type: 'string' },
    version: { key: 'response_created_at', required: false, type: 'number' },
    paywallBuilder: {
      key: 'paywall_builder',
      required: false,
      type: 'object',
      converter: new AdaptyPaywallBuilderCoder(),
    },
    payloadData: { key: 'payload_data', required: false, type: 'string' },
  };

  override decode(data: Serializable): Model {
    const codablePart = super.decode(data);
    return {...codablePart, hasViewConfiguration: codablePart.paywallBuilder !== undefined };
  }

  override encode(data: Model): Serializable {
    const { hasViewConfiguration, ...codablePart } = data;
    return super.encode(codablePart);
  }
}
