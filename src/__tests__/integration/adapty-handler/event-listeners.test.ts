import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { AdaptyInstallationDetails, AdaptyError } from '@/types';
import {
  createNativeModuleMock,
  emitNativeEvent,
  resetNativeModuleMock,
  type MockNativeModule,
} from './native-module-mock.utils';
import { ACTIVATE_RESPONSE_SUCCESS } from './bridge-samples';
import {
  INSTALLATION_DETAILS_SUCCESS,
  INSTALLATION_DETAILS_FAIL,
} from './adapty-handler-bridge-event-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Event Listeners (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('addEventListener', () => {
    it('should receive onInstallationDetailsSuccess event', async () => {
      const callback = jest.fn();

      adapty.addEventListener('onInstallationDetailsSuccess', callback);

      // Emit native event
      emitNativeEvent({
        eventName: 'on_installation_details_success',
        eventData: INSTALLATION_DETAILS_SUCCESS,
      });

      // Wait for event to be processed
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(callback).toHaveBeenCalledTimes(1);

      const receivedDetails: AdaptyInstallationDetails =
        callback.mock.calls[0][0];
      expect(receivedDetails.installId).toBe('some-install-id');
      expect(receivedDetails.appLaunchCount).toBe(8);
      expect(receivedDetails.payload).toBe('{}');
      expect(receivedDetails.installTime).toBeInstanceOf(Date);
    });

    it('should receive onInstallationDetailsFail event', async () => {
      const callback = jest.fn();

      adapty.addEventListener('onInstallationDetailsFail', callback);

      // Emit native event
      emitNativeEvent({
        eventName: 'on_installation_details_fail',
        eventData: INSTALLATION_DETAILS_FAIL,
      });

      // Wait for event to be processed
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(callback).toHaveBeenCalledTimes(1);

      const receivedError: AdaptyError = callback.mock.calls[0][0];
      expect(receivedError.adaptyCode).toBe(2004);
      expect(receivedError.message).toBe('Failed to fetch installation details');
    });

    it('should support multiple listeners for the same event', async () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      adapty.addEventListener('onInstallationDetailsSuccess', callback1);
      adapty.addEventListener('onInstallationDetailsSuccess', callback2);

      // Emit native event
      emitNativeEvent({
        eventName: 'on_installation_details_success',
        eventData: INSTALLATION_DETAILS_SUCCESS,
      });

      // Wait for events to be processed
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should allow listener to be removed individually', async () => {
      const callback = jest.fn();

      const subscription = adapty.addEventListener(
        'onInstallationDetailsSuccess',
        callback,
      );

      // Remove listener before emitting event
      subscription.remove();

      // Emit native event
      emitNativeEvent({
        eventName: 'on_installation_details_success',
        eventData: INSTALLATION_DETAILS_SUCCESS,
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 10));

      // Callback should NOT be called
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all event listeners', async () => {
      const successCallback = jest.fn();
      const failCallback = jest.fn();

      adapty.addEventListener('onInstallationDetailsSuccess', successCallback);
      adapty.addEventListener('onInstallationDetailsFail', failCallback);

      // Remove all listeners
      adapty.removeAllListeners();

      // Emit native events
      emitNativeEvent({
        eventName: 'on_installation_details_success',
        eventData: INSTALLATION_DETAILS_SUCCESS,
      });

      emitNativeEvent({
        eventName: 'on_installation_details_fail',
        eventData: INSTALLATION_DETAILS_FAIL,
      });

      // Wait for event processing
      await new Promise(resolve => setTimeout(resolve, 10));

      // Neither callback should be called
      expect(successCallback).not.toHaveBeenCalled();
      expect(failCallback).not.toHaveBeenCalled();
    });
  });
});
