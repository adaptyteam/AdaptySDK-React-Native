/**
 * iOS-specific bridge event samples in native format (snake_case)
 *
 * Real iOS event data extracted from native logs for accurate testing.
 * Android-specific fields have been removed, iOS-specific fields are included.
 *
 * Use these samples for integration tests to verify iOS-specific event handling.
 */

/**
 * Sample for PaywallViewEvent.WillPurchase (iOS)
 * @see cross_platform.yaml#/$events/PaywallViewEvent.WillPurchase
 */
export const IOS_PAYWALL_PURCHASE_STARTED = {
  view: {
    variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    placement_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    id: '9EC086AC-BE4F-4FB2-AABE-8AD31AF03BDF',
  },
  product: {
    access_level_id: 'premium',
    vendor_product_id: 'yearly.premium.6999',
    localized_title: '1 Year Premium',
    localized_description: '1 Year Premium Description',
    paywall_ab_test_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
    price: {
      currency_code: 'USD',
      currency_symbol: '$',
      localized_string: '$69.99',
      amount: 69.99,
    },
    paywall_product_index: 1,
    paywall_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
    product_type: 'annual',
    paywall_variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    adapty_product_id: '4f930955-b0e4-47c3-8bb9-abd1bbdccabd',
    region_code: 'US',
    is_family_shareable: false,
    subscription: {
      period: {
        unit: 'year',
        number_of_units: 1,
      },
      offer: {
        phases: [
          {
            number_of_periods: 1,
            payment_mode: 'free_trial',
            localized_number_of_periods: '1 month',
            localized_subscription_period: '1 month',
            subscription_period: {
              unit: 'month',
              number_of_units: 1,
            },
            price: {
              amount: 0,
              currency_code: 'USD',
              localized_string: '$0.00',
            },
          },
        ],
        offer_identifier: {
          type: 'introductory',
        },
      },
      group_identifier: '20770576',
      localized_period: '1 year',
    },
  },
  id: 'paywall_view_did_start_purchase',
} as const;

/**
 * Sample for PaywallViewEvent.DidPurchase with successful purchase result (iOS)
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidPurchase
 */
export const IOS_PAYWALL_PURCHASE_COMPLETED_SUCCESS = {
  view: {
    id: '88df97f8-ca94-43a4-bd4a-1749a89988e8',
    placement_id: 'AdaptyRnSdkExample1',
    variation_id: 'a24a2d05-93fe-4bcc-a76e-eef7690a436c',
  },
  product: {
    access_level_id: 'premium',
    is_family_shareable: false,
    localized_description: '1 Year Premium Description',
    localized_title: '1 Year Premium',
    payload_data:
      'eyJjdXJyZW5jeV9jb2RlIjoiVVNEIiwicHJpY2VfYW1vdW50X21pY3JvcyI6Njk5OTAwMCwic3Vic2NyaXB0aW9uX2RhdGEiOnsiZ3JvdXBfaWRlbnRpZmllciI6IjIwNzcwNTc2Iiwib2ZmZXJfaWRlbnRpZmllciI6bnVsbH0sInR5cGUiOiJzdWJzIn0=',
    paywall_ab_test_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
    paywall_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
    price: {
      amount: 69.99,
      currency_code: 'USD',
      currency_symbol: '$',
      localized_string: '$69.99',
    },
    product_type: 'annual',
    subscription: {
      period: {
        unit: 'year',
        number_of_units: 1,
      },
      offer: {
        phases: [
          {
            number_of_periods: 1,
            payment_mode: 'free_trial',
            localized_number_of_periods: '1 month',
            localized_subscription_period: '1 month',
            subscription_period: {
              unit: 'month',
              number_of_units: 1,
            },
            price: {
              amount: 0,
              currency_code: 'USD',
              localized_string: '$0.00',
            },
          },
        ],
        offer_identifier: {
          type: 'introductory',
        },
      },
      group_identifier: '20770576',
      localized_period: '1 year',
    },
    paywall_variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    vendor_product_id: 'yearly.premium.6999',
    paywall_product_index: 1,
    adapty_product_id: '4f930955-b0e4-47c3-8bb9-abd1bbdccabd',
  },
  purchased_result: {
    type: 'success',
    apple_jws_transaction:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1Njc4OTAifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiZXhwIjoxNzM1Mjg4MDAwLCJpYXQiOjE3MzUyODQ0MDAsImp0aSI6IjEyMzQ1Njc4OTAtYWJjZGVmZ2hpamsifQ.signature',
    profile: {
      paid_access_levels: {
        premium: {
          activated_at: '2025-12-26T13:36:09.931000+0000',
          expires_at: '2025-12-26T13:41:09.549000+0000',
          id: 'premium',
          is_active: true,
          is_in_grace_period: false,
          is_lifetime: false,
          is_refund: false,
          renewed_at: '2025-12-26T13:36:09.931000+0000',
          store: 'app_store',
          vendor_product_id: 'yearly.premium.6999',
          will_renew: true,
        },
      },
      custom_attributes: {},
      is_test_user: false,
      non_subscriptions: {},
      profile_id: 'cbdabead-697c-4804-9ea5-7ccaa83411c7',
      subscriptions: {
        'yearly.premium.6999': {
          activated_at: '2025-12-26T13:36:09.931000+0000',
          expires_at: '2025-12-26T13:41:09.549000+0000',
          is_active: true,
          is_in_grace_period: false,
          is_lifetime: false,
          is_refund: false,
          is_sandbox: true,
          renewed_at: '2025-12-26T13:36:09.931000+0000',
          store: 'app_store',
          vendor_original_transaction_id: '1000000123456789',
          vendor_product_id: 'yearly.premium.6999',
          vendor_transaction_id: '1000000123456789',
          will_renew: true,
        },
      },
      segment_hash: 'not implemented',
      timestamp: -1,
    },
  },
  id: 'paywall_view_did_finish_purchase',
} as const;

/**
 * Sample for PaywallViewEvent.DidPurchase with user_cancelled result (iOS)
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidPurchase
 */
export const IOS_PAYWALL_PURCHASE_COMPLETED_CANCELLED = {
  view: {
    variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    placement_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    id: '9EC086AC-BE4F-4FB2-AABE-8AD31AF03BDF',
  },
  purchased_result: {
    type: 'user_cancelled',
  },
  product: {
    access_level_id: 'premium',
    vendor_product_id: 'yearly.premium.6999',
    is_family_shareable: false,
    product_type: 'annual',
    localized_description: '1 Year Premium Description',
    paywall_ab_test_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
    paywall_product_index: 1,
    localized_title: '1 Year Premium',
    subscription: {
      period: {
        unit: 'year',
        number_of_units: 1,
      },
      offer: {
        phases: [
          {
            number_of_periods: 1,
            payment_mode: 'free_trial',
            localized_number_of_periods: '1 month',
            localized_subscription_period: '1 month',
            subscription_period: {
              unit: 'month',
              number_of_units: 1,
            },
            price: {
              amount: 0,
              currency_code: 'USD',
              localized_string: '$0.00',
            },
          },
        ],
        offer_identifier: {
          type: 'introductory',
        },
      },
      group_identifier: '20770576',
      localized_period: '1 year',
    },
    region_code: 'US',
    paywall_variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    price: {
      currency_symbol: '$',
      currency_code: 'USD',
      amount: 69.99,
      localized_string: '$69.99',
    },
    adapty_product_id: '4f930955-b0e4-47c3-8bb9-abd1bbdccabd',
    paywall_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
  },
  id: 'paywall_view_did_finish_purchase',
} as const;

/**
 * Sample for PaywallViewEvent.DidFailPurchase (iOS)
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidFailPurchase
 */
export const IOS_PAYWALL_PURCHASE_FAILED = {
  view: {
    id: '2064bb24-39e4-4c06-a9aa-4417357edfb4',
    placement_id: 'test_placement',
    variation_id: '61d30b4d-d92e-4494-8d78-f3b0f4356fae',
  },
  product: {
    access_level_id: 'premium',
    localized_description: '1 Year Premium Description',
    localized_title: '1 Year Premium',
    payload_data:
      'eyJjdXJyZW5jeV9jb2RlIjoiVVNEIiwicHJpY2VfYW1vdW50X21pY3JvcyI6Njk5OTAwMCwic3Vic2NyaXB0aW9uX2RhdGEiOnsiZ3JvdXBfaWRlbnRpZmllciI6IjIwNzcwNTc2Iiwib2ZmZXJfaWRlbnRpZmllciI6bnVsbH0sInR5cGUiOiJzdWJzIn0=',
    paywall_ab_test_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
    paywall_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
    price: {
      amount: 69.99,
      currency_code: 'USD',
      currency_symbol: '$',
      localized_string: '$69.99',
    },
    product_type: 'annual',
    subscription: {
      period: {
        unit: 'year',
        number_of_units: 1,
      },
      offer: {
        phases: [
          {
            number_of_periods: 1,
            payment_mode: 'free_trial',
            localized_number_of_periods: '1 month',
            localized_subscription_period: '1 month',
            subscription_period: {
              unit: 'month',
              number_of_units: 1,
            },
            price: {
              amount: 0,
              currency_code: 'USD',
              localized_string: '$0.00',
            },
          },
        ],
        offer_identifier: {
          type: 'introductory',
        },
      },
      group_identifier: '20770576',
      localized_period: '1 year',
    },
    paywall_variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    vendor_product_id: 'yearly.premium.6999',
    paywall_product_index: 1,
    adapty_product_id: '4f930955-b0e4-47c3-8bb9-abd1bbdccabd',
    region_code: 'US',
    is_family_shareable: false,
  },
  error: {
    adapty_code: 103,
    message: 'StoreKit purchase failed: User cancelled',
  },
  id: 'paywall_view_did_fail_purchase',
} as const;

/**
 * Sample for PaywallViewEvent.DidRestorePurchase with successful restore (iOS)
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidRestorePurchase
 */
export const IOS_PAYWALL_RESTORE_COMPLETED_SUCCESS = {
  view: {
    id: '3980be37-7a25-4c38-aace-68ee46b2927c',
    placement_id: 'test_placement',
    variation_id: '61d30b4d-d92e-4494-8d78-f3b0f4356fae',
  },
  profile: {
    paid_access_levels: {
      premium: {
        activated_at: '2025-12-26T14:15:01.977000+0000',
        active_introductory_offer_type: 'free_trial',
        expires_at: '2025-12-26T14:18:01.719000+0000',
        id: 'premium',
        is_active: true,
        is_in_grace_period: false,
        is_lifetime: false,
        is_refund: false,
        offer_id: 'intro-free-trial-yearly',
        renewed_at: '2025-12-26T14:15:01.977000+0000',
        store: 'app_store',
        vendor_product_id: 'yearly.premium.6999',
        will_renew: true,
      },
    },
    custom_attributes: {},
    is_test_user: false,
    non_subscriptions: {},
    profile_id: 'd200c008-13fd-4557-9c51-cff73b45a7f2',
    subscriptions: {
      'yearly.premium.6999': {
        activated_at: '2025-12-26T14:15:01.977000+0000',
        active_introductory_offer_type: 'free_trial',
        expires_at: '2025-12-26T14:18:01.719000+0000',
        is_active: true,
        is_in_grace_period: false,
        is_lifetime: false,
        is_refund: false,
        is_sandbox: true,
        offer_id: 'intro-free-trial-yearly',
        renewed_at: '2025-12-26T14:15:01.977000+0000',
        store: 'app_store',
        vendor_original_transaction_id: '1000000123456789',
        vendor_product_id: 'yearly.premium.6999',
        vendor_transaction_id: '1000000123456789',
        will_renew: true,
      },
      'monthly.premium.999': {
        activated_at: '2025-12-26T13:36:09.931000+0000',
        cancellation_reason: 'unknown',
        expires_at: '2025-12-26T13:41:09.549000+0000',
        is_active: false,
        is_in_grace_period: false,
        is_lifetime: false,
        is_refund: false,
        is_sandbox: true,
        renewed_at: '2025-12-26T13:36:09.931000+0000',
        store: 'app_store',
        vendor_original_transaction_id: '1000000987654321',
        vendor_product_id: 'monthly.premium.999',
        vendor_transaction_id: '1000000987654321',
        will_renew: false,
      },
    },
    segment_hash: 'not implemented',
    timestamp: -1,
  },
  id: 'paywall_view_did_finish_restore',
} as const;

/**
 * Sample for PaywallViewEvent.DidFinishWebPaymentNavigation (iOS)
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidFinishWebPaymentNavigation
 */
export const IOS_PAYWALL_WEB_PAYMENT_NAVIGATION_FINISHED = {
  view: {
    id: '2442A0E9-FB7F-4369-87BB-61C80222AFA1',
    variation_id: '5b4f588f-1ea3-4000-9de9-0e82e2fe7a48',
    placement_id: '5b4f588f-1ea3-4000-9de9-0e82e2fe7a48',
  },
  product: {
    region_code: 'US',
    product_type: 'semiannual',
    paywall_name: 'rt.web',
    vendor_product_id: 'sixmonth.premium.999',
    localized_title: 'Six Months Premium',
    web_purchase_url: 'https://example.com',
    access_level_id: 'premium',
    paywall_ab_test_name: 'rt.web',
    subscription: {
      period: {
        unit: 'month',
        number_of_units: 6,
      },
      group_identifier: '20770576',
      localized_period: '6 months',
      offer: null,
    },
    localized_description: 'Six Months Premium Description',
    adapty_product_id: '0f2e86da-4d6f-435e-bc8f-9f2d1c265a27',
    paywall_variation_id: '5b4f588f-1ea3-4000-9de9-0e82e2fe7a48',
    price: {
      currency_symbol: '$',
      localized_string: '$14.99',
      currency_code: 'USD',
      amount: 14.99,
    },
    is_family_shareable: false,
    paywall_product_index: 0,
  },
  id: 'paywall_view_did_finish_web_payment_navigation',
} as const;
