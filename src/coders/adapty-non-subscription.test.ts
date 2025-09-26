import type { Def } from '@/types/schema';
import type { AdaptyNonSubscription, VendorStore } from '@/types';
import { AdaptyNonSubscriptionCoder } from './adapty-non-subscription';

type Model = AdaptyNonSubscription;
const mocks: Def['AdaptyProfile.NonSubscription'][] = [
  {
    is_consumable: true,
    is_refund: false,
    is_sandbox: false,
    purchase_id: 'purchase123',
    purchased_at: '2023-08-08T12:00:00.000Z',
    store: 'appstore',
    vendor_product_id: 'product1',
    vendor_transaction_id: 'transaction1',
  },
  {
    is_consumable: false,
    is_refund: true,
    is_sandbox: true,
    purchase_id: 'purchase456',
    purchased_at: '2023-07-15T14:30:00.000Z',
    store: 'google_play',
    vendor_product_id: 'product2',
  },
];

function toModel(mock: (typeof mocks)[number]): Model {
  return {
    isConsumable: mock.is_consumable,
    isRefund: mock.is_refund,
    isSandbox: mock.is_sandbox,
    purchaseId: mock.purchase_id,
    purchasedAt: new Date(mock.purchased_at),
    store: mock.store as VendorStore,
    vendorProductId: mock.vendor_product_id,
    ...(mock.vendor_transaction_id && {
      vendorTransactionId: mock.vendor_transaction_id,
    }),
  };
}

describe('AdaptyNonSubscriptionCoder', () => {
  let coder: AdaptyNonSubscriptionCoder;

  beforeEach(() => {
    coder = new AdaptyNonSubscriptionCoder();
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
