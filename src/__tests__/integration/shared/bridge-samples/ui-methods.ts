/**
 * Bridge samples for Adapty UI methods
 *
 * Covers FlowViewController and OnboardingViewController methods for bridge communication testing.
 * Event samples are separate in events.ts
 */

import type { components } from '@/types/api';

// Flow UI Methods

/**
 * AdaptyUICreateFlowView.Request with default parameters
 */
export const ADAPTY_UI_CREATE_FLOW_VIEW_REQUEST: components['requests']['AdaptyUICreateFlowView.Request'] =
  {
    method: 'adapty_ui_create_flow_view',
    flow: {
      placement: {
        developer_id: 'test_placement',
        ab_test_name: 'test_ab',
        audience_name: 'all_users',
        revision: 1,
        placement_audience_version_id: 'v1',
      },
      flow_id: 'flow_test_placement',
      flow_name: 'test_placement',
      variation_id: 'variation_123',
      variations: [
        {
          placement: {
            developer_id: 'test_placement',
            ab_test_name: 'test_ab',
            audience_name: 'all_users',
            revision: 1,
            placement_audience_version_id: 'v1',
          },
          paywall_id: 'paywall_test_placement',
          paywall_name: 'test_placement',
          variation_id: 'variation_123',
          products: [],
        },
      ],
      response_created_at: -1,
    },
    preload_products: true,
    load_timeout: 5,
  };

/**
 * AdaptyUICreateFlowView.Response
 */
export const ADAPTY_UI_CREATE_FLOW_VIEW_RESPONSE: components['requests']['AdaptyUICreateFlowView.Response'] =
  {
    success: {
      id: 'mock_flow_view_123',
      placement_id: 'test_placement',
      variation_id: 'variation_123',
    },
  };

/**
 * AdaptyUIPresentFlowView.Request with full_screen style
 */
export const ADAPTY_UI_PRESENT_FLOW_VIEW_REQUEST_FULL_SCREEN: components['requests']['AdaptyUIPresentFlowView.Request'] =
  {
    method: 'adapty_ui_present_flow_view',
    id: 'mock_flow_view_123',
    ios_presentation_style: 'full_screen',
  };

/**
 * AdaptyUIPresentFlowView.Request with page_sheet style
 */
export const ADAPTY_UI_PRESENT_FLOW_VIEW_REQUEST_PAGE_SHEET: components['requests']['AdaptyUIPresentFlowView.Request'] =
  {
    method: 'adapty_ui_present_flow_view',
    id: 'mock_flow_view_123',
    ios_presentation_style: 'page_sheet',
  };

/**
 * AdaptyUIPresentFlowView.Response
 */
export const ADAPTY_UI_PRESENT_FLOW_VIEW_RESPONSE: components['requests']['AdaptyUIPresentFlowView.Response'] =
  {
    success: true,
  };

/**
 * AdaptyUIDismissFlowView.Request
 */
export const ADAPTY_UI_DISMISS_FLOW_VIEW_REQUEST: components['requests']['AdaptyUIDismissFlowView.Request'] =
  {
    method: 'adapty_ui_dismiss_flow_view',
    id: 'mock_flow_view_123',
    destroy: false,
  };

/**
 * AdaptyUIDismissFlowView.Response
 */
export const ADAPTY_UI_DISMISS_FLOW_VIEW_RESPONSE: components['requests']['AdaptyUIDismissFlowView.Response'] =
  {
    success: true,
  };

/**
 * AdaptyUIShowDialog.Request
 */
export const ADAPTY_UI_SHOW_DIALOG_REQUEST: components['requests']['AdaptyUIShowDialog.Request'] =
  {
    method: 'adapty_ui_show_dialog',
    id: 'mock_flow_view_123',
    configuration: {
      title: 'Confirm Action',
      content: 'Are you sure?',
      default_action_title: 'Yes',
      secondary_action_title: 'No',
    },
  };

/**
 * AdaptyUIShowDialog.Response - primary action
 */
export const ADAPTY_UI_SHOW_DIALOG_RESPONSE_PRIMARY: components['requests']['AdaptyUIShowDialog.Response'] =
  {
    success: 'primary',
  };

/**
 * AdaptyUIShowDialog.Response - secondary action
 */
export const ADAPTY_UI_SHOW_DIALOG_RESPONSE_SECONDARY: components['requests']['AdaptyUIShowDialog.Response'] =
  {
    success: 'secondary',
  };

// Onboarding UI Methods

/**
 * AdaptyUICreateOnboardingView.Request
 */
export const ADAPTY_UI_CREATE_ONBOARDING_VIEW_REQUEST: components['requests']['AdaptyUICreateOnboardingView.Request'] =
  {
    method: 'adapty_ui_create_onboarding_view',
    onboarding: {
      placement: {
        developer_id: 'test_onboarding_placement',
        ab_test_name: 'onboarding_test',
        audience_name: 'all_users',
        revision: 1,
        placement_audience_version_id: 'v1',
      },
      onboarding_id: 'onboarding_123',
      onboarding_name: 'test_onboarding',
      variation_id: 'onboarding_variation_456',
      response_created_at: -1,
      request_locale: 'en',
      onboarding_builder: {
        config_url: 'https://example.com/onboarding-config',
      },
    },
    external_urls_presentation: 'browser_in_app',
  };

/**
 * AdaptyUICreateOnboardingView.Response
 */
export const ADAPTY_UI_CREATE_ONBOARDING_VIEW_RESPONSE: components['requests']['AdaptyUICreateOnboardingView.Response'] =
  {
    success: {
      id: 'mock_onboarding_view_789',
      placement_id: 'test_onboarding_placement',
      variation_id: 'onboarding_variation_456',
    },
  };

/**
 * AdaptyUIPresentOnboardingView.Request
 */
export const ADAPTY_UI_PRESENT_ONBOARDING_VIEW_REQUEST: components['requests']['AdaptyUIPresentOnboardingView.Request'] =
  {
    method: 'adapty_ui_present_onboarding_view',
    id: 'mock_onboarding_view_789',
    ios_presentation_style: 'page_sheet',
  };

/**
 * AdaptyUIPresentOnboardingView.Response
 */
export const ADAPTY_UI_PRESENT_ONBOARDING_VIEW_RESPONSE: components['requests']['AdaptyUIPresentOnboardingView.Response'] =
  {
    success: true,
  };

/**
 * AdaptyUIDismissOnboardingView.Request
 */
export const ADAPTY_UI_DISMISS_ONBOARDING_VIEW_REQUEST: components['requests']['AdaptyUIDismissOnboardingView.Request'] =
  {
    method: 'adapty_ui_dismiss_onboarding_view',
    id: 'mock_onboarding_view_789',
    destroy: false,
  };

/**
 * AdaptyUIDismissOnboardingView.Response
 */
export const ADAPTY_UI_DISMISS_ONBOARDING_VIEW_RESPONSE: components['requests']['AdaptyUIDismissOnboardingView.Response'] =
  {
    success: true,
  };
