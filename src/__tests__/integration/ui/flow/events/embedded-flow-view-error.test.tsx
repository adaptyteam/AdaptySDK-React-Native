/**
 * Integration test for flow_view_did_receive_error of the embedded flow view.
 *
 * iOS reports a flow that can't be loaded into <AdaptyFlowView> (below iOS 16,
 * or a failed configuration) with the view id of the current configuration.
 * The event must reach only that view's onError.
 */

import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { resetBridge } from '@/bridge';
import { Adapty } from '@/adapty-handler';
import { AdaptyError } from '@/adapty-error';
import type { AdaptyFlow } from '@/types';
import type { NativeAdaptyFlowViewProps } from '@/ui/types';
import {
  createNativeModuleMock,
  emitNativeEvent,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../../../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_FLOW_RESPONSE,
} from '../../../shared/bridge-samples';
import { cleanupAdapty } from '../../../adapty-handler/setup.utils';

jest.mock('@/ui/native-components', () => ({
  AdaptyFlowViewHost: 'AdaptyFlowView',
}));

import { AdaptyFlowView } from '@/ui/AdaptyFlowView';

// AdaptyUIError.platformNotSupported as iOS 4.4.1 encodes it in events:
// message = debugDescription, detail = description
const PLATFORM_NOT_SUPPORTED = {
  adapty_code: 4001,
  message:
    'AdaptyUIError.platformNotSupported (Code: 4001): The current platform does not meet the minimum requirements for AdaptyUI SDK. This error typically occurs when trying to use AdaptyUI on an unsupported platform or OS version.',
  detail:
    'AdaptyUI SDK is not supported on this platform. Please check the platform compatibility requirements.',
};

const emitViewError = (viewId: string) =>
  emitNativeEvent({
    eventName: 'flow_view_did_receive_error',
    eventData: {
      id: 'flow_view_did_receive_error',
      view: { id: viewId, placement_id: 'p', variation_id: 'v' },
      error: PLATFORM_NOT_SUPPORTED,
    },
  });

describe('AdaptyFlowView - flow_view_did_receive_error', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;
  let flow: AdaptyFlow;
  let tree: ReactTestRenderer | undefined;

  const render = async (element: React.ReactElement) => {
    await act(async () => {
      if (tree) tree.update(element);
      else tree = renderer.create(element);
    });
  };

  const hostViewIds = () =>
    tree!.root
      .findAllByType('AdaptyFlowView' as never)
      .map(host => (host.props as NativeAdaptyFlowViewProps).viewId);

  beforeEach(async () => {
    tree = undefined;
    // Before the first $bridge access
    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      get_flow: GET_FLOW_RESPONSE,
    });
    adapty = new Adapty();
    await adapty.activate('test_api_key', { logLevel: 'error' });
    flow = await adapty.getFlow('test_placement');
  });

  afterEach(async () => {
    if (tree) await act(async () => tree!.unmount());
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  it('calls onError of the view the error is addressed to', async () => {
    const onErrorA = jest.fn().mockReturnValue(true);
    const onErrorB = jest.fn().mockReturnValue(true);

    await render(
      <>
        <AdaptyFlowView flow={flow} onError={onErrorA} />
        <AdaptyFlowView flow={flow} onError={onErrorB} />
      </>,
    );

    const [viewIdA, viewIdB] = hostViewIds();
    expect(viewIdA).toBeDefined();
    expect(viewIdA).not.toBe(viewIdB);

    emitViewError(viewIdA!);

    expect(onErrorA).toHaveBeenCalledTimes(1);
    const error = onErrorA.mock.calls[0]![0] as AdaptyError;
    expect(error).toBeInstanceOf(AdaptyError);
    expect(error.adaptyCode).toBe(4001);
    expect(error.message).toContain(PLATFORM_NOT_SUPPORTED.message);
    expect(error.detail).toBe(PLATFORM_NOT_SUPPORTED.detail);
    expect(onErrorB).not.toHaveBeenCalled();

    // Control: B is subscribed to its own id
    emitViewError(viewIdB!);
    expect(onErrorB).toHaveBeenCalledTimes(1);
    expect(onErrorA).toHaveBeenCalledTimes(1);
  });

  it('ignores an error for the previous configuration after a params change', async () => {
    const onError = jest.fn().mockReturnValue(true);

    await render(<AdaptyFlowView flow={flow} onError={onError} />);
    const [oldViewId] = hostViewIds();

    await render(
      <AdaptyFlowView
        flow={flow}
        params={{ customLayoutId: 'other' }}
        onError={onError}
      />,
    );
    const [newViewId] = hostViewIds();
    expect(newViewId).not.toBe(oldViewId);

    emitViewError(oldViewId!);

    expect(onError).not.toHaveBeenCalled();

    // Control: the remounted view is subscribed to the new id
    emitViewError(newViewId!);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]![0]).toBeInstanceOf(AdaptyError);
  });
});
