import React, { createRef } from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import type { AdaptyFlow } from '@/types';
import type { NativeAdaptyFlowViewProps } from './types';

jest.mock('@/coders/factory', () => ({
  coderFactory: {
    createFlowCoder: () => ({
      encode: (flow: { id: string; version: number }) => ({ ...flow }),
    }),
    createUiCreateFlowViewParamsCoder: () => ({
      encode: (params: Record<string, unknown>) => ({ ...params }),
    }),
  },
}));

jest.mock('@/utils', () => ({
  ...jest.requireActual('@/utils'),
  shouldEnableMock: () => false,
}));

jest.mock('./native-components', () => ({
  AdaptyFlowViewHost: 'AdaptyFlowView',
}));

jest.mock('@/bridge', () => ({
  $bridge: {
    addRawEventListener: () => ({ remove: () => undefined }),
    request: jest.fn(),
  },
}));

jest.mock('./create-flow-event-handlers', () => ({
  createFlowEventHandlers: jest.fn(() => () => undefined),
}));

import { $bridge } from '@/bridge';
import { AdaptyFlowView, type AdaptyFlowViewRef } from './AdaptyFlowView';

const mockRequest = $bridge.request as jest.Mock;

const flowA = (): AdaptyFlow =>
  ({ id: 'a', version: 1 }) as unknown as AdaptyFlow;

let tree: ReactTestRenderer | undefined;

const render = async (element: React.ReactElement) => {
  await act(async () => {
    if (tree) tree.update(element);
    else tree = renderer.create(element);
  });
};

const host = () => tree!.root.findByType('AdaptyFlowView' as never);

const hostViewId = () => (host().props as NativeAdaptyFlowViewProps).viewId;

const sendCalls = () =>
  mockRequest.mock.calls.filter(
    ([method]) => method === 'adapty_ui_send_app_message',
  );

const sentBody = (index: number) =>
  JSON.parse(sendCalls()[index]![1] as string) as Record<string, unknown>;

describe('AdaptyFlowView ref: sendAppMessage', () => {
  beforeEach(() => {
    tree = undefined;
    mockRequest.mockReset();
    mockRequest.mockResolvedValue(true);
  });

  afterEach(async () => {
    if (tree) await act(async () => tree!.unmount());
  });

  it('encodes the request with the committed view id and resolves to undefined', async () => {
    const ref = createRef<AdaptyFlowViewRef>();
    await render(<AdaptyFlowView ref={ref} flow={flowA()} />);

    await expect(
      ref.current!.sendAppMessage({ action: 'confirmed' }),
    ).resolves.toBeUndefined();

    expect(mockRequest).toHaveBeenCalledWith(
      'adapty_ui_send_app_message',
      expect.any(String),
      'Void',
      expect.any(Object),
    );
    expect(hostViewId()).toMatch(/^a_.+:0$/);
    expect(sentBody(0)).toEqual({
      method: 'adapty_ui_send_app_message',
      id: hostViewId(),
      message_id: expect.any(String),
      payload: { action: 'confirmed' },
    });
  });

  it('rejects with the native error', async () => {
    const ref = createRef<AdaptyFlowViewRef>();
    await render(<AdaptyFlowView ref={ref} flow={flowA()} />);

    const nativeError = new Error('viewNotFound');
    mockRequest.mockRejectedValueOnce(nativeError);
    await expect(ref.current!.sendAppMessage({ a: 1 })).rejects.toBe(
      nativeError,
    );
    expect(sentBody(0)['id']).toBe(hostViewId());
  });

  it('keeps the handle identity across re-renders', async () => {
    const ref = createRef<AdaptyFlowViewRef>();
    await render(
      <AdaptyFlowView ref={ref} flow={flowA()} onAppeared={() => false} />,
    );
    const handle = ref.current;
    await render(
      <AdaptyFlowView ref={ref} flow={flowA()} onAppeared={() => true} />,
    );
    expect(ref.current).toBe(handle);
  });

  it('changes the view id and remounts the host when params change for the same flow', async () => {
    const ref = createRef<AdaptyFlowViewRef>();
    const flow = flowA();
    await render(
      <AdaptyFlowView ref={ref} flow={flow} params={{ locale: 'en' }} />,
    );
    const oldId = hostViewId();
    const oldHost = host();

    await render(
      <AdaptyFlowView ref={ref} flow={flow} params={{ locale: 'es' }} />,
    );
    const newId = hostViewId();
    expect(newId).not.toBe(oldId);
    expect(newId).toMatch(/^a_.+:1$/);
    expect(newId.slice(0, -2)).toBe(oldId.slice(0, -2));
    expect(host()).not.toBe(oldHost);

    await ref.current!.sendAppMessage({ a: 1 });
    expect(sentBody(0)['id']).toBe(newId);
  });

  it('sends to the new view id from an earlier sibling layout effect in the params-change commit', async () => {
    const ref = createRef<AdaptyFlowViewRef>();
    const flow = flowA();
    const Sibling = ({ locale }: { locale: string }) => {
      React.useLayoutEffect(() => {
        if (locale === 'es') void ref.current!.sendAppMessage({ locale });
      }, [locale]);
      return null;
    };
    const App = ({ locale }: { locale: string }) => (
      <>
        <Sibling locale={locale} />
        <AdaptyFlowView ref={ref} flow={flow} params={{ locale }} />
      </>
    );

    await render(<App locale="en" />);
    await render(<App locale="es" />);

    expect(hostViewId()).toMatch(/^a_.+:1$/);
    expect(sendCalls()).toHaveLength(1);
    expect(sentBody(0)['id']).toBe(hostViewId());
  });

  it('keeps the view id when re-rendered with equal flowJson', async () => {
    const ref = createRef<AdaptyFlowViewRef>();
    await render(
      <AdaptyFlowView ref={ref} flow={flowA()} params={{ locale: 'en' }} />,
    );
    const id = hostViewId();
    const oldHost = host();

    // New object identities, same encoded value
    await render(
      <AdaptyFlowView ref={ref} flow={flowA()} params={{ locale: 'en' }} />,
    );
    expect(hostViewId()).toBe(id);
    expect(host()).toBe(oldHost);
  });

  it('an in-flight call keeps the id it started with', async () => {
    const ref = createRef<AdaptyFlowViewRef>();
    const flow = flowA();
    await render(
      <AdaptyFlowView ref={ref} flow={flow} params={{ locale: 'en' }} />,
    );
    const oldId = hostViewId();
    const handle = ref.current!;

    let resolveFirst!: (value: unknown) => void;
    mockRequest.mockImplementationOnce(
      () => new Promise(resolve => (resolveFirst = resolve)),
    );
    const first = handle.sendAppMessage({ step: 1 });

    await render(
      <AdaptyFlowView ref={ref} flow={flow} params={{ locale: 'es' }} />,
    );
    const newId = hostViewId();
    expect(newId).not.toBe(oldId);

    const second = handle.sendAppMessage({ step: 2 });
    resolveFirst(true);
    await expect(first).resolves.toBeUndefined();
    await expect(second).resolves.toBeUndefined();

    expect(sentBody(0)).toMatchObject({ id: oldId, payload: { step: 1 } });
    expect(sentBody(1)).toMatchObject({ id: newId, payload: { step: 2 } });
    expect(ref.current).toBe(handle);
  });

  it('rejects without a bridge call after unmount', async () => {
    const ref = createRef<AdaptyFlowViewRef>();
    await render(<AdaptyFlowView ref={ref} flow={flowA()} />);
    const handle = ref.current!;

    await act(async () => tree!.unmount());
    tree = undefined;
    expect(ref.current).toBeNull();

    await expect(handle.sendAppMessage({ a: 1 })).rejects.toThrow(
      'View reference not found',
    );
    expect(sendCalls()).toHaveLength(0);
  });
});
