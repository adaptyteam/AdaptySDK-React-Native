/**
 * Bridge event samples for general Adapty handler events
 *
 * Real event data extracted from native logs for accurate testing.
 *
 * Use these samples for integration tests to verify event handling.
 */

/**
 * Sample for Event.DidLoadLatestProfile with active premium subscription
 * @see cross_platform.yaml#/$events/Event.DidLoadLatestProfile
 */
export const PROFILE_DID_LOAD_LATEST_WITH_PREMIUM = {
  id: 'did_load_latest_profile',
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
} as const;

/**
 * Sample for Event.DidLoadLatestProfile with empty profile (no subscriptions)
 * @see cross_platform.yaml#/$events/Event.DidLoadLatestProfile
 */
export const PROFILE_DID_LOAD_LATEST_EMPTY = {
  id: 'did_load_latest_profile',
  profile: {
    profile_id: '8b79ec26-3f3d-482c-99e8-ec745710ef59',
    customer_user_id: null,
    segment_hash:
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    paid_access_levels: {},
    subscriptions: {},
    non_subscriptions: {},
  },
} as const;

/**
 * Sample for Event.OnInstallationDetailsSuccess
 * @see cross_platform.yaml#/$events/Event.OnInstallationDetailsSuccess
 */
export const INSTALLATION_DETAILS_SUCCESS = {
  id: 'on_installation_details_success',
  details: {
    app_launch_count: 8,
    payload: '{}',
    install_time: '2025-12-16T12:08:41.041Z',
    install_id: 'some-install-id',
  },
} as const;

/**
 * Sample for Event.OnInstallationDetailsFail
 * @see cross_platform.yaml#/$events/Event.OnInstallationDetailsFail
 */
export const INSTALLATION_DETAILS_FAIL = {
  id: 'on_installation_details_fail',
  error: {
    adapty_code: 2004,
    message: 'Failed to fetch installation details',
  },
} as const;
