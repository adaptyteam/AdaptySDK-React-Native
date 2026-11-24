import { sendAppMessageRequest } from './send-app-message';
import { $bridge } from '@/bridge';

jest.mock('@/bridge', () => {
  const actual = jest.requireActual('@/bridge');
  return {
    ...actual,
    $bridge: {
      request: jest.fn(),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeAllEventListeners: jest.fn(),
    },
  };
});

describe('sendAppMessageRequest', () => {
  const request = () => jest.mocked($bridge.request);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects without a bridge call when id is null', async () => {
    await expect(sendAppMessageRequest(null, { coins: 10 })).rejects.toThrow(
      'View reference not found',
    );
    expect(request()).not.toHaveBeenCalled();
  });

  it('resolves to undefined when the bridge returns true', async () => {
    request().mockResolvedValueOnce(true);

    await expect(
      sendAppMessageRequest('view-1', { coins: 10, nested: { ok: true } }),
    ).resolves.toBeUndefined();

    expect(request()).toHaveBeenCalledWith(
      'adapty_ui_send_app_message',
      expect.any(String),
      'Void',
      expect.any(Object),
    );
    const body = JSON.parse(request().mock.calls[0]![1] as string);
    expect(body.method).toBe('adapty_ui_send_app_message');
    expect(body.id).toBe('view-1');
    expect(typeof body.message_id).toBe('string');
    expect(body.message_id.length).toBeGreaterThan(0);
    expect(body.payload).toEqual({ coins: 10, nested: { ok: true } });
  });

  it('rethrows a bridge error', async () => {
    const error = new Error('bridge failed');
    request().mockRejectedValueOnce(error);

    await expect(sendAppMessageRequest('view-1', { a: 1 })).rejects.toBe(error);
  });
});
