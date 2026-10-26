const functions = require('firebase-functions/v1');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
const { enforceRateLimit } = require('./rateLimiter');

// Callable: mint an Agora RTC token for a talk channel.
// Client calls: httpsCallable('mintAgoraToken')({ channelName, role: 'host'|'audience' })
// Requires: AGORA_APP_ID in functions/.env and the AGORA_APP_CERT secret
// (firebase functions:secrets:set AGORA_APP_CERT) — see functions/README.md.
exports.mintAgoraToken = functions
  .runWith({ secrets: ['AGORA_APP_CERT'] })
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Login required');
    }

    // Cap token minting to 30 requests/minute per user to deter abuse.
    await enforceRateLimit(context.auth.uid, 'mintAgoraToken', { max: 30, windowSeconds: 60 });

    const { channelName, role = 'audience' } = data || {};
    if (!channelName) {
      throw new functions.https.HttpsError('invalid-argument', 'channelName required');
    }

    const appId = process.env.AGORA_APP_ID;
    const cert = process.env.AGORA_APP_CERT;
    if (!appId || !cert) {
      throw new functions.https.HttpsError('failed-precondition', 'Agora not configured');
    }

    const uid = context.auth.uid;
    const rtcRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expireSeconds = 60 * 60 * 2; // 2h
    const privilegeExpire = Math.floor(Date.now() / 1000) + expireSeconds;

    const token = RtcTokenBuilder.buildTokenWithUserAccount(
      appId,
      cert,
      channelName,
      uid,
      rtcRole,
      privilegeExpire,
      privilegeExpire
    );

    return { token, channelName, uid, role, expiresAt: privilegeExpire * 1000 };
  });
