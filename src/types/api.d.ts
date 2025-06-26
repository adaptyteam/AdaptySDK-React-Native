/** OneOf type helpers */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
type OneOf<T extends any[]> = T extends [infer Only]
  ? Only
  : T extends [infer A, infer B, ...infer Rest]
  ? OneOf<[XOR<A, B>, ...Rest]>
  : never;

export type paths = Record<string, never>;

export type webhooks = Record<string, never>;

export interface components {
  requests: {
    'Activate.Request': {
      method: 'activate';
      configuration: components['defs']['AdaptyConfiguration'];
    };

    'Activate.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'AdaptyUICreatePaywallView.Request': {
      method: 'adapty_ui_create_paywall_view';
      paywall: components['defs']['AdaptyPaywall'];
      load_timeout?: number;
      preload_products?: boolean;
      custom_tags?: components['defs']['AdaptyUI.CustomTagsValues'];
      custom_timers?: components['defs']['AdaptyUI.CustomTimersValues'];
      custom_assets?: components['defs']['AdaptyUI.CustomAssets'];
      android_personalized_offers?: components['defs']['AdaptyUI.AndroidPersonalizedOffers'];
    };

    'AdaptyUICreatePaywallView.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyUI.PaywallView'] },
      ]
    >;

    'AdaptyUIDismissPaywallView.Request': {
      method: 'adapty_ui_dismiss_paywall_view';
      id: string;
      destroy?: boolean;
    };

    'AdaptyUIDismissPaywallView.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'AdaptyUIPresentPaywallView.Request': {
      method: 'adapty_ui_present_paywall_view';
      id: string;
    };

    'AdaptyUIPresentPaywallView.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'AdaptyUIShowDialog.Request': {
      method: 'adapty_ui_show_dialog';
      id: string;
      configuration: components['defs']['AdaptyUI.DialogConfiguration'];
    };

    'AdaptyUIShowDialog.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyUI.DialogActionType'] },
      ]
    >;

    'AdaptyUICreateOnboardingView.Request': {
      method: 'adapty_ui_create_onboarding_view';
      onboarding: components['defs']['AdaptyOnboarding'];
    };

    'AdaptyUICreateOnboardingView.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyUI.OnboardingView'] },
      ]
    >;

    'AdaptyUIDismissOnboardingView.Request': {
      method: 'adapty_ui_dismiss_onboarding_view';
      id: string;
      destroy?: boolean;
    };

    'AdaptyUIDismissOnboardingView.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'AdaptyUIPresentOnboardingView.Request': {
      method: 'adapty_ui_present_onboarding_view';
      id: string;
    };

    'AdaptyUIPresentOnboardingView.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'GetPaywall.Request': {
      method: 'get_paywall';
      placement_id: string;
      locale?: components['defs']['AdaptyLocale'];
      fetch_policy?: components['defs']['AdaptyPlacementFetchPolicy'];
      load_timeout?: number;
    };

    'GetPaywall.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyPaywall'] },
      ]
    >;

    'GetPaywallForDefaultAudience.Request': {
      method: 'get_paywall_for_default_audience';
      placement_id: string;
      locale?: components['defs']['AdaptyLocale'];
      fetch_policy?: components['defs']['AdaptyPlacementFetchPolicy'];
    };

    'GetPaywallForDefaultAudience.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyPaywall'] },
      ]
    >;

    'GetPaywallProducts.Request': {
      method: 'get_paywall_products';
      paywall: components['defs']['AdaptyPaywall'];
    };

    'GetPaywallProducts.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyPaywallProduct.Response'][] },
      ]
    >;

    'GetOnboarding.Request': {
      method: 'get_onboarding';
      placement_id: string;
      locale?: components['defs']['AdaptyLocale'];
      fetch_policy?: components['defs']['AdaptyPlacementFetchPolicy'];
      load_timeout?: number;
    };

    'GetOnboarding.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyOnboarding'] },
      ]
    >;

    'GetOnboardingForDefaultAudience.Request': {
      method: 'get_onboarding_for_default_audience';
      placement_id: string;
      locale?: components['defs']['AdaptyLocale'];
      fetch_policy?: components['defs']['AdaptyPlacementFetchPolicy'];
    };

    'GetOnboardingForDefaultAudience.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyOnboarding'] },
      ]
    >;

    'GetProfile.Request': {
      method: 'get_profile';
    };

    'GetProfile.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyProfile'] },
      ]
    >;

    'Identify.Request': {
      method: 'identify';
      customer_user_id: string;
    };

    'Identify.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'IsActivated.Request': {
      method: 'is_activated';
    };

    'IsActivated.Response': {
      success: boolean;
    };

    'GetLogLevel.Request': {
      method: 'get_log_level';
    };

    'GetLogLevel.Response': {
      success: components['defs']['AdaptyLog.Level'];
    };

    'SetLogLevel.Request': {
      method: 'set_log_level';
      value: components['defs']['AdaptyLog.Level'];
    };

    'SetLogLevel.Response': {
      success: true;
    };

    'Logout.Request': {
      method: 'logout';
    };

    'Logout.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'LogShowOnboarding.Request': {
      method: 'log_show_onboarding';
      params: components['defs']['AdaptyOnboardingScreenParameters'];
    };

    'LogShowOnboarding.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'LogShowPaywall.Request': {
      method: 'log_show_paywall';
      paywall: components['defs']['AdaptyPaywall'];
    };

    'LogShowPaywall.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'MakePurchase.Request': {
      method: 'make_purchase';
      product: components['defs']['AdaptyPaywallProduct.Request'];
      subscription_update_params?: components['defs']['AdaptySubscriptionUpdateParameters'];
      is_offer_personalized?: boolean;
    };

    'MakePurchase.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyPurchaseResult'] },
      ]
    >;

    'OpenWebPaywall.Request': OneOf<
      [
        {
          method: 'open_web_paywall';
          product: components['defs']['AdaptyPaywallProduct.Request'];
        },
        {
          method: 'open_web_paywall';
          paywall: components['defs']['AdaptyPaywall'];
        },
      ]
    >;

    'OpenWebPaywall.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'CreateWebPaywallUrl.Request': OneOf<
      [
        {
          method: 'create_web_paywall_url';
          product: components['defs']['AdaptyPaywallProduct.Request'];
        },
        {
          method: 'create_web_paywall_url';
          paywall: components['defs']['AdaptyPaywall'];
        },
      ]
    >;

    'CreateWebPaywallUrl.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: string }]
    >;

    'PresentCodeRedemptionSheet.Request': {
      method: 'present_code_redemption_sheet';
    };

    'PresentCodeRedemptionSheet.Response': {
      success: true;
    };

    'ReportTransaction.Request': {
      method: 'report_transaction';
      transaction_id: string;
      variation_id?: string;
    };

    'ReportTransaction.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyProfile'] },
      ]
    >;

    'RestorePurchases.Request': {
      method: 'restore_purchases';
    };

    'RestorePurchases.Response': OneOf<
      [
        { error: components['defs']['AdaptyError'] },
        { success: components['defs']['AdaptyProfile'] },
      ]
    >;

    'GetSDKVersion.Request': {
      method: 'get_sdk_version';
    };

    'GetSDKVersion.Response': {
      success: string;
    };

    'SetFallback.Request': {
      method: 'set_fallback';
    } & OneOf<[{ asset_id: string }, { path: string }]>;

    'SetFallback.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'SetIntegrationIdentifier.Request': {
      method: 'set_integration_identifiers';
      key_values: Record<string, string>;
    };

    'SetIntegrationIdentifier.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'UpdateAttributionData.Request': {
      method: 'update_attribution_data';
      attribution: string;
      source: string;
    };

    'UpdateAttributionData.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'UpdateCollectingRefundDataConsent.Request': {
      method: 'update_collecting_refund_data_consent';
      consent: boolean;
    };

    'UpdateCollectingRefundDataConsent.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'UpdateProfile.Request': {
      method: 'update_profile';
      params: components['defs']['AdaptyProfileParameters'];
    };

    'UpdateProfile.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;

    'UpdateRefundPreference.Request': {
      method: 'update_refund_preference';
      refund_preference: components['defs']['AdaptyRefundPreference'];
    };

    'UpdateRefundPreference.Response': OneOf<
      [{ error: components['defs']['AdaptyError'] }, { success: true }]
    >;
  };
  events: {
    'Event.DidLoadLatestProfile': {
      id: 'did_load_latest_profile';
      profile: components['defs']['AdaptyProfile'];
    };

    'PaywallViewEvent.DidAppear': {
      id: 'paywall_view_did_appear';
      view: components['defs']['AdaptyUI.PaywallView'];
    };

    'PaywallViewEvent.DidDisappear': {
      id: 'paywall_view_did_disappear';
      view: components['defs']['AdaptyUI.PaywallView'];
    };

    'PaywallViewEvent.DidUserAction': {
      id: 'paywall_view_did_perform_action';
      view: components['defs']['AdaptyUI.PaywallView'];
      action: components['defs']['AdaptyUI.UserAction'];
    };

    'PaywallViewEvent.DidSelectProduct': {
      id: 'paywall_view_did_select_product';
      view: components['defs']['AdaptyUI.PaywallView'];
      product_id: string;
    };

    'PaywallViewEvent.WillPurchase': {
      id: 'paywall_view_did_start_purchase';
      view: components['defs']['AdaptyUI.PaywallView'];
      product: components['defs']['AdaptyPaywallProduct.Response'];
    };

    'PaywallViewEvent.DidPurchase': {
      id: 'paywall_view_did_finish_purchase';
      view: components['defs']['AdaptyUI.PaywallView'];
      product: components['defs']['AdaptyPaywallProduct.Response'];
      purchased_result: components['defs']['AdaptyPurchaseResult'];
    };

    'PaywallViewEvent.DidFailPurchase': {
      id: 'paywall_view_did_fail_purchase';
      view: components['defs']['AdaptyUI.PaywallView'];
      product: components['defs']['AdaptyPaywallProduct.Response'];
      error: components['defs']['AdaptyError'];
    };

    'PaywallViewEvent.WillRestorePurchase': {
      id: 'paywall_view_did_start_restore';
      view: components['defs']['AdaptyUI.PaywallView'];
    };

    'PaywallViewEvent.DidRestorePurchase': {
      id: 'paywall_view_did_finish_restore';
      view: components['defs']['AdaptyUI.PaywallView'];
      profile: components['defs']['AdaptyProfile'];
    };

    'PaywallViewEvent.DidFailRestorePurchase': {
      id: 'paywall_view_did_fail_restore';
      view: components['defs']['AdaptyUI.PaywallView'];
      error: components['defs']['AdaptyError'];
    };

    'PaywallViewEvent.DidFailRendering': {
      id: 'paywall_view_did_fail_rendering';
      view: components['defs']['AdaptyUI.PaywallView'];
      error: components['defs']['AdaptyError'];
    };

    'PaywallViewEvent.DidFailLoadingProducts': {
      id: 'paywall_view_did_fail_loading_products';
      view: components['defs']['AdaptyUI.PaywallView'];
      error: components['defs']['AdaptyError'];
    };

    'PaywallViewEvent.DidFinishWebPaymentNavigation': {
      id: 'paywall_view_did_finish_web_payment_navigation';
      view: components['defs']['AdaptyUI.PaywallView'];
      product?: components['defs']['AdaptyPaywallProduct.Response'];
      error?: components['defs']['AdaptyError'];
    };

    'OnboardingViewEvent.DidFailWithError': {
      id: 'onboarding_did_fail_with_error';
      view: components['defs']['AdaptyUI.OnboardingView'];
      error: components['defs']['AdaptyError'];
    };

    'OnboardingViewEvent.OnAnalyticsEvent': {
      id: 'onboarding_on_analytics_action';
      view: components['defs']['AdaptyUI.OnboardingView'];
      meta: components['defs']['AdaptyUI.OnboardingMeta'];
      event: {
        name:
          | 'onboarding_started'
          | 'screen_presented'
          | 'screen_completed'
          | 'second_screen_presented'
          | 'registration_screen_presented'
          | 'products_screen_presented'
          | 'user_email_collected'
          | 'onboarding_completed'
          | string;
        element_id?: string;
        reply?: string;
      };
    };

    'OnboardingViewEvent.DidFinishLoading': {
      id: 'onboarding_did_finish_loading';
      view: components['defs']['AdaptyUI.OnboardingView'];
      meta: components['defs']['AdaptyUI.OnboardingMeta'];
    };

    'OnboardingViewEvent.OnCloseAction': {
      id: 'onboarding_on_close_action';
      view: components['defs']['AdaptyUI.OnboardingView'];
      meta: components['defs']['AdaptyUI.OnboardingMeta'];
      action_id: string;
    };

    'OnboardingViewEvent.OnCustomAction': {
      id: 'onboarding_on_custom_action';
      view: components['defs']['AdaptyUI.OnboardingView'];
      meta: components['defs']['AdaptyUI.OnboardingMeta'];
      action_id: string;
    };

    'OnboardingViewEvent.OnPaywallAction': {
      id: 'onboarding_on_paywall_action';
      view: components['defs']['AdaptyUI.OnboardingView'];
      meta: components['defs']['AdaptyUI.OnboardingMeta'];
      action_id: string;
    };

    'OnboardingViewEvent.OnStateUpdatedAction': {
      id: 'onboarding_on_state_updated_action';
      view: components['defs']['AdaptyUI.OnboardingView'];
      meta: components['defs']['AdaptyUI.OnboardingMeta'];
      action:
        | {
            element_id: string;
            element_type: 'select';
            value: components['defs']['AdaptyUI.OnboardingsStateParams'];
          }
        | {
            element_id: string;
            element_type: 'multi_select';
            value: components['defs']['AdaptyUI.OnboardingsStateParams'][];
          }
        | {
            element_id: string;
            element_type: 'input';
            value:
              | { type: 'text' | 'email'; value: string }
              | { type: 'number'; value: number };
          }
        | {
            element_id: string;
            element_type: 'date_picker';
            value: {
              day?: number;
              month?: number;
              year?: number;
            };
          };
    };
  };
  defs: {
    AdaptyError: {
      adapty_code: number;
      message: string;
      detail?: string;
    };

    'AdaptyLog.Level': 'error' | 'warn' | 'info' | 'verbose' | 'debug';

    AdaptyLocale: string;

    Date: string;

    AdaptyConfiguration: {
      api_key: string;
      customer_user_id?: string;
      observer_mode?: boolean;
      apple_idfa_collection_disabled?: boolean;
      google_adid_collection_disabled?: boolean;
      ip_address_collection_disabled?: boolean;
      server_cluster?: 'default' | 'eu' | 'cn';
      backend_base_url?: string;
      backend_fallback_base_url?: string;
      backend_configs_base_url?: string;
      backend_proxy_host?: string;
      backend_proxy_port?: number;
      log_level?: components['defs']['AdaptyLog.Level'];
      cross_platform_sdk_name?: string;
      cross_platform_sdk_version?: string;
      activate_ui?: boolean;
      media_cache?: {
        memory_storage_total_cost_limit?: number;
        memory_storage_count_limit?: number;
        disk_storage_size_limit?: number;
      };
    };

    'AdaptyPaywallProduct.Request': {
      vendor_product_id: string;
      adapty_product_id: string;
      paywall_product_index: number;
      subscription_offer_identifier?: components['defs']['AdaptySubscriptionOffer.Identifier'];
      paywall_variation_id: string;
      paywall_ab_test_name: string;
      paywall_name: string;
      web_purchase_url?: string;
      payload_data?: string;
    };

    'AdaptyPaywallProduct.Response': {
      vendor_product_id: string;
      adapty_product_id: string;
      paywall_product_index: number;
      paywall_variation_id: string;
      paywall_ab_test_name: string;
      paywall_name: string;
      web_purchase_url?: string;
      localized_description: string;
      localized_title: string;
      is_family_shareable?: boolean;
      region_code?: string;
      price: components['defs']['AdaptyPrice'];
      subscription?: components['defs']['AdaptyPaywallProduct.Subscription'];
      payload_data?: string;
    };

    AdaptyPrice: {
      amount: number;
      currency_code?: string;
      currency_symbol?: string;
      localized_string?: string;
    };

    'AdaptyPaywallProduct.Subscription': {
      group_identifier?: string;
      period: components['defs']['AdaptySubscriptionPeriod'];
      localized_period?: string;
      offer?: components['defs']['AdaptySubscriptionOffer'];
      renewal_type?: 'prepaid' | 'autorenewable';
      base_plan_id?: string;
    };

    AdaptySubscriptionOffer: {
      offer_identifier: components['defs']['AdaptySubscriptionOffer.Identifier'];
      phases: components['defs']['AdaptySubscriptionOffer.Phase'][];
      offer_tags?: string[];
    };

    'AdaptySubscriptionOffer.Phase': {
      price: components['defs']['AdaptyPrice'];
      subscription_period: components['defs']['AdaptySubscriptionPeriod'];
      number_of_periods: number;
      payment_mode: components['defs']['AdaptySubscriptionOffer.PaymentMode'];
      localized_subscription_period?: string;
      localized_number_of_periods?: string;
    };

    AdaptyOnboardingScreenParameters: {
      onboarding_screen_order: number;
      onboarding_name?: string;
      onboarding_screen_name?: string;
    };

    AdaptyPlacement: {
      developer_id: string;
      ab_test_name: string;
      audience_name: string;
      revision: number;
      is_tracking_purchases?: boolean;
      placement_audience_version_id: string;
    };

    AdaptyPaywall: {
      placement: components['defs']['AdaptyPlacement'];
      paywall_id: string;
      paywall_name: string;
      variation_id: string;
      products: components['defs']['AdaptyPaywall.ProductReference'][];
      response_created_at: number;
      remote_config?: components['defs']['AdaptyRemoteConfig'];
      paywall_builder?: components['defs']['AdaptyPaywall.ViewConfiguration'];
      web_purchase_url?: string;
      payload_data?: string;
    };

    AdaptyOnboarding: {
      placement: components['defs']['AdaptyPlacement'];
      onboarding_id: string;
      onboarding_name: string;
      variation_id: string;
      response_created_at: number;
      remote_config?: components['defs']['AdaptyRemoteConfig'];
      onboarding_builder?: {
        config_url: string;
        lang: components['defs']['AdaptyLocale'];
      };
      payload_data?: string;
    };

    AdaptyPlacementFetchPolicy: OneOf<
      [
        {
          type:
            | 'reload_revalidating_cache_data'
            | 'return_cache_data_else_load';
        },
        {
          type: 'return_cache_data_if_not_expired_else_load';
          max_age: number;
        },
      ]
    >;

    AdaptyRemoteConfig: {
      lang: components['defs']['AdaptyLocale'];
      data: string;
    };

    'AdaptyPaywall.ProductReference': {
      vendor_product_id: string;
      adapty_product_id: string;
      promotional_offer_id?: string;
      win_back_offer_id?: string;
      base_plan_id?: string;
      offer_id?: string;
    };

    'AdaptyPaywall.ViewConfiguration': {
      paywall_builder_id: string;
      lang: components['defs']['AdaptyLocale'];
    };

    AdaptySubscriptionPeriod: {
      unit: components['defs']['AdaptySubscriptionPeriod.Unit'];
      number_of_units: number;
    };

    'AdaptySubscriptionPeriod.Unit':
      | 'day'
      | 'week'
      | 'month'
      | 'year'
      | 'unknown';

    AdaptyProfile: {
      profile_id: string;
      customer_user_id?: string;
      segment_hash: string;
      is_test_user: boolean;
      timestamp: number;
      custom_attributes?: components['defs']['AdaptyProfile.CustomAttributes'];
      paid_access_levels?: {
        [key: string]: components['defs']['AdaptyProfile.AccessLevel'];
      };
      subscriptions?: {
        [key: string]: components['defs']['AdaptyProfile.Subscription'];
      };
      non_subscriptions?: {
        [key: string]: components['defs']['AdaptyProfile.NonSubscription'][];
      };
    };

    'AdaptyProfile.AccessLevel': {
      id: string;
      is_active: boolean;
      vendor_product_id: string;
      store: string;
      activated_at: components['defs']['Date'];
      renewed_at?: components['defs']['Date'];
      expires_at?: components['defs']['Date'];
      is_lifetime: boolean;
      active_introductory_offer_type?: string;
      active_promotional_offer_type?: string;
      active_promotional_offer_id?: string;
      offer_id?: string;
      will_renew: boolean;
      is_in_grace_period: boolean;
      unsubscribed_at?: components['defs']['Date'];
      billing_issue_detected_at?: components['defs']['Date'];
      starts_at?: components['defs']['Date'];
      cancellation_reason?: string;
      is_refund: boolean;
    };

    'AdaptyProfile.NonSubscription': {
      purchase_id: string;
      store: string;
      vendor_product_id: string;
      vendor_transaction_id?: string;
      purchased_at: components['defs']['Date'];
      is_sandbox: boolean;
      is_refund: boolean;
      is_consumable: boolean;
    };

    'AdaptyProfile.Subscription': {
      store: string;
      vendor_product_id: string;
      vendor_transaction_id: string;
      vendor_original_transaction_id: string;
      is_active: boolean;
      is_lifetime: boolean;
      activated_at: components['defs']['Date'];
      renewed_at?: components['defs']['Date'];
      expires_at?: components['defs']['Date'];
      starts_at?: components['defs']['Date'];
      unsubscribed_at?: components['defs']['Date'];
      billing_issue_detected_at?: components['defs']['Date'];
      is_in_grace_period: boolean;
      is_refund: boolean;
      is_sandbox: boolean;
      will_renew: boolean;
      active_introductory_offer_type?: string;
      active_promotional_offer_type?: string;
      active_promotional_offer_id?: string;
      offer_id?: string;
      cancellation_reason?: string;
    };

    'AdaptyProfile.CustomAttributes': {
      [key: string]: string | number;
    };

    'AdaptyProfile.Gender': 'f' | 'm' | 'o';

    AdaptyProfileParameters: {
      first_name?: string;
      last_name?: string;
      gender?: components['defs']['AdaptyProfile.Gender'];
      birthday?: string;
      email?: string;
      phone_number?: string;
      att_status?: number;
      custom_attributes?: components['defs']['AdaptyProfile.CustomAttributes'];
      analytics_disabled?: boolean;
    };

    'AdaptySubscriptionOffer.Identifier': OneOf<
      [
        {
          type: 'introductory';
          id?: string;
        },
        {
          type: 'promotional' | 'win_back';
          id: string;
        },
      ]
    >;

    'AdaptySubscriptionOffer.PaymentMode':
      | 'pay_as_you_go'
      | 'pay_up_front'
      | 'free_trial'
      | 'unknown';

    AdaptyPurchaseResult: OneOf<
      [
        {
          type: 'pending' | 'user_cancelled';
        },
        {
          type: 'success';
          profile: components['defs']['AdaptyProfile'];
        },
      ]
    >;

    'AdaptyUI.CustomAssets': (
      | components['assets']['Color']
      | components['assets']['ColorGradient']
      | components['assets']['Image']
      | components['assets']['Video']
    )[];

    'AdaptyUI.PaywallView': {
      id: string;
      placement_id: string;
      variation_id: string;
    };

    'AdaptyUI.OnboardingView': {
      id: string;
      placement_id: string;
      variation_id: string;
    };

    'AdaptyUI.OnboardingMeta': {
      onboarding_id: string;
      screen_cid: string;
      screen_index: number;
      total_screens: number;
    };

    'AdaptyUI.OnboardingsStateParams': {
      id: string;
      value: string;
      label: string;
    };

    'AdaptyUI.UserAction': OneOf<
      [
        {
          type: 'close' | 'system_back';
        },
        {
          type: 'open_url' | 'custom';
          value: string;
        },
      ]
    >;

    'AdaptyUI.CustomTagsValues': {
      [key: string]: string;
    };

    'AdaptyUI.CustomTimersValues': {
      [key: string]: components['defs']['Date'];
    };

    'AdaptyUI.AndroidPersonalizedOffers': {
      [key: string]: boolean;
    };

    'AdaptyUI.DialogConfiguration': {
      default_action_title: string;
      secondary_action_title?: string;
      title?: string;
      content?: string;
    };

    'AdaptyUI.DialogActionType': 'primary' | 'secondary';

    AdaptySubscriptionUpdateParameters: {
      old_sub_vendor_product_id: string;
      replacement_mode:
        | 'charge_full_price'
        | 'deferred'
        | 'without_proration'
        | 'charge_prorated_price'
        | 'with_time_proration';
    };

    AdaptyRefundPreference: 'no_preference' | 'grant' | 'decline';
  };
  assets: {
    Color: {
      id: string;
      type: 'color';
      value: string; // Hex string: ^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$
    };

    ColorGradient: {
      id: string;
      type: 'linear-gradient';
      values: {
        color: string;
        p: number;
      }[];
      points: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
      };
    };

    Image: OneOf<
      [
        {
          id: string;
          type: 'image';
          value: string; // base64
        },
        {
          id: string;
          type: 'image';
          asset_id: string;
        },
        {
          id: string;
          type: 'image';
          path: string;
        },
      ]
    >;

    Video: OneOf<
      [
        {
          id: string;
          type: 'video';
          asset_id: string;
        },
        {
          id: string;
          type: 'video';
          path: string;
        },
      ]
    >;
  };
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;
