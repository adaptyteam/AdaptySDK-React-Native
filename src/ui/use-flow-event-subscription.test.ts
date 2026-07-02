import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

// Mock the subscription factory so we can assert on call count + captured args
// without touching the native bridge.
jest.mock('./create-flow-event-handlers', () => ({
  createFlowEventHandlers: jest.fn(() => jest.fn()),
}));

import { useFlowEventSubscription } from './use-flow-event-subscription';
import { createFlowEventHandlers } from './create-flow-event-handlers';
import type { FlowEventHandlers } from './types';

const mockCreate = createFlowEventHandlers as jest.MockedFunction<
  typeof createFlowEventHandlers
>;

// Host-less harness: returns null, so no native component is needed.
function Harness(props: {
  handlers: Partial<FlowEventHandlers>;
  viewId: string;
}): null {
  useFlowEventSubscription(props.handlers, props.viewId);
  return null;
}

const el = (handlers: Partial<FlowEventHandlers>, viewId: string) =>
  React.createElement(Harness, { handlers, viewId });

describe('useFlowEventSubscription', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('subscribes once across re-renders with new handler identities', () => {
    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(el({ onAppeared: () => false }, 'v1'));
    });
    expect(mockCreate).toHaveBeenCalledTimes(1);

    // New inline identity for onAppeared on every update.
    act(() => {
      renderer.update(el({ onAppeared: () => false }, 'v1'));
    });
    act(() => {
      renderer.update(el({ onAppeared: () => false }, 'v1'));
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('passes a full set of handler wrappers (one per default handler)', () => {
    act(() => {
      TestRenderer.create(el({}, 'v1'));
    });
    const passed = mockCreate.mock.calls[0]![0];
    expect(Object.keys(passed)).toHaveLength(21);
    expect(typeof passed.onCloseButtonPress).toBe('function');
  });

  it('invokes the latest handler identity via the ref', () => {
    const first = jest.fn(() => false);
    const second = jest.fn(() => false);

    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(el({ onAppeared: first }, 'v1'));
    });
    const passed = mockCreate.mock.calls[0]![0]; // wrapper captured at mount

    act(() => {
      renderer.update(el({ onAppeared: second }, 'v1'));
    });

    (passed.onAppeared as () => boolean)();
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });

  it('forwards call arguments to the live handler', () => {
    const handler = jest.fn(() => false);
    act(() => {
      TestRenderer.create(el({ onPurchaseCompleted: handler }, 'v1'));
    });
    const passed = mockCreate.mock.calls[0]![0];

    (passed.onPurchaseCompleted as (arg: { type: string }) => boolean)({
      type: 'user_cancelled',
    });
    expect(handler).toHaveBeenCalledWith({ type: 'user_cancelled' });
  });

  it('falls back to the DEFAULT handler when a prop is omitted', () => {
    act(() => {
      TestRenderer.create(el({}, 'v1'));
    });
    const passed = mockCreate.mock.calls[0]![0];
    // DEFAULT onCloseButtonPress returns true.
    expect((passed.onCloseButtonPress as () => boolean)()).toBe(true);
  });

  it('preserves the async onRequestPermission return value', async () => {
    const handler = jest.fn(async () => ({
      status: 'unavailable' as const,
      detail: 'from-test',
    }));
    act(() => {
      TestRenderer.create(el({ onRequestPermission: handler }, 'v1'));
    });
    const passed = mockCreate.mock.calls[0]![0];

    await expect(
      (
        passed.onRequestPermission as () => Promise<{
          status: string;
          detail?: string;
        }>
      )(),
    ).resolves.toEqual({ status: 'unavailable', detail: 'from-test' });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('re-subscribes when viewId changes', () => {
    const unsubscribe = jest.fn();
    mockCreate.mockReturnValue(unsubscribe);

    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(el({}, 'v1'));
    });
    act(() => {
      renderer.update(el({}, 'v2'));
    });

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate.mock.calls[1]![1]).toBe('v2');
  });
});
