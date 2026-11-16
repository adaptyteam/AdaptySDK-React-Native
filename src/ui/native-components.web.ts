// Web has no native views and NativeComponentRegistry breaks the web bundle.
import { AdaptyFlowViewMock } from './AdaptyFlowView.mock';
import { AdaptyOnboardingViewMock } from './AdaptyOnboardingView.mock';

export const AdaptyFlowViewHost = AdaptyFlowViewMock;
export const AdaptyOnboardingViewHost = AdaptyOnboardingViewMock;
