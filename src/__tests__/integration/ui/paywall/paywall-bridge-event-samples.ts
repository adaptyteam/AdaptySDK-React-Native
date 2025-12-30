/**
 * Bridge event samples in native format (snake_case)
 *
 * Real event data extracted from native logs for accurate testing.
 *
 * NOTE: These samples may contain platform-specific fields (iOS: is_family_shareable, group_identifier;
 * Android: base_plan_id, renewal_type, google_purchase_token). When used in base tests
 * (paywall-view-controller-events.test.ts), only platform-independent fields are verified.
 * Platform-specific fields are tested in:
 * - ios-paywall-view-controller-events.test.ts
 * - android-paywall-view-controller-events.test.ts
 *
 * Use these samples for integration tests to verify event handling.
 */

/**
 * Sample for PaywallViewEvent.DidSelectProduct
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidSelectProduct
 */
export const PAYWALL_PRODUCT_SELECTED_YEARLY = {
  id: 'paywall_view_did_select_product',
  product_id: 'yearly.premium.6999',
  view: {
    placement_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    id: '9EC086AC-BE4F-4FB2-AABE-8AD31AF03BDF',
    variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
  },
} as const;

/**
 * Sample for PaywallViewEvent.DidSelectProduct (six month product)
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidSelectProduct
 */
export const PAYWALL_PRODUCT_SELECTED_SIXMONTH = {
  view: {
    id: '9EC086AC-BE4F-4FB2-AABE-8AD31AF03BDF',
    placement_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
  },
  id: 'paywall_view_did_select_product',
  product_id: 'sixmonth.premium.999',
} as const;

/**
 * Sample for PaywallViewEvent.DidDisappear
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidDisappear
 */
export const PAYWALL_VIEW_DISAPPEARED = {
  view: {
    variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    placement_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    id: '9EC086AC-BE4F-4FB2-AABE-8AD31AF03BDF',
  },
  id: 'paywall_view_did_disappear',
} as const;

/**
 * Sample for PaywallViewEvent.DidUserAction with close action
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidUserAction
 */
export const PAYWALL_USER_ACTION_CLOSE = {
  view: {
    variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    id: '9EC086AC-BE4F-4FB2-AABE-8AD31AF03BDF',
    placement_id: '3968c273-f247-4b9f-bd90-305be39d6414',
  },
  action: {
    type: 'close',
  },
  id: 'paywall_view_did_perform_action',
} as const;

/**
 * Sample for PaywallViewEvent.DidUserAction with open_url action
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidUserAction
 */
export const PAYWALL_USER_ACTION_OPEN_URL = {
  id: 'paywall_view_did_perform_action',
  action: {
    value: 'https://example.com/terms',
    type: 'open_url',
  },
  view: {
    placement_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    id: '9EC086AC-BE4F-4FB2-AABE-8AD31AF03BDF',
    variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
  },
} as const;

/**
 * Sample for PaywallViewEvent.DidUserAction with system_back action (Android)
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidUserAction
 */
export const PAYWALL_USER_ACTION_SYSTEM_BACK = {
  view: {
    id: '99cc6779-cf80-4fca-ae3c-9d7a7bca0fed',
    placement_id: 'AdaptyRnSdkExample1',
    variation_id: 'a24a2d05-93fe-4bcc-a76e-eef7690a436c',
  },
  action: {
    type: 'system_back',
  },
  id: 'paywall_view_did_perform_action',
} as const;

/**
 * Sample for PaywallViewEvent.DidUserAction with close action
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidUserAction
 */
export const PAYWALL_USER_ACTION_CLOSE_BUTTON = {
  view: {
    id: 'dc654d38-2970-4f56-a9e8-5d00bd94e7ad',
    placement_id: 'AdaptyRnSdkExample1',
    variation_id: 'a24a2d05-93fe-4bcc-a76e-eef7690a436c',
  },
  action: {
    type: 'close',
  },
  id: 'paywall_view_did_perform_action',
} as const;

/**
 * Sample for PaywallViewEvent.DidPurchase with user_cancelled result
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidPurchase
 */
export const PAYWALL_PURCHASE_COMPLETED_CANCELLED = {
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
 * Sample for PaywallViewEvent.DidPurchase with successful purchase result
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidPurchase
 */
export const PAYWALL_PURCHASE_COMPLETED_SUCCESS = {
  view: {
    id: '88df97f8-ca94-43a4-bd4a-1749a89988e8',
    placement_id: 'AdaptyRnSdkExample1',
    variation_id: 'a24a2d05-93fe-4bcc-a76e-eef7690a436c',
  },
  product: {
    access_level_id: 'premium',
    is_family_shareable: false,
    localized_description: 'sdfg',
    localized_title: 'sdfg',
    payload_data:
      'eyJjdXJyZW5jeV9jb2RlIjoiRVVSIiwicHJpY2VfYW1vdW50X21pY3JvcyI6MTE5OTAwMDAsInN1\nYnNjcmlwdGlvbl9kYXRhIjp7ImJhc2VfcGxhbl9pZCI6IndlZWtseS1wcmVtaXVtLTU5OS1iYXNl\nIiwib2ZmZXJfaWQiOm51bGx9LCJ0eXBlIjoic3VicyJ9\n',
    paywall_ab_test_name: 'AdaptyRnSdkExample1',
    paywall_name: 'AdaptyRnSdkExample1',
    price: {
      amount: 11.99,
      currency_code: 'EUR',
      currency_symbol: '€',
      localized_string: '€11.99',
    },
    product_type: 'weekly',
    subscription: {
      base_plan_id: 'weekly-premium-599-base',
      localized_period: '1 week',
      offer_id: 'intro-pay-up-front-weekly-premium',
      offer_tags: [],
      renewal_type: 'autorenewable',
      period: {
        number_of_units: 1,
        unit: 'week',
      },
    },
    paywall_variation_id: 'a24a2d05-93fe-4bcc-a76e-eef7690a436c',
    vendor_product_id: 'weekly.premium.599',
    web_purchase_url:
      'http://paywalls-14c3d623-2f3a-455a-aa86-ef83dff6913b.fnlfx.com/trest2',
    paywall_product_index: 0,
    adapty_product_id: 'b136422f-8153-402a-afbb-986929c68f6a',
  },
  purchased_result: {
    type: 'success',
    google_purchase_token:
      'abcdefghijklmnopqrs.AO-J1Oy0BKdJa02G4rK5G7jxhSbdajFmsy3FSHTqLUwE1rApPKMSJaY_gZg6aIVgxPO10_GRD94ZCSKvoAp3EkqDLRLQ45W7-Q',
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
          store: 'play_store',
          vendor_product_id: 'weekly.premium.599',
          will_renew: true,
        },
      },
      custom_attributes: {},
      is_test_user: false,
      non_subscriptions: {},
      profile_id: 'cbdabead-697c-4804-9ea5-7ccaa83411c7',
      subscriptions: {
        'weekly.premium.599': {
          activated_at: '2025-12-26T13:36:09.931000+0000',
          expires_at: '2025-12-26T13:41:09.549000+0000',
          is_active: true,
          is_in_grace_period: false,
          is_lifetime: false,
          is_refund: false,
          is_sandbox: true,
          renewed_at: '2025-12-26T13:36:09.931000+0000',
          store: 'play_store',
          vendor_original_transaction_id: 'GPA.3338-3241-1006-23335',
          vendor_product_id: 'weekly.premium.599',
          vendor_transaction_id: 'GPA.3338-3241-1006-23335',
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
 * Sample for PaywallViewEvent.DidFailPurchase
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidFailPurchase
 */
export const PAYWALL_PURCHASE_FAILED = {
  view: {
    id: '2064bb24-39e4-4c06-a9aa-4417357edfb4',
    placement_id: 'test_placement',
    variation_id: '61d30b4d-d92e-4494-8d78-f3b0f4356fae',
  },
  product: {
    access_level_id: 'premium',
    is_family_shareable: false,
    localized_description: 'Description',
    localized_title: 'Title',
    payload_data:
      'eyJjdXJyZW5jeV9jb2RlIjoiRVVSIiwicHJpY2VfYW1vdW50X21pY3JvcyI6MTM5OTAwMDAsInN1\nYmNjcmlwdGlvbl9kYXRhIjp7ImJhc2VfcGxhbl9pZCI6Im1vbnRobHktcHJlbWl1bS05OTktYmFz\nZSIsIm9mZmVyX2lkIjpudWxsfSwidHlwZSI6InN1YnMifQ==\n',
    paywall_ab_test_name: 'test_restore_button',
    paywall_name: 'test_restore_button',
    price: {
      amount: 13.99,
      currency_code: 'EUR',
      currency_symbol: '€',
      localized_string: '€13.99',
    },
    product_type: 'monthly',
    subscription: {
      base_plan_id: 'monthly-premium-999-base',
      localized_period: '1 month',
      offer_tags: [],
      renewal_type: 'autorenewable',
      period: {
        number_of_units: 1,
        unit: 'month',
      },
    },
    paywall_variation_id: '61d30b4d-d92e-4494-8d78-f3b0f4356fae',
    vendor_product_id: 'monthly.premium.999',
    paywall_product_index: 0,
    adapty_product_id: 'ac281b85-9294-4109-b9f1-4ab66b52d263',
  },
  error: {
    adapty_code: 103,
    message: 'Play Market request failed on purchases updated: responseCode=3',
  },
  id: 'paywall_view_did_fail_purchase',
} as const;

/**
 * Sample for PaywallViewEvent.WillPurchase
 * @see cross_platform.yaml#/$events/PaywallViewEvent.WillPurchase
 */
export const PAYWALL_PURCHASE_STARTED = {
  product: {
    subscription: {
      offer: {
        phases: [
          {
            localized_number_of_periods: '1 month',
            price: {
              amount: 0,
              currency_code: 'USD',
              localized_string: '$0.00',
            },
            localized_subscription_period: '1 month',
            number_of_periods: 1,
            payment_mode: 'free_trial',
            subscription_period: {
              unit: 'month',
              number_of_units: 1,
            },
          },
        ],
        offer_identifier: {
          type: 'introductory',
        },
      },
      group_identifier: '20770576',
      localized_period: '1 year',
      period: {
        unit: 'year',
        number_of_units: 1,
      },
    },
    region_code: 'US',
    access_level_id: 'premium',
    is_family_shareable: false,
    localized_title: '1 Year Premium',
    vendor_product_id: 'yearly.premium.6999',
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
  },
  view: {
    variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    placement_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    id: '9EC086AC-BE4F-4FB2-AABE-8AD31AF03BDF',
  },
  id: 'paywall_view_did_start_purchase',
} as const;

/**
 * Sample for PaywallViewEvent.DidAppear
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidAppear
 */
export const PAYWALL_VIEW_APPEARED = {
  id: 'paywall_view_did_appear',
  view: {
    id: '9EC086AC-BE4F-4FB2-AABE-8AD31AF03BDF',
    placement_id: '3968c273-f247-4b9f-bd90-305be39d6414',
    variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
  },
} as const;

/**
 * Sample for PaywallViewEvent.WillRestorePurchase
 * @see cross_platform.yaml#/$events/PaywallViewEvent.WillRestorePurchase
 */
export const PAYWALL_RESTORE_STARTED = {
  view: {
    id: '3980be37-7a25-4c38-aace-68ee46b2927c',
    placement_id: 'test_placement',
    variation_id: '61d30b4d-d92e-4494-8d78-f3b0f4356fae',
  },
  id: 'paywall_view_did_start_restore',
} as const;

/**
 * Sample for PaywallViewEvent.DidRestorePurchase with successful restore
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidRestorePurchase
 */
export const PAYWALL_RESTORE_COMPLETED_SUCCESS = {
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
        store: 'play_store',
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
        store: 'play_store',
        vendor_original_transaction_id: 'GPA.3372-6866-7337-08302',
        vendor_product_id: 'yearly.premium.6999',
        vendor_transaction_id: 'GPA.3372-6866-7337-08302',
        will_renew: true,
      },
      'weekly.premium.599': {
        activated_at: '2025-12-26T13:36:09.931000+0000',
        cancellation_reason: 'unknown',
        expires_at: '2025-12-26T13:41:09.549000+0000',
        is_active: false,
        is_in_grace_period: false,
        is_lifetime: false,
        is_refund: false,
        is_sandbox: true,
        renewed_at: '2025-12-26T13:36:09.931000+0000',
        store: 'play_store',
        vendor_original_transaction_id: 'GPA.3338-3241-1006-23335',
        vendor_product_id: 'weekly.premium.599',
        vendor_transaction_id: 'GPA.3338-3241-1006-23335',
        will_renew: false,
      },
    },
    segment_hash: 'not implemented',
    timestamp: -1,
  },
  id: 'paywall_view_did_finish_restore',
} as const;

/**
 * Sample for PaywallViewEvent.DidFailRestorePurchase
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidFailRestorePurchase
 */
export const PAYWALL_RESTORE_FAILED = {
  view: {
    id: '0316c394-5e33-49bf-8fdd-49f07d74c065',
    placement_id: 'test_placement',
    variation_id: '61d30b4d-d92e-4494-8d78-f3b0f4356fae',
  },
  error: {
    adapty_code: 103,
    message:
      'Play Market request failed: Billing service unavailable on device.',
  },
  id: 'paywall_view_did_fail_restore',
} as const;

/**
 * Sample for PaywallViewEvent.DidFailLoadingProducts
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidFailLoadingProducts
 */
export const PAYWALL_LOADING_PRODUCTS_FAILED = {
  view: {
    id: '0316c394-5e33-49bf-8fdd-49f07d74c065',
    placement_id: 'test_placement',
    variation_id: '61d30b4d-d92e-4494-8d78-f3b0f4356fae',
  },
  error: {
    adapty_code: 103,
    message:
      'Play Market request failed: Billing service unavailable on device.',
  },
  id: 'paywall_view_did_fail_loading_products',
} as const;

/**
 * Sample for PaywallViewEvent.DidFailRendering
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidFailRendering
 */
export const PAYWALL_RENDERING_FAILED = {
  view: {
    id: '2064bb24-39e4-4c06-a9aa-4417357edfb4',
    placement_id: 'test_placement',
    variation_id: '61d30b4d-d92e-4494-8d78-f3b0f4356fae',
  },
  error: {
    adapty_code: 23,
    message:
      'The paywall JSON is not valid. Fix it in the Adapty Dashboard. Refer to the Customize paywall with remote config topic for details on how to fix it.',
  },
  id: 'paywall_view_did_fail_rendering',
} as const;

/**
 * Sample for PaywallViewEvent.DidFinishWebPaymentNavigation
 * @see cross_platform.yaml#/$events/PaywallViewEvent.DidFinishWebPaymentNavigation
 */
export const PAYWALL_WEB_PAYMENT_NAVIGATION_FINISHED = {
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

/**
 * Common product data for yearly premium
 */
export const COMMON_PRODUCT_YEARLY = {
  vendor_product_id: 'yearly.premium.6999',
  adapty_product_id: '4f930955-b0e4-47c3-8bb9-abd1bbdccabd',
  access_level_id: 'premium',
  product_type: 'annual',
  localized_title: '1 Year Premium',
  localized_description: '1 Year Premium Description',
  region_code: 'US',
  is_family_shareable: false,
  paywall_product_index: 1,
  paywall_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
  paywall_ab_test_name: 'rt.Short.Overlay.Video.DarkMode.Toggle2 (Copy)',
  paywall_variation_id: '3968c273-f247-4b9f-bd90-305be39d6414',
  price: {
    amount: 69.99,
    currency_code: 'USD',
    currency_symbol: '$',
    localized_string: '$69.99',
  },
  subscription: {
    period: {
      unit: 'year',
      number_of_units: 1,
    },
    localized_period: '1 year',
    group_identifier: '20770576',
    offer: {
      offer_identifier: {
        type: 'introductory',
      },
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
    },
  },
} as const;
