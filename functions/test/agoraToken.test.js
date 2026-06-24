const admin = require('firebase-admin');
const functions = require('firebase-functions');
const agora = require('agora-token');
const { mintAgoraToken } = require('../src/agoraToken');

// Let the (real) rate limiter pass by giving it a fresh-window transaction.
function allowRateLimit() {
  admin.__api.firestoreApi.collection.mockReturnValue({ doc: jest.fn(() => ({})) });
  admin.__api.firestoreApi.runTransaction.mockImplementation((cb) =>
    cb({
      get: jest.fn().mockResolvedValue({ exists: false, data: () => null }),
      set: jest.fn(),
      update: jest.fn(),
    })
  );
}

describe('mintAgoraToken', () => {
  beforeEach(() => {
    admin.__reset();
    functions.__setConfig({ agora: { app_id: 'app123', app_certificate: 'cert456' } });
    agora.RtcTokenBuilder.buildTokenWithUserAccount.mockClear();
    allowRateLimit();
  });

  afterEach(() => functions.__resetConfig());

  it('rejects unauthenticated callers', async () => {
    await expect(mintAgoraToken({ channelName: 'c' }, {})).rejects.toMatchObject({
      code: 'unauthenticated',
    });
  });

  it('requires a channelName', async () => {
    await expect(mintAgoraToken({}, { auth: { uid: 'u1' } })).rejects.toMatchObject({
      code: 'invalid-argument',
    });
  });

  it('fails when Agora credentials are not configured', async () => {
    functions.__setConfig({});
    await expect(
      mintAgoraToken({ channelName: 'c' }, { auth: { uid: 'u1' } })
    ).rejects.toMatchObject({ code: 'failed-precondition' });
  });

  it('mints a subscriber token by default', async () => {
    const result = await mintAgoraToken({ channelName: 'talk-7' }, { auth: { uid: 'u1' } });
    expect(result).toMatchObject({
      token: 'FAKE_AGORA_TOKEN',
      channelName: 'talk-7',
      role: 'audience',
    });
    const args = agora.RtcTokenBuilder.buildTokenWithUserAccount.mock.calls[0];
    expect(args[0]).toBe('app123'); // appId
    expect(args[4]).toBe(agora.RtcRole.SUBSCRIBER); // role
  });

  it('mints a publisher token when role=host', async () => {
    await mintAgoraToken({ channelName: 'talk-7', role: 'host' }, { auth: { uid: 'u1' } });
    const args = agora.RtcTokenBuilder.buildTokenWithUserAccount.mock.calls[0];
    expect(args[4]).toBe(agora.RtcRole.PUBLISHER);
  });
});
