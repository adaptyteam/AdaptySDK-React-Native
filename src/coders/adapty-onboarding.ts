import type { AdaptyOnboarding } from '@/types';
import type { Def } from '@/types/schema';
import type { Properties } from './types';
import { Coder } from './coder';
import { AdaptyRemoteConfigCoder } from './adapty-remote-config';
import { AdaptyOnboardingBuilderCoder } from './adapty-onboarding-builder';
import { AdaptyPlacementCoder } from '@/coders/adapty-placement';

type Model = AdaptyOnboarding;
type CodableModel = Omit<Model, 'hasViewConfiguration'>;
type Serializable = Def['AdaptyOnboarding'];

export class AdaptyOnboardingCoder extends Coder<
  Model,
  CodableModel,
  Serializable
> {
  protected properties: Properties<CodableModel, Serializable> = {
    placement: {
      key: 'placement',
      required: true,
      type: 'object',
      converter: new AdaptyPlacementCoder(),
    },
    id: { key: 'onboarding_id', required: true, type: 'string' },
    name: { key: 'onboarding_name', required: true, type: 'string' },
    remoteConfig: {
      key: 'remote_config',
      required: false,
      type: 'object',
      converter: new AdaptyRemoteConfigCoder(),
    },
    variationId: { key: 'variation_id', required: true, type: 'string' },
    version: { key: 'response_created_at', required: false, type: 'number' },
    onboardingBuilder: {
      key: 'onboarding_builder',
      required: false,
      type: 'object',
      converter: new AdaptyOnboardingBuilderCoder(),
    },
    payloadData: { key: 'payload_data', required: false, type: 'string' },
  };

  override decode(data: Serializable): Model {
    const codablePart = super.decode(data);
    return {
      ...codablePart,
      hasViewConfiguration: codablePart.onboardingBuilder !== undefined,
    };
  }

  override encode(data: Model): Serializable {
    const { hasViewConfiguration, ...codablePart } = data;
    return super.encode(codablePart);
  }
}
