import { AdaptyUICreateOnboardingViewParamsCoder } from './adapty-ui-create-onboarding-view-params';
import { CreateOnboardingViewParamsInput } from '@/ui/types';
import { WebPresentation } from '@/types';

describe('AdaptyUICreateOnboardingViewParamsCoder', () => {
  let coder: AdaptyUICreateOnboardingViewParamsCoder;

  beforeEach(() => {
    coder = new AdaptyUICreateOnboardingViewParamsCoder();
  });

  it('encodes empty object to empty object', () => {
    const input: CreateOnboardingViewParamsInput = {};
    const result = coder.encode(input);
    expect(result).toEqual({});
  });

  it('encodes with externalUrlsPresentation', () => {
    const input: CreateOnboardingViewParamsInput = {
      externalUrlsPresentation: WebPresentation.BrowserInApp,
    };
    const result = coder.encode(input);
    expect(result).toEqual({
      external_urls_presentation: 'browser_in_app',
    });
  });

  it('encodes with undefined externalUrlsPresentation', () => {
    const input: CreateOnboardingViewParamsInput = {
      externalUrlsPresentation: undefined,
    };
    const result = coder.encode(input);
    expect(result).toEqual({});
  });
});
