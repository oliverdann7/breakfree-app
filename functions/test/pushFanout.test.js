const admin = require('firebase-admin');
const { onNotificationCreated } = require('../src/pushFanout');

function mockSnap(notification) {
  return { data: () => notification };
}

function wireUser(pushToken) {
  admin.__api.firestoreApi.doc.mockReturnValue({
    get: jest.fn().mockResolvedValue({ data: () => (pushToken ? { pushToken } : {}) }),
  });
}

describe('onNotificationCreated', () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    admin.__reset();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve({ data: { status: 'ok' } }) });
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    delete global.fetch;
  });

  it('skips silent notifications without reading the user', async () => {
    const result = await onNotificationCreated(mockSnap({ silent: true }), {
      params: { uid: 'u1' },
    });
    expect(result).toBeNull();
    expect(admin.__api.firestoreApi.doc).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does nothing when the user has no push token', async () => {
    wireUser(null);
    const result = await onNotificationCreated(mockSnap({ title: 'Hi' }), {
      params: { uid: 'u1' },
    });
    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sends an Expo push to the stored token', async () => {
    wireUser('ExponentPushToken[abc]');
    await onNotificationCreated(
      mockSnap({ title: 'Talk başlıyor', body: 'Hemen katıl', data: { talkId: 't1' } }),
      { params: { uid: 'u1' } }
    );
    expect(global.fetch).toHaveBeenCalledWith(
      'https://exp.host/--/api/v2/push/send',
      expect.objectContaining({ method: 'POST' })
    );
    const body = JSON.parse(global.fetch.mock.calls[0][1].body);
    expect(body).toMatchObject({
      to: 'ExponentPushToken[abc]',
      title: 'Talk başlıyor',
      body: 'Hemen katıl',
      data: { talkId: 't1' },
    });
  });

  it('swallows push send failures', async () => {
    wireUser('ExponentPushToken[abc]');
    global.fetch.mockRejectedValue(new Error('network down'));
    const result = await onNotificationCreated(mockSnap({ title: 'Hi' }), {
      params: { uid: 'u1' },
    });
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });
});
