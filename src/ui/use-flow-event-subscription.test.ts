import React, { RefObject, useLayoutEffect } from 'react';
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

  it('forwards the appeared view (with locale) to the live handler', () => {
    const handler = jest.fn(() => false);
    act(() => {
      TestRenderer.create(el({ onAppeared: handler }, 'v1'));
    });
    const passed = mockCreate.mock.calls[0]![0];

    (passed.onAppeared as (view: { id: string; locale?: string }) => boolean)({
      id: 'view-1',
      locale: 'es',
    });

    expect(handler).toHaveBeenCalledWith({ id: 'view-1', locale: 'es' });
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
      status: 'denied' as const,
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
    ).resolves.toEqual({ status: 'denied', detail: 'from-test' });
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

  it('subscribes in the layout phase', () => {
    let callsInLayout: number | undefined;
    function LayoutProbe(): null {
      useFlowEventSubscription({}, 'v1');
      useLayoutEffect(() => {
        callsInLayout = mockCreate.mock.calls.length;
      }, []);
      return null;
    }

    act(() => {
      TestRenderer.create(React.createElement(LayoutProbe));
    });

    expect(callsInLayout).toBe(1);
  });

  it('exposes the committed view id and clears it on unmount', () => {
    const unsubscribe = jest.fn();
    mockCreate.mockReturnValue(unsubscribe);
    let idRef: RefObject<string | null> | undefined;
    function RefHarness(props: { viewId: string }): null {
      idRef = useFlowEventSubscription({}, props.viewId);
      return null;
    }

    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        React.createElement(RefHarness, { viewId: 'v1' }),
      );
    });
    expect(idRef?.current).toBe('v1');

    act(() => {
      renderer.update(React.createElement(RefHarness, { viewId: 'v2' }));
    });
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(idRef?.current).toBe('v2');

    const ref = idRef;
    act(() => {
      renderer.unmount();
    });
    expect(ref?.current).toBeNull();
  });

  it('keeps the id non-null for a sibling layout effect during a re-render', () => {
    const shared: { ref?: RefObject<string | null> } = {};
    const seen: (string | null | undefined)[] = [];
    function Sibling(_props: { tick: number }): null {
      useLayoutEffect(() => {
        seen.push(shared.ref?.current);
      });
      return null;
    }
    function RefHarness(props: { viewId: string }): null {
      shared.ref = useFlowEventSubscription({}, props.viewId);
      return null;
    }
    const tree = (tick: number) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Sibling, { tick }),
        React.createElement(RefHarness, { viewId: 'v1' }),
      );

    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(tree(0));
    });
    act(() => {
      renderer.update(tree(1));
    });

    expect(seen[seen.length - 1]).toBe('v1');
  });

  it('clears the id while hidden by <Activity> and restores the latest on show', () => {
    let idRef: RefObject<string | null> | undefined;
    function RefHarness(props: { viewId: string }): null {
      idRef = useFlowEventSubscription({}, props.viewId);
      return null;
    }
    const tree = (mode: 'visible' | 'hidden', viewId: string) =>
      React.createElement(React.Activity, {
        mode,
        children: React.createElement(RefHarness, { viewId }),
      });

    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(tree('visible', 'v1'));
    });
    expect(idRef?.current).toBe('v1');

    act(() => {
      renderer.update(tree('hidden', 'v1'));
    });
    expect(idRef?.current).toBeNull();

    act(() => {
      renderer.update(tree('hidden', 'v2'));
    });
    expect(idRef?.current).toBeNull();

    act(() => {
      renderer.update(tree('visible', 'v2'));
    });
    expect(idRef?.current).toBe('v2');
  });

  it('calls the latest committed handler', () => {
    const h1 = jest.fn();
    const h2 = jest.fn();

    let renderer!: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(el({ onError: h1 }, 'v1'));
    });
    act(() => {
      renderer.update(el({ onError: h2 }, 'v1'));
    });
    const passed = mockCreate.mock.calls[0]![0];

    (passed.onError as (error: unknown) => void)(new Error('boom'));
    expect(h2).toHaveBeenCalledTimes(1);
    expect(h1).not.toHaveBeenCalled();
  });
});
