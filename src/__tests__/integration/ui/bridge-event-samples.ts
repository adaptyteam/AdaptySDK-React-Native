/**
 * Bridge event samples in native format (snake_case)
 * 
 * These samples represent events as they come from the native module.
 * Synthetic examples created based on cross_platform.yaml schema for types not present in logs.
 * 
 * Use these samples for integration tests to verify event handling.
 */

export const ONBOARDING_ANALYTICS_ONBOARDING_STARTED = {
  id: 'onboarding_on_analytics_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'bGn6r0Fo',
    screen_index: 0,
    total_screens: 18,
  },
  event: {
    name: 'onboarding_started',
  },
} as const;

export const ONBOARDING_ANALYTICS_SCREEN_PRESENTED = {
  id: 'onboarding_on_analytics_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'bGn6r0Fo',
    screen_index: 0,
    total_screens: 18,
  },
  event: {
    name: 'screen_presented',
  },
} as const;

export const ONBOARDING_ANALYTICS_SECOND_SCREEN_PRESENTED = {
  id: 'onboarding_on_analytics_action',
  view: {
    placement_id: 'test_stas0',
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'ryPxczcL',
    screen_index: 1,
    total_screens: 18,
  },
  event: {
    name: 'second_screen_presented',
  },
} as const;

export const ONBOARDING_ANALYTICS_NAVIGATION_FAILED = {
  id: 'onboarding_on_analytics_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    placement_id: 'test_stas0',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'X19x4kXO',
    screen_index: 17,
    total_screens: 18,
  },
  event: {
    name: 'navigation_failed',
  },
} as const;

export const ONBOARDING_STATE_UPDATED_TEXT_INPUT = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'any',
    screen_index: 11,
    total_screens: 18,
  },
  action: {
    element_id: 'name',
    element_type: 'input',
    value: {
      type: 'text',
      value: 'Test-nick',
    },
  },
} as const;

export const ONBOARDING_STATE_UPDATED_EMAIL_INPUT = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'any',
    screen_index: 12,
    total_screens: 18,
  },
  action: {
    element_id: 'email',
    element_type: 'input',
    value: {
      type: 'email',
      value: 'test@example.com',
    },
  },
} as const;

export const ONBOARDING_STATE_UPDATED_NUMBER_INPUT = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'any',
    screen_index: 13,
    total_screens: 18,
  },
  action: {
    element_id: 'age',
    element_type: 'input',
    value: {
      type: 'number',
      value: 25,
    },
  },
} as const;

export const ONBOARDING_STATE_UPDATED_SELECT_OPTION = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'any',
    screen_index: 4,
    total_screens: 18,
  },
  action: {
    element_id: 'experience_level',
    element_type: 'select',
    value: {
      id: 'intermediate',
      value: 'intermediate',
      label: 'Intermediate',
    },
  },
} as const;

export const ONBOARDING_STATE_UPDATED_MULTI_SELECT_SINGLE = {
  id: 'onboarding_on_state_updated_action',
  view: {
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'S1Z2BFFy',
    screen_index: 5,
    total_screens: 18,
  },
  action: {
    value: [
      {
        id: 'QmdFI',
        value: 'skill-acquisition',
        label: 'Skill Acquisition',
      },
    ],
    element_id: 'goal',
    element_type: 'multi_select',
  },
} as const;

export const ONBOARDING_STATE_UPDATED_MULTI_SELECT_MULTIPLE = {
  id: 'onboarding_on_state_updated_action',
  view: {
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'S1Z2BFFy',
    screen_index: 5,
    total_screens: 18,
  },
  action: {
    value: [
      {
        id: 'QmdFI',
        value: 'skill-acquisition',
        label: 'Skill Acquisition',
      },
      {
        id: 'abc123',
        value: 'productivity',
        label: 'Productivity',
      },
    ],
    element_id: 'goal',
    element_type: 'multi_select',
  },
} as const;

export const ONBOARDING_STATE_UPDATED_MULTI_SELECT_EMPTY = {
  id: 'onboarding_on_state_updated_action',
  view: {
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'S1Z2BFFy',
    screen_index: 5,
    total_screens: 18,
  },
  action: {
    value: [],
    element_id: 'goal',
    element_type: 'multi_select',
  },
} as const;

export const ONBOARDING_STATE_UPDATED_DATE_PICKER_FULL = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'any',
    screen_index: 14,
    total_screens: 18,
  },
  action: {
    element_id: 'birth_date',
    element_type: 'date_picker',
    value: {
      day: 15,
      month: 6,
      year: 1990,
    },
  },
} as const;

export const ONBOARDING_STATE_UPDATED_DATE_PICKER_PARTIAL = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_stas0',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'any',
    screen_index: 14,
    total_screens: 18,
  },
  action: {
    element_id: 'birth_year',
    element_type: 'date_picker',
    value: {
      year: 1995,
    },
  },
} as const;

export const ONBOARDING_DID_FINISH_LOADING = {
  id: 'onboarding_did_finish_loading',
  view: {
    placement_id: 'test_stas0',
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
  },
  meta: {
    screen_cid: 'bGn6r0Fo',
    screen_index: 0,
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    total_screens: 18,
  },
} as const;

export const ONBOARDING_PAYWALL_ACTION = {
  id: 'onboarding_on_paywall_action',
  view: {
    id: '00176648-6F60-44E8-999B-6547130D8AED',
    variation_id: '2c1390e1-e195-4f59-8fa0-5830e5d6f10b',
    placement_id: 'test_anna0',
  },
  meta: {
    onboarding_id: 'b0974453-633a-419a-870f-4f1f4bb97db1',
    screen_cid: '9p61aqIB',
    screen_index: 2,
    total_screens: 3,
  },
  action_id: 'test_anna2',
} as const;

export const ONBOARDING_CLOSE_ACTION = {
  id: 'onboarding_on_close_action',
  view: {
    variation_id: '2c1390e1-e195-4f59-8fa0-5830e5d6f10b',
    placement_id: 'test_anna0',
    id: '5F64F31E-9BC7-4733-8BDE-A546088BDE4E',
  },
  meta: {
    onboarding_id: 'b0974453-633a-419a-870f-4f1f4bb97db1',
    screen_cid: '9p61aqIB',
    screen_index: 2,
    total_screens: 3,
  },
  action_id: '',
} as const;

export const ONBOARDING_CUSTOM_ACTION = {
  id: 'onboarding_on_custom_action',
  view: {
    placement_id: 'test_anna0',
    variation_id: '2c1390e1-e195-4f59-8fa0-5830e5d6f10b',
    id: '5F64F31E-9BC7-4733-8BDE-A546088BDE4E',
  },
  meta: {
    onboarding_id: 'b0974453-633a-419a-870f-4f1f4bb97db1',
    screen_cid: '9p61aqIB',
    screen_index: 2,
    total_screens: 3,
  },
  action_id: 'id123',
} as const;

export const ONBOARDING_ERROR_EVENT = {
  id: 'onboarding_did_fail_with_error',
  view: {
    variation_id: '2c1390e1-e195-4f59-8fa0-5830e5d6f10b',
    placement_id: 'test_anna0',
    id: '4C98DF36-8A6F-4CA4-8545-065DD2C369AE',
  },
  error: {
    adaptyCode: 4200,
    message:
      'AdaptyUIError.webKit (Code: 4200): Internal WebKit error occurred - Error Domain=NSURLErrorDomain Code=-1005 "The network connection was lost."',
    detail:
      'An internal WebKit error occurred: Error Domain=NSURLErrorDomain Code=-1005 "The network connection was lost."',
  },
} as const;

export const PROFILE_DID_LOAD_LATEST_PROFILE = {
  id: 'did_load_latest_profile',
  profile: {
    profile_id: '8b79ec26-3f3d-482c-99e8-ec745710ef59',
    customer_user_id: null,
    segment_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    paid_access_levels: {},
    subscriptions: {},
    non_subscriptions: {},
  },
} as const;

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
 * All event types collected from logs
 */
export const EVENT_TYPES = {
  ONBOARDING_ANALYTICS: 'onboarding_on_analytics_action',
  ONBOARDING_STATE_UPDATED: 'onboarding_on_state_updated_action',
  ONBOARDING_FINISHED_LOADING: 'onboarding_did_finish_loading',
  ONBOARDING_PAYWALL_ACTION: 'onboarding_on_paywall_action',
  ONBOARDING_CLOSE_ACTION: 'onboarding_on_close_action',
  ONBOARDING_CUSTOM_ACTION: 'onboarding_on_custom_action',
  ONBOARDING_ERROR: 'onboarding_did_fail_with_error',
  PROFILE_LOADED: 'did_load_latest_profile',
  INSTALLATION_DETAILS: 'on_installation_details_success',
} as const;

/**
 * View metadata that appears in all onboarding events
 */
export const COMMON_VIEW_DATA = {
  id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
  placement_id: 'test_stas0',
  variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
} as const;

/**
 * Onboarding metadata
 */
export const COMMON_ONBOARDING_META = {
  onboardingId: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
  totalScreens: 18,
} as const;

