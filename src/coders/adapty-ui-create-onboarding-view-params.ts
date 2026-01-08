import { CreateOnboardingViewParamsInput } from '@/ui/types';
import { Req } from '@/types/schema';

type Serializable = Pick<
  Req['AdaptyUICreateOnboardingView.Request'],
  'external_urls_presentation'
>;

export class AdaptyUICreateOnboardingViewParamsCoder {
  encode(data: CreateOnboardingViewParamsInput): Serializable {
    const result: Serializable = {};

    if (data.externalUrlsPresentation) {
      result.external_urls_presentation = data.externalUrlsPresentation;
    }

    return result;
  }
}
