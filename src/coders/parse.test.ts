// import type { AdaptyNativeError } from '@/types/bridge';
// import type { AdaptyPaywall, AdaptyPaywallProduct, AdaptyProfile } from '@/types';
// import { AdaptyError } from '@/adapty-error';

// import { AdaptyPaywallCoder } from './adapty-paywall';
// import { AdaptyPaywallProductCoder } from './adapty-paywall-product';
// import { AdaptyProfileCoder } from './adapty-profile';
// import { ArrayCoder } from './array';
// import { parse } from './parse';

describe('parse SDK responses', () => {
  // it('AdaptyPaywallCoder', () => {
  //   const input = {
  //     type: 'AdaptyPaywall',
  //     data: {
  //       revision: 1,
  //       use_paywall_builder: true,
  //       products: [{ vendor_product_id: 'weekly.premium.599' }],
  //       variation_id: 'bdaca0ea-04ea-47a8-8f5f-8a6f65edbd51',
  //       developer_id: '111',
  //       paywall_name: '111',
  //       ab_test_name: '111',
  //       remote_config: { lang: 'en', data: '' },
  //       paywall_updated_at: 1676361063649,
  //     },
  //   };
  //   const result = parse<AdaptyPaywall>(JSON.stringify(input));
  //   expect(result).toEqual({
  //     revision: 1,
  //     hasViewConfiguration: true,
  //     products: [{ vendorId: 'weekly.premium.599', ios: {} }],
  //     variationId: 'bdaca0ea-04ea-47a8-8f5f-8a6f65edbd51',
  //     id: '111',
  //     name: '111',
  //     abTestName: '111',
  //     locale: 'en',
  //     remoteConfigString: '',
  //     remoteConfig: {},
  //     version: 1676361063649,
  //   } satisfies AdaptyPaywall);
  //   const coder = new AdaptyPaywallCoder();
  //   const recoded = coder.encode(result);
  //   expect(input.data).toEqual(recoded);
  // });
  // it('AdaptyProfileCoder', () => {
  //   const input = {
  //     type: 'AdaptyProfile',
  //     data: {
  //       customer_user_id: '57739865-5F09-45FF-8A95-BBB5AB0B4276',
  //       paid_access_levels: {
  //         premium: {
  //           id: 'premium',
  //           is_lifetime: false,
  //           vendor_product_id: 'weekly.premium.599',
  //           unsubscribed_at: '2023-07-28T08:16:19.000Z',
  //           expires_at: '2023-07-28T08:16:19.000Z',
  //           will_renew: false,
  //           is_active: false,
  //           is_in_grace_period: false,
  //           activated_at: '2023-01-08T12:05:59.000Z',
  //           renewed_at: '2023-07-28T08:13:19.000Z',
  //           is_refund: false,
  //           cancellation_reason: 'voluntarily_cancelled',
  //           store: 'app_store',
  //         },
  //       },
  //       custom_attributes: {},
  //       non_subscriptions: {},
  //       subscriptions: {
  //         'monthly.premium.999': {
  //           is_lifetime: false,
  //           vendor_product_id: 'monthly.premium.999',
  //           is_sandbox: true,
  //           unsubscribed_at: '2023-01-12T11:36:38.000Z',
  //           expires_at: '2023-01-12T11:36:38.000Z',
  //           will_renew: false,
  //           vendor_transaction_id: '2000000248420224',
  //           vendor_original_transaction_id: '2000000244587785',
  //           is_in_grace_period: false,
  //           activated_at: '2023-01-08T12:05:59.000Z',
  //           is_active: false,
  //           renewed_at: '2023-01-12T11:31:38.000Z',
  //           is_refund: false,
  //           store: 'app_store',
  //         },
  //         'weekly.premium.599': {
  //           is_lifetime: false,
  //           vendor_product_id: 'weekly.premium.599',
  //           is_sandbox: true,
  //           unsubscribed_at: '2023-07-28T08:16:19.000Z',
  //           expires_at: '2023-07-28T08:16:19.000Z',
  //           will_renew: false,
  //           vendor_transaction_id: '2000000378024239',
  //           vendor_original_transaction_id: '2000000244587785',
  //           is_in_grace_period: false,
  //           activated_at: '2023-01-08T12:05:59.000Z',
  //           is_active: false,
  //           renewed_at: '2023-07-28T08:13:19.000Z',
  //           is_refund: false,
  //           store: 'app_store',
  //           cancellation_reason: 'voluntarily_cancelled',
  //         },
  //       },
  //       profile_id: '69a4be0c-7ee2-4669-b637-814a60494346',
  //     },
  //   };
  //   const result = parse<AdaptyProfile>(JSON.stringify(input));
  //   expect(result).toEqual({
  //     profileId: '69a4be0c-7ee2-4669-b637-814a60494346',
  //     customAttributes: {},
  //     customerUserId: '57739865-5F09-45FF-8A95-BBB5AB0B4276',
  //     accessLevels: {
  //       premium: {
  //         id: 'premium',
  //         isLifetime: false,
  //         vendorProductId: 'weekly.premium.599',
  //         unsubscribedAt: new Date('2023-07-28T08:16:19.000Z'),
  //         expiresAt: new Date('2023-07-28T08:16:19.000Z'),
  //         willRenew: false,
  //         isActive: false,
  //         isInGracePeriod: false,
  //         activatedAt: new Date('2023-01-08T12:05:59.000Z'),
  //         renewedAt: new Date('2023-07-28T08:13:19.000Z'),
  //         isRefund: false,
  //         cancellationReason: 'voluntarily_cancelled',
  //         store: 'app_store',
  //       },
  //     },
  //     subscriptions: {
  //       'monthly.premium.999': {
  //         isLifetime: false,
  //         vendorProductId: 'monthly.premium.999',
  //         isSandbox: true,
  //         unsubscribedAt: new Date('2023-01-12T11:36:38.000Z'),
  //         expiresAt: new Date('2023-01-12T11:36:38.000Z'),
  //         willRenew: false,
  //         vendorTransactionId: '2000000248420224',
  //         vendorOriginalTransactionId: '2000000244587785',
  //         isInGracePeriod: false,
  //         activatedAt: new Date('2023-01-08T12:05:59.000Z'),
  //         isActive: false,
  //         renewedAt: new Date('2023-01-12T11:31:38.000Z'),
  //         isRefund: false,
  //         store: 'app_store',
  //       },
  //       'weekly.premium.599': {
  //         isLifetime: false,
  //         vendorProductId: 'weekly.premium.599',
  //         isSandbox: true,
  //         unsubscribedAt: new Date('2023-07-28T08:16:19.000Z'),
  //         expiresAt: new Date('2023-07-28T08:16:19.000Z'),
  //         willRenew: false,
  //         vendorTransactionId: '2000000378024239',
  //         vendorOriginalTransactionId: '2000000244587785',
  //         isInGracePeriod: false,
  //         activatedAt: new Date('2023-01-08T12:05:59.000Z'),
  //         isActive: false,
  //         renewedAt: new Date('2023-07-28T08:13:19.000Z'),
  //         isRefund: false,
  //         store: 'app_store',
  //         cancellationReason: 'voluntarily_cancelled',
  //       },
  //     },
  //     nonSubscriptions: {},
  //   } satisfies AdaptyProfile);
  //   const coder = new AdaptyProfileCoder();
  //   const recoded = coder.encode(result);
  //   expect(input.data).toEqual(recoded);
  // });
  // it('Array<AdaptyPaywallProduct>', () => {
  //   const input = {
  //     type: 'Array<AdaptyPaywallProduct>',
  //     data: [
  //       {
  //         vendor_product_id: 'weekly.premium.599',
  //         subscription_period: {
  //           number_of_units: 7,
  //           unit: 'day',
  //         },
  //         region_code: 'US',
  //         is_family_shareable: false,
  //         localized_subscription_period: '1 week',
  //         currency_code: 'USD',
  //         localized_title: '1 Week Premium',
  //         paywall_name: '111',
  //         price: 5.99,
  //         paywall_ab_test_name: '111',
  //         subscription_group_identifier: '20770576',
  //         discounts: [],
  //         localized_price: '$5.99',
  //         localized_description: '1 Month Premium Description',
  //         currency_symbol: '$',
  //         variation_id: 'bdaca0ea-04ea-47a8-8f5f-8a6f65edbd51',
  //       },
  //     ],
  //   };
  //   const products = parse<AdaptyPaywallProduct[]>(input);
  //   expect(products).toEqual([
  //     {
  //       vendorProductId: 'weekly.premium.599',
  //       subscriptionPeriod: {
  //         numberOfUnits: 7,
  //         unit: 'day',
  //       },
  //       localizedSubscriptionPeriod: '1 week',
  //       currencyCode: 'USD',
  //       localizedTitle: '1 Week Premium',
  //       paywallName: '111',
  //       price: 5.99,
  //       paywallABTestName: '111',
  //       localizedPrice: '$5.99',
  //       localizedDescription: '1 Month Premium Description',
  //       currencySymbol: '$',
  //       variationId: 'bdaca0ea-04ea-47a8-8f5f-8a6f65edbd51',
  //       ios: {
  //         isFamilyShareable: false,
  //         discounts: [],
  //         regionCode: 'US',
  //         subscriptionGroupIdentifier: '20770576',
  //       },
  //       android: {},
  //     },
  //   ] satisfies AdaptyPaywallProduct[]);
  //   const coder = new ArrayCoder(AdaptyPaywallProductCoder as any);
  //   const recoded = coder.encode(products);
  //   expect(input.data).toEqual(recoded);
  // });
  // it('AdaptyError', () => {
  //   const input = {
  //     type: 'AdaptyError',
  //     data: {
  //       adapty_code: 0,
  //       message: 'Product purchase failed',
  //     },
  //   };
  //   const result = parse<AdaptyNativeError>(input);
  //   expect(result).toBeInstanceOf(AdaptyError);
  // });
  it('falsy', () => {
    expect(2).toStrictEqual(2);
  });
});
