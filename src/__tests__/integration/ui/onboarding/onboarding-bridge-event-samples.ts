/**
 * Bridge event samples in native format (snake_case)
 *
 * Synthetic examples created based on cross_platform.yaml schema for types not present in logs.
 *
 * Use these samples for integration tests to verify event handling.
 */

/**
 * Sample for OnboardingViewEvent.OnAnalyticsEvent with event.name = 'onboarding_started'
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnAnalyticsEvent
 */
export const ONBOARDING_ANALYTICS_ONBOARDING_STARTED = {
  id: 'onboarding_on_analytics_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnAnalyticsEvent with event.name = 'screen_presented'
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnAnalyticsEvent
 */
export const ONBOARDING_ANALYTICS_SCREEN_PRESENTED = {
  id: 'onboarding_on_analytics_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnAnalyticsEvent with element_id
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnAnalyticsEvent
 */
export const ONBOARDING_ANALYTICS_WITH_ELEMENT_ID = {
  id: 'onboarding_on_analytics_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_placement',
  },
  meta: {
    onboarding_id: '5e8e68b1-2696-4a5d-8069-4a5f9f4ac022',
    screen_cid: 'bGn6r0Fo',
    screen_index: 0,
    total_screens: 18,
  },
  event: {
    name: 'button_clicked',
    element_id: 'continue_button',
  },
} as const;

/**
 * Sample for OnboardingViewEvent.OnAnalyticsEvent with event.name = 'second_screen_presented'
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnAnalyticsEvent
 */
export const ONBOARDING_ANALYTICS_SECOND_SCREEN_PRESENTED = {
  id: 'onboarding_on_analytics_action',
  view: {
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnAnalyticsEvent with event.name = 'navigation_failed'
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnAnalyticsEvent
 */
export const ONBOARDING_ANALYTICS_NAVIGATION_FAILED = {
  id: 'onboarding_on_analytics_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnStateUpdatedAction with element_type = 'input' and value.type = 'text'
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnStateUpdatedAction
 */
export const ONBOARDING_STATE_UPDATED_TEXT_INPUT = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnStateUpdatedAction with element_type = 'input' and value.type = 'email'
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnStateUpdatedAction
 */
export const ONBOARDING_STATE_UPDATED_EMAIL_INPUT = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnStateUpdatedAction with element_type = 'input' and value.type = 'number'
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnStateUpdatedAction
 */
export const ONBOARDING_STATE_UPDATED_NUMBER_INPUT = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnStateUpdatedAction with element_type = 'select'
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnStateUpdatedAction
 */
export const ONBOARDING_STATE_UPDATED_SELECT_OPTION = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnStateUpdatedAction with element_type = 'multi_select' (single selection)
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnStateUpdatedAction
 */
export const ONBOARDING_STATE_UPDATED_MULTI_SELECT_SINGLE = {
  id: 'onboarding_on_state_updated_action',
  view: {
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnStateUpdatedAction with element_type = 'multi_select' (multiple selections)
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnStateUpdatedAction
 */
export const ONBOARDING_STATE_UPDATED_MULTI_SELECT_MULTIPLE = {
  id: 'onboarding_on_state_updated_action',
  view: {
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnStateUpdatedAction with element_type = 'multi_select' (empty selection)
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnStateUpdatedAction
 */
export const ONBOARDING_STATE_UPDATED_MULTI_SELECT_EMPTY = {
  id: 'onboarding_on_state_updated_action',
  view: {
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnStateUpdatedAction with element_type = 'date_picker' (full date)
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnStateUpdatedAction
 */
export const ONBOARDING_STATE_UPDATED_DATE_PICKER_FULL = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnStateUpdatedAction with element_type = 'date_picker' (partial date - year only)
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnStateUpdatedAction
 */
export const ONBOARDING_STATE_UPDATED_DATE_PICKER_PARTIAL = {
  id: 'onboarding_on_state_updated_action',
  view: {
    id: 'C2ECBFB4-5ADA-4E42-B129-49A7977175F3',
    variation_id: 'd7e60b9e-453a-42a1-8e80-145b3740cbbb',
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.DidFinishLoading
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.DidFinishLoading
 */
export const ONBOARDING_DID_FINISH_LOADING = {
  id: 'onboarding_did_finish_loading',
  view: {
    placement_id: 'test_placement',
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

/**
 * Sample for OnboardingViewEvent.OnPaywallAction
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnPaywallAction
 */
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

/**
 * Sample for OnboardingViewEvent.OnCloseAction
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnCloseAction
 */
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

/**
 * Sample for OnboardingViewEvent.OnCustomAction
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.OnCustomAction
 */
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

/**
 * Sample for OnboardingViewEvent.DidFailWithError
 * @see cross_platform.yaml#/$events/OnboardingViewEvent.DidFailWithError
 */
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
