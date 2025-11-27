import type { AdaptySubscriptionOfferId } from '@/types';
import type { Def } from '@/types/schema';
import { AdaptySubscriptionOfferIdCoder } from '@/coders/adapty-subscription-offer-identifier';

type Model = AdaptySubscriptionOfferId;
const mocks: Def['AdaptySubscriptionOffer.Identifier'][] = [
  {
    type: 'introductory',
  },
  {
    type: 'introductory',
    id: 'test_intro_offer',
  },
  {
    type: 'promotional',
    id: 'test_promo_offer',
  },
  {
    type: 'win_back',
    id: 'test_win_back_offer',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  if (mock.type === 'introductory') {
    return {
      type: mock.type,
      ...(mock.id && { id: mock.id }),
    };
  } else {
    return {
      type: mock.type,
      id: mock.id,
    };
  }
}

describe('AdaptySubscriptionOfferIdCoder', () => {
  let coder: AdaptySubscriptionOfferIdCoder;

  beforeEach(() => {
    coder = new AdaptySubscriptionOfferIdCoder();
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
