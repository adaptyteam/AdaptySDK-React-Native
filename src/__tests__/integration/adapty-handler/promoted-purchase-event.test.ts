/**
 * Integration test for the App Store promoted purchase event.
 *
 * Tests that did_receive_promoted_purchase reaches the
 * onPromotedPurchaseReceived listener and is decoded into
 * AdaptyPromotedProduct (snake_case -> camelCase).
 */

import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import type { AdaptyPromotedProduct } from '@/types';
import {
  createNativeModuleMock,
  emitNativeEvent,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
  MAKE_PROMOTED_PURCHASE_RESPONSE_SUCCESS,
} from '../shared/bridge-samples';

describe('Adapty - Promoted Purchase Event', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      make_promoted_purchase: MAKE_PROMOTED_PURCHASE_RESPONSE_SUCCESS,
    });

    adapty = new Adapty();
    await adapty.activate('test_key');
    // Drop the activate call so extractNativeRequest's default callIndex 0
    // lands on the call the test is about.
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    adapty.removeAllListeners();
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  it('should auto-purchase the promoted product when no listener is registered', async () => {
    // The whole point of the default handler: nothing registered, purchase still happens.
    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    // The default handler fires makePromotedPurchase without awaiting it.
    await new Promise(resolve => setImmediate(resolve));

    const request = extractNativeRequest<
      components['requests']['MakePromotedPurchase.Request']
    >({
      nativeModule: nativeMock,
    });

    expect(request.method).toBe('make_promoted_purchase');
    expect(request.product.vendor_product_id).toBe('yearly.premium.6999');
  });

  it('should decode the promoted product for a registered listener', () => {
    const received: AdaptyPromotedProduct[] = [];

    adapty.addEventListener('onPromotedPurchaseReceived', product => {
      received.push(product);
    });

    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    expect(received).toHaveLength(1);
    const product = received[0]!;

    expect(product.vendorProductId).toBe('yearly.premium.6999');
    expect(product.localizedTitle).toBe('Yearly Premium Plan');
    expect(product.price?.amount).toBe(69.99);
  });

  it('should not auto-purchase when a listener is registered', async () => {
    // A registered handler REPLACES the default. If it also ran, a handler that
    // purchases — the documented thing to do — would buy twice.
    adapty.addEventListener('onPromotedPurchaseReceived', () => {});

    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    await new Promise(resolve => setImmediate(resolve));

    const calledMethods = nativeMock.handler.mock.calls.map(call => call[0]);
    expect(calledMethods).not.toContain('make_promoted_purchase');
  });

  it('should purchase once when a handler subscribes another one mid-dispatch', async () => {
    // The invariant this suite exists for, against the one path that used to
    // break it. A handler that registers another handler synchronously - a
    // re-arm helper, an "ensure subscribed" call - had the new handler visited
    // by the same dispatch pass and handed the SAME product. Both purchase, so
    // one App Store tap became two make_promoted_purchase calls.
    const purchase = (product: AdaptyPromotedProduct) => {
      void adapty.makePromotedPurchase(product);
    };

    adapty.addEventListener('onPromotedPurchaseReceived', product => {
      adapty.addEventListener('onPromotedPurchaseReceived', purchase);
      purchase(product);
    });

    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    await new Promise(resolve => setImmediate(resolve));

    const purchases = nativeMock.handler.mock.calls
      .map(call => call[0])
      .filter(method => method === 'make_promoted_purchase');
    expect(purchases).toHaveLength(1);
  });

  it('should restore the default when the app removes its subscription', async () => {
    // The per-screen useEffect cleanup idiom. A one-way flag would leave the
    // default suppressed here with no listener left, silently dropping every
    // later promoted purchase.
    const subscription = adapty.addEventListener(
      'onPromotedPurchaseReceived',
      () => {},
    );
    subscription.remove();

    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    await new Promise(resolve => setImmediate(resolve));

    const calledMethods = nativeMock.handler.mock.calls.map(call => call[0]);
    expect(calledMethods).toContain('make_promoted_purchase');
  });

  it('should keep handling promoted purchases after removeAllListeners', async () => {
    // removeAllListeners() drops the SDK's own subscription too, so it has to be
    // reinstalled — activate() runs once per process and will not do it again.
    adapty.removeAllListeners();

    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    await new Promise(resolve => setImmediate(resolve));

    const calledMethods = nativeMock.handler.mock.calls.map(call => call[0]);
    expect(calledMethods).toContain('make_promoted_purchase');
  });

  it('should not resume the default while another listener is still registered', async () => {
    // Removing one handler twice must not free the slot held by a live one. Set
    // identity makes that structural rather than arithmetic, and this test is
    // what keeps it that way: any future rewrite that goes back to counting
    // registrations fails here, because a stray second decrement would resume
    // the default alongside the surviving handler and buy the product twice.
    const first = adapty.addEventListener(
      'onPromotedPurchaseReceived',
      () => {},
    );
    adapty.addEventListener('onPromotedPurchaseReceived', () => {});

    first.remove();
    first.remove();

    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    await new Promise(resolve => setImmediate(resolve));

    const calledMethods = nativeMock.handler.mock.calls.map(call => call[0]);
    expect(calledMethods).not.toContain('make_promoted_purchase');
  });

  it('should keep the same function registered twice as two independently removable entries', async () => {
    // Each registration gets its own wrapper object, so registering the same
    // function reference twice yields two entries: removing one leaves the
    // other live, and the handler still runs and the default stays suppressed.
    const runs: boolean[] = [];
    const handler = () => {
      runs.push(true);
    };

    const first = adapty.addEventListener(
      'onPromotedPurchaseReceived',
      handler,
    );
    adapty.addEventListener('onPromotedPurchaseReceived', handler);

    first.remove();

    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    await new Promise(resolve => setImmediate(resolve));

    expect(runs.length).toBeGreaterThan(0);

    const calledMethods = nativeMock.handler.mock.calls.map(call => call[0]);
    expect(calledMethods).not.toContain('make_promoted_purchase');
  });

  it('should keep the same function registered twice as two independently removable entries, removed in either order', async () => {
    // Same scenario as above, but removing the second registration instead of
    // the first. Set identity by wrapper object doesn't care about order, so
    // this has to hold either way: the handler still runs and the default
    // stays suppressed.
    const runs: boolean[] = [];
    const handler = () => {
      runs.push(true);
    };

    adapty.addEventListener('onPromotedPurchaseReceived', handler);
    const second = adapty.addEventListener(
      'onPromotedPurchaseReceived',
      handler,
    );

    second.remove();

    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    await new Promise(resolve => setImmediate(resolve));

    expect(runs.length).toBeGreaterThan(0);

    const calledMethods = nativeMock.handler.mock.calls.map(call => call[0]);
    expect(calledMethods).not.toContain('make_promoted_purchase');
  });

  it('should not let a rejecting async handler escape as an unhandled rejection, and must not auto-purchase', async () => {
    // The documented usage for this event is an async handler (see the
    // makePromotedPurchase example JSDoc). If it rejects — a declined purchase,
    // a network error — the rejection must be caught and logged, not escape as
    // an unhandled rejection. And the app still owns completion: a throwing
    // handler must not fall back to the SDK auto-purchasing on its behalf.
    const unhandledRejections: unknown[] = [];
    const onUnhandledRejection = (reason: unknown) => {
      unhandledRejections.push(reason);
    };
    process.on('unhandledRejection', onUnhandledRejection);

    try {
      adapty.addEventListener('onPromotedPurchaseReceived', async () => {
        throw new Error('declined');
      });

      emitNativeEvent({
        eventName: 'did_receive_promoted_purchase',
        eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
      });

      await new Promise(resolve => setImmediate(resolve));

      expect(unhandledRejections).toHaveLength(0);

      const calledMethods = nativeMock.handler.mock.calls.map(call => call[0]);
      expect(calledMethods).not.toContain('make_promoted_purchase');
    } finally {
      process.removeListener('unhandledRejection', onUnhandledRejection);
    }
  });

  it('should keep dispatching to remaining handlers when one throws synchronously, and must not auto-purchase', async () => {
    // The callback type is (data: AdaptyPromotedProduct) => void | Promise<void>,
    // so sync handlers are explicitly permitted. A handler that throws
    // synchronously would otherwise escape before Promise.resolve().catch() is
    // attached and abort dispatch to the handlers after it. The second handler
    // running proves we catch the first; no auto-purchase proves the app still
    // owns completion even after a throwing handler.
    const secondHandlerRan: boolean[] = [];

    adapty.addEventListener('onPromotedPurchaseReceived', () => {
      throw new Error('sync error');
    });

    adapty.addEventListener('onPromotedPurchaseReceived', () => {
      secondHandlerRan.push(true);
    });

    emitNativeEvent({
      eventName: 'did_receive_promoted_purchase',
      eventData: EVENT_DID_RECEIVE_PROMOTED_PURCHASE,
    });

    await new Promise(resolve => setImmediate(resolve));

    expect(secondHandlerRan).toHaveLength(1);

    const calledMethods = nativeMock.handler.mock.calls.map(call => call[0]);
    expect(calledMethods).not.toContain('make_promoted_purchase');
  });

  it('should reject an unknown event name', () => {
    expect(() =>
      // @ts-expect-error - not a GlobalEventName
      adapty.addEventListener('onNotAnEvent', () => {}),
    ).toThrow('Unsupported event: onNotAnEvent');
  });
});
