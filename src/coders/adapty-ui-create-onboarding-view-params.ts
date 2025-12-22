import { CreateOnboardingViewParamsInput } from '@/ui/types';

type Serializable = {
  external_urls_presentation?: string;
};

export class AdaptyUICreateOnboardingViewParamsCoder {
  encode(data: CreateOnboardingViewParamsInput): Serializable {
    const result: Serializable = {};

    if (data.externalUrlsPresentation) {
      result.external_urls_presentation = data.externalUrlsPresentation;
    }

    return result;
  }
}
