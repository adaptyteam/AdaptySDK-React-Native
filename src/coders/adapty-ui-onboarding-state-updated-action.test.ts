import { AdaptyUiOnboardingStateUpdatedActionCoder } from './adapty-ui-onboarding-state-updated-action';
import type { OnboardingStateUpdatedAction } from '@/ui/types';
import type { Event } from '@/types/schema';

type Serializable = Event['OnboardingViewEvent.OnStateUpdatedAction']['action'];

const selectMock: Serializable = {
  element_id: 'select-1',
  element_type: 'select',
  value: {
    id: 'option_1',
    value: 'option_value_1',
    label: 'Option 1',
  },
};

const multiSelectMock: Serializable = {
  element_id: 'multi-select-1',
  element_type: 'multi_select',
  value: [
    {
      id: 'option_1',
      value: 'option_value_1',
      label: 'Option 1',
    },
    {
      id: 'option_2',
      value: 'option_value_2',
      label: 'Option 2',
    },
  ],
};

const inputMock: Serializable = {
  element_id: 'input-1',
  element_type: 'input',
  value: { type: 'text', value: 'user input text' },
};

const datePickerMock: Serializable = {
  element_id: 'date-picker-1',
  element_type: 'date_picker',
  value: { day: 25, month: 12, year: 2023 },
};

const mocks = [selectMock, multiSelectMock, inputMock, datePickerMock];

const expectedSelect: OnboardingStateUpdatedAction = {
  elementId: 'select-1',
  elementType: 'select',
  value: {
    id: 'option_1',
    value: 'option_value_1',
    label: 'Option 1',
  },
};

const expectedMultiSelect: OnboardingStateUpdatedAction = {
  elementId: 'multi-select-1',
  elementType: 'multi_select',
  value: [
    {
      id: 'option_1',
      value: 'option_value_1',
      label: 'Option 1',
    },
    {
      id: 'option_2',
      value: 'option_value_2',
      label: 'Option 2',
    },
  ],
};

const expectedInput: OnboardingStateUpdatedAction = {
  elementId: 'input-1',
  elementType: 'input',
  value: { type: 'text', value: 'user input text' },
};

const expectedDatePicker: OnboardingStateUpdatedAction = {
  elementId: 'date-picker-1',
  elementType: 'date_picker',
  value: { day: 25, month: 12, year: 2023 },
};

const expectedResults = [
  expectedSelect,
  expectedMultiSelect,
  expectedInput,
  expectedDatePicker,
];

describe('AdaptyUiOnboardingStateUpdatedActionCoder', () => {
  let coder: AdaptyUiOnboardingStateUpdatedActionCoder;

  beforeEach(() => {
    coder = new AdaptyUiOnboardingStateUpdatedActionCoder();
  });

  it.each(mocks.map((mock, idx) => ({ mock, expected: expectedResults[idx] })))(
    'should decode $mock.element_type to expected result',
    ({ mock, expected }) => {
      const decoded = coder.decode(mock);
      expect(decoded).toStrictEqual(expected);
    },
  );

  it.each(mocks)('should decode/encode', mock => {
    const decoded = coder.decode(mock);

    expect(decoded.elementId).toBe(mock.element_id);
    expect(decoded.elementType).toBe(mock.element_type);

    if (mock.element_type === 'select') {
      expect(decoded.value).toEqual({
        id: (mock.value as any).id,
        value: (mock.value as any).value,
        label: (mock.value as any).label,
      });
    } else if (mock.element_type === 'multi_select') {
      expect(Array.isArray(decoded.value)).toBe(true);
      expect(decoded.value).toHaveLength((mock.value as any[]).length);
    } else {
      expect(decoded.value).toEqual(mock.value);
    }
  });
});
