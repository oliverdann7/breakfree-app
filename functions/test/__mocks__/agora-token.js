// Stand-in for `agora-token`. The builder returns a deterministic fake token
// so agoraToken tests can assert wiring without real crypto.

const RtcRole = { PUBLISHER: 1, SUBSCRIBER: 2 };

const RtcTokenBuilder = {
  buildTokenWithUserAccount: jest.fn(() => 'FAKE_AGORA_TOKEN'),
};

module.exports = { RtcRole, RtcTokenBuilder };
