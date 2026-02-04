import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import type { components } from '@/types/api';
import {
  createNativeModuleMock,
  extractNativeRequest,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  REPORT_TRANSACTION_REQUEST,
  REPORT_TRANSACTION_RESPONSE_SUCCESS,
  UPDATE_ATTRIBUTION_DATA_RESPONSE_SUCCESS,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - Attribution (Bridge Integration)', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;

  beforeEach(async () => {
    resetBridge();
    adapty = new Adapty();

    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      report_transaction: REPORT_TRANSACTION_RESPONSE_SUCCESS,
      update_attribution_data: UPDATE_ATTRIBUTION_DATA_RESPONSE_SUCCESS,
    });

    await adapty.activate('test_api_key', { logLevel: 'error' });
    nativeMock.handler.mockClear();
  });

  afterEach(() => {
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  describe('reportTransaction', () => {
    it('should send ReportTransaction.Request with transaction_id', async () => {
      await adapty.reportTransaction('transaction_12345');

      expectNativeCall({
        nativeModule: nativeMock,
        method: 'report_transaction',
        expectedRequest: REPORT_TRANSACTION_REQUEST,
      });
    });

    it('should include variation_id when provided', async () => {
      await adapty.reportTransaction('transaction_12345', 'variation_abc');

      const request = extractNativeRequest<
        components['requests']['ReportTransaction.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('report_transaction');
      expect(request.transaction_id).toBe('transaction_12345');
      expect(request.variation_id).toBe('variation_abc');
    });
  });

  describe('updateAttribution', () => {
    it('should send UpdateAttributionData.Request with attribution data', async () => {
      const attribution = {
        campaign: 'summer_sale',
        source: 'google',
      };

      await adapty.updateAttribution(attribution, 'appsflyer');

      const request = extractNativeRequest<
        components['requests']['UpdateAttributionData.Request']
      >({
        nativeModule: nativeMock,
      });

      expect(request.method).toBe('update_attribution_data');
      expect(request.source).toBe('appsflyer');
      // Attribution is serialized as JSON string
      expect(request.attribution).toBeDefined();
      const parsedAttribution = JSON.parse(request.attribution);
      expect(parsedAttribution.campaign).toBe('summer_sale');
      expect(parsedAttribution.source).toBe('google');
    });
  });
});
