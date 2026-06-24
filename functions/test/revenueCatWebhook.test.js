const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { revenueCatWebhook } = require('../src/revenueCatWebhook');

const TOKEN = 'shhh-secret';

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.send = jest.fn(() => res);
  return res;
}

function mockReq({ method = 'POST', token = TOKEN, body } = {}) {
  return {
    method,
    get: (header) => (header === 'Authorization' ? (token ? `Bearer ${token}` : '') : undefined),
    body,
  };
}

describe('revenueCatWebhook', () => {
  let setMock;

  beforeEach(() => {
    admin.__reset();
    functions.__setConfig({ revenuecat: { webhook_token: TOKEN } });
    setMock = jest.fn().mockResolvedValue(undefined);
    admin.__api.firestoreApi.doc.mockReturnValue({ set: setMock });
  });

  afterEach(() => functions.__resetConfig());

  it('rejects non-POST methods with 405', async () => {
    const res = mockRes();
    await revenueCatWebhook(mockReq({ method: 'GET' }), res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(setMock).not.toHaveBeenCalled();
  });

  it('rejects a wrong bearer token with 401', async () => {
    const res = mockRes();
    await revenueCatWebhook(mockReq({ token: 'nope', body: {} }), res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('rejects an unknown event type with 400', async () => {
    const res = mockRes();
    await revenueCatWebhook(mockReq({ body: { event: { type: 'BOGUS' } } }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects a missing app_user_id with 400', async () => {
    const res = mockRes();
    await revenueCatWebhook(mockReq({ body: { event: { type: 'RENEWAL' } } }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('writes an active subscription for a purchase event', async () => {
    const res = mockRes();
    await revenueCatWebhook(
      mockReq({
        body: {
          event: {
            type: 'INITIAL_PURCHASE',
            app_user_id: 'user-1',
            product_id: 'pro_monthly',
            expiration_at_ms: 123,
          },
        },
      }),
      res
    );
    expect(admin.__api.firestoreApi.doc).toHaveBeenCalledWith('users/user-1/subscription/current');
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        planId: 'pro_monthly',
        status: 'active',
        renewAt: 123,
        lastEvent: 'INITIAL_PURCHASE',
        provider: 'revenuecat',
      }),
      { merge: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('marks the subscription cancelled on an expiration event', async () => {
    const res = mockRes();
    await revenueCatWebhook(
      mockReq({ body: { event: { type: 'EXPIRATION', app_user_id: 'user-2' } } }),
      res
    );
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'cancelled', lastEvent: 'EXPIRATION' }),
      { merge: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('honours the token from process.env when config is absent', async () => {
    functions.__resetConfig();
    process.env.REVENUECAT_WEBHOOK_TOKEN = 'env-token';
    const res = mockRes();
    await revenueCatWebhook(
      mockReq({ token: 'env-token', body: { event: { type: 'RENEWAL', app_user_id: 'u3' } } }),
      res
    );
    expect(res.status).toHaveBeenCalledWith(200);
    delete process.env.REVENUECAT_WEBHOOK_TOKEN;
  });
});
