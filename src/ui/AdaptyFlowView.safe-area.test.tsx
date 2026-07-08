import React from 'react';
import renderer, { act } from 'react-test-renderer';

// Capture the params handed to the create-flow-view coder. `mock`-prefixed so
// the jest.mock factory below may reference it before initialization.
const mockEncodeParams = jest.fn().mockReturnValue({});

jest.mock('@/coders/factory', () => ({
  coderFactory: {
    createFlowCoder: () => ({ encode: () => ({ encoded: true }) }),
    createUiCreateFlowViewParamsCoder: () => ({ encode: mockEncodeParams }),
  },
}));

jest.mock('./use-flow-event-subscription', () => ({
  useFlowEventSubscription: jest.fn(),
}));

import { AdaptyFlowView } from './AdaptyFlowView';

describe('AdaptyFlowView safe-area paddings', () => {
  const flow = { id: 'flow-1' } as any;

  beforeEach(() => {
    mockEncodeParams.mockClear();
  });

  it('defaults android.enableSafeArea to false when the prop is unset', () => {
    act(() => {
      renderer.create(
        <AdaptyFlowView flow={flow} params={{ prefetchProducts: false }} />,
      );
    });

    expect(mockEncodeParams).toHaveBeenCalledWith(
      expect.objectContaining({ android: { enableSafeArea: false } }),
    );
  });

  it('respects a caller-supplied android.enableSafeArea override', () => {
    act(() => {
      renderer.create(
        <AdaptyFlowView
          flow={flow}
          params={{ android: { enableSafeArea: true } }}
        />,
      );
    });

    expect(mockEncodeParams).toHaveBeenCalledWith(
      expect.objectContaining({ android: { enableSafeArea: true } }),
    );
  });
});
