import { AdaptyUiOnboardingMetaCoder } from './adapty-ui-onboarding-meta';
import type { AdaptyUiOnboardingMeta } from '@/ui/types';
import type { Def } from '@/types/schema';

type Model = AdaptyUiOnboardingMeta;
const mocks: Def['AdaptyUI.OnboardingMeta'][] = [
  {
    onboarding_id: 'onboarding_123',
    screen_cid: 'screen_456',
    screen_index: 0,
    total_screens: 3,
  },
  {
    onboarding_id: 'onboarding_789',
    screen_cid: 'screen_abc',
    screen_index: 2,
    total_screens: 5,
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    onboardingId: mock.onboarding_id,
    screenClientId: mock.screen_cid,
    screenIndex: mock.screen_index,
    totalScreens: mock.total_screens,
  };
}

describe('AdaptyUiOnboardingMetaCoder', () => {
  let coder: AdaptyUiOnboardingMetaCoder;

  beforeEach(() => {
    coder = new AdaptyUiOnboardingMetaCoder();
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
