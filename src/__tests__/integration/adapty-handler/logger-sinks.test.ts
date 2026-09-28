import { Adapty } from '@/adapty-handler';
import { resetBridge } from '@/bridge';
import { Log, consoleLogSink } from '@/logger';
import type { LogEvent, LogSink } from '@/logger';
import {
  createNativeModuleMock,
  expectNativeCall,
  resetNativeModuleMock,
  type MockNativeModule,
} from '../shared/native-module-mock.utils';
import {
  ACTIVATE_RESPONSE_SUCCESS,
  SET_INTEGRATION_IDENTIFIER_RESPONSE_SUCCESS,
  SET_LOG_LEVEL_REQUEST,
  SET_LOG_LEVEL_RESPONSE,
} from '../shared/bridge-samples';
import { cleanupAdapty } from './setup.utils';

describe('Adapty - setLogLevel with a logger config', () => {
  let adapty: Adapty;
  let nativeMock: MockNativeModule;
  let events: LogEvent[];
  let consoleSpies: jest.SpyInstance[];

  const collectingSink = (id = 'test-sink'): LogSink => ({
    id,
    handle: event => events.push(event),
  });

  beforeEach(() => {
    resetBridge();
    adapty = new Adapty();
    events = [];
    nativeMock = createNativeModuleMock({
      activate: ACTIVATE_RESPONSE_SUCCESS,
      set_log_level: SET_LOG_LEVEL_RESPONSE,
      set_integration_identifiers: SET_INTEGRATION_IDENTIFIER_RESPONSE_SUCCESS,
    });
    // silence the default console sink
    consoleSpies = (['debug', 'info', 'warn', 'error'] as const).map(level =>
      jest.spyOn(console, level).mockImplementation(() => {}),
    );
  });

  afterEach(() => {
    Log.configure({ sinks: [consoleLogSink] });
    Log.logLevel = null;
    consoleSpies.forEach(spy => spy.mockRestore());
    cleanupAdapty(adapty);
    resetNativeModuleMock(nativeMock);
    resetBridge();
  });

  it('keeps the single-argument form working', async () => {
    await adapty.setLogLevel('error');

    expect(Log.logLevel).toBe('error');
    expectNativeCall({
      nativeModule: nativeMock,
      method: 'set_log_level',
      expectedRequest: SET_LOG_LEVEL_REQUEST,
    });
  });

  it('sets the level and calls native when a logger is passed', async () => {
    await adapty.setLogLevel('error', {
      logger: { sinks: [collectingSink()] },
    });

    expect(Log.logLevel).toBe('error');
    expectNativeCall({
      nativeModule: nativeMock,
      method: 'set_log_level',
      expectedRequest: SET_LOG_LEVEL_REQUEST,
    });
  });

  it('delivers the setLogLevel call logs to the new sink', async () => {
    // a level is already on, so the start log is emitted and must hit the new sink
    Log.logLevel = 'verbose';

    await adapty.setLogLevel('verbose', {
      logger: { sinks: [collectingSink()] },
    });

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          funcName: 'setLogLevel',
          message: expect.stringContaining('Calling method...'),
        }),
        expect.objectContaining({ funcName: 'fetch/set_log_level' }),
      ]),
    );
  });

  it('routes later SDK logs to the configured sink', async () => {
    await adapty.setLogLevel('verbose', {
      logger: { sinks: [collectingSink()] },
    });
    await adapty.activate('test_api_key');
    events = [];

    await adapty.setIntegrationIdentifier('appmetrica_device_id', 'device_123');

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: 'verbose',
          funcName: 'fetch/set_integration_identifiers',
        }),
      ]),
    );
  });

  it.each([
    ['an empty options object', {}],
    ['undefined options', undefined],
  ])('keeps sinks and defaultMeta with %s', async (_name, options) => {
    const destroy = jest.fn();
    await adapty.setLogLevel('verbose', {
      logger: {
        sinks: [{ ...collectingSink(), destroy }],
        defaultMeta: { tag: 'kept' },
      },
    });

    await adapty.setLogLevel('verbose', options);
    events = [];
    await adapty.activate('test_api_key');

    expect(destroy).not.toHaveBeenCalled();
    expect(events.length).toBeGreaterThan(0);
    expect(events.every(event => event.params?.['tag'] === 'kept')).toBe(true);
  });

  it('replaces and destroys previously configured sinks', async () => {
    const destroy = jest.fn();
    const firstEvents: LogEvent[] = [];
    const secondEvents: LogEvent[] = [];
    await adapty.setLogLevel('verbose', {
      logger: {
        sinks: [
          { id: 'first', handle: event => firstEvents.push(event), destroy },
        ],
      },
    });

    await adapty.setLogLevel('verbose', {
      logger: {
        sinks: [{ id: 'second', handle: event => secondEvents.push(event) }],
      },
    });
    firstEvents.length = 0;
    secondEvents.length = 0;
    await adapty.activate('test_api_key');

    expect(destroy).toHaveBeenCalledTimes(1);
    expect(firstEvents).toHaveLength(0);
    expect(secondEvents.length).toBeGreaterThan(0);
  });

  it('does not fail SDK calls when a sink throws', async () => {
    const handle = jest.fn(() => {
      throw new Error('sink failure');
    });
    await adapty.setLogLevel('verbose', {
      logger: { sinks: [{ id: 'throwing', handle }] },
    });

    await expect(adapty.activate('test_api_key')).resolves.toBeUndefined();
    expect(handle).toHaveBeenCalled();
  });

  it('keeps the new sinks and level when native set_log_level rejects', async () => {
    nativeMock.handler.mockRejectedValueOnce({ message: 'native failure' });

    // verbose: the bridge logs a native failure via log.success, i.e. at verbose level
    await expect(
      adapty.setLogLevel('verbose', { logger: { sinks: [collectingSink()] } }),
    ).rejects.toEqual(expect.objectContaining({ message: 'native failure' }));

    expect(Log.logLevel).toBe('verbose');
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          funcName: 'fetch/set_log_level',
          params: expect.objectContaining({
            error: expect.objectContaining({ message: 'native failure' }),
          }),
        }),
      ]),
    );
  });
});
