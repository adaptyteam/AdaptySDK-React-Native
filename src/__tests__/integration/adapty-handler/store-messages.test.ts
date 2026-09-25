import { Platform } from 'react-native';
import { Adapty } from '@/adapty-handler';
import { AdaptyError } from '@/adapty-error';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  expectNativeCall,
  extractNativeRequest,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  GET_PENDING_STORE_MESSAGE_TYPES_REQUEST,
  GET_PENDING_STORE_MESSAGE_TYPES_RESPONSE,
  SHOW_STORE_MESSAGES_REQUEST,
  SHOW_STORE_MESSAGES_REQUEST_WITH_FILTER,
  SHOW_STORE_MESSAGES_RESPONSE,
  SHOW_STORE_MESSAGES_RESPONSE_IN_PROGRESS,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

const originalOS = Platform.OS;
const originalSelect = Platform.select;

type Responses = Parameters<typeof createNativeModuleMock>[0];
type ShowRequest = components['requests']['ShowStoreMessage.Request'];

describe('Adapty - Store messages (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  const setUp = async (responses: Responses) => {
    resetBridge();
    adapty = new Adapty();
    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      ...responses,
    });
    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  };

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('iOS', () => {
    beforeAll(() => {
      Platform.OS = 'ios';
      Platform.select = jest.fn((obj: any) => obj.ios || obj.default);
    });

    afterAll(() => {
      Platform.OS = originalOS;
      Platform.select = originalSelect;
    });

    it('getPendingStoreMessageTypes returns the native types untouched', async () => {
      await setUp({
        get_pending_store_message_types:
          GET_PENDING_STORE_MESSAGE_TYPES_RESPONSE,
      });

      const types = await adapty.getPendingStoreMessageTypes();

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'get_pending_store_message_types',
        expectedRequest: GET_PENDING_STORE_MESSAGE_TYPES_REQUEST,
      });
      expect(types).toStrictEqual(['billing_issue', 'storekit_-42']);
    });

    it('showStoreMessages without params omits filter (show all)', async () => {
      await setUp({ show_store_messages: SHOW_STORE_MESSAGES_RESPONSE });

      await adapty.showStoreMessages();

      const request = extractNativeRequest<ShowRequest>({
        nativeModule: nativeMock,
      });
      expect(request).toStrictEqual(SHOW_STORE_MESSAGES_REQUEST);
    });

    it('showStoreMessages forwards ios.filter', async () => {
      await setUp({ show_store_messages: SHOW_STORE_MESSAGES_RESPONSE });

      await adapty.showStoreMessages({
        ios: { filter: ['price_increase_consent', 'billing_issue'] },
      });

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'show_store_messages',
        expectedRequest: SHOW_STORE_MESSAGES_REQUEST_WITH_FILTER,
      });
    });

    it('showStoreMessages keeps an empty ios.filter (native no-op, not show all)', async () => {
      await setUp({ show_store_messages: SHOW_STORE_MESSAGES_RESPONSE });

      await adapty.showStoreMessages({ ios: { filter: [] } });

      const request = extractNativeRequest<ShowRequest>({
        nativeModule: nativeMock,
      });
      expect(request).toStrictEqual({
        method: 'show_store_messages',
        filter: [],
      });
    });

    it('showStoreMessages forwards an opaque storekit_<n> type untouched', async () => {
      await setUp({ show_store_messages: SHOW_STORE_MESSAGES_RESPONSE });

      await adapty.showStoreMessages({ ios: { filter: ['storekit_7'] } });

      const request = extractNativeRequest<ShowRequest>({
        nativeModule: nativeMock,
      });
      expect(request.filter).toStrictEqual(['storekit_7']);
    });

    it('showStoreMessages rejects with the native AdaptyError', async () => {
      await setUp({
        show_store_messages: SHOW_STORE_MESSAGES_RESPONSE_IN_PROGRESS,
      });

      const error = await adapty.showStoreMessages().catch((e: unknown) => e);

      expect(error).toBeInstanceOf(AdaptyError);
      expect((error as AdaptyError).adaptyCode).toBe(3201);
    });
  });

  describe('Android', () => {
    beforeAll(() => {
      Platform.OS = 'android';
      Platform.select = jest.fn((obj: any) => obj.android || obj.default);
    });

    afterAll(() => {
      Platform.OS = originalOS;
      Platform.select = originalSelect;
    });

    it('getPendingStoreMessageTypes resolves null (unknown) without calling native', async () => {
      await setUp({});

      const types = await adapty.getPendingStoreMessageTypes();

      expect(types).toBeNull();
      expect(nativeMock.handler).not.toHaveBeenCalled();
    });

    it('showStoreMessages calls native', async () => {
      await setUp({ show_store_messages: SHOW_STORE_MESSAGES_RESPONSE });

      await adapty.showStoreMessages();

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'show_store_messages',
        expectedRequest: SHOW_STORE_MESSAGES_REQUEST,
      });
    });

    it.each([[['billing_issue']], [[]]])(
      'showStoreMessages drops the iOS-only filter %j',
      async filter => {
        await setUp({ show_store_messages: SHOW_STORE_MESSAGES_RESPONSE });

        await adapty.showStoreMessages({ ios: { filter } });

        const request = extractNativeRequest<ShowRequest>({
          nativeModule: nativeMock,
        });
        expect(request).toStrictEqual(SHOW_STORE_MESSAGES_REQUEST);
      },
    );
  });
});
