const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Fixed-window rate limiter backed by Firestore. Keeps a per-(key,action)
// counter that resets every `windowSeconds`. Cheap, atomic via a transaction,
// and self-expiring (docs carry a `windowStart` so stale windows reset on read).
//
// Usage in a callable:
//   await enforceRateLimit(context.auth.uid, 'mintAgoraToken', { max: 30, windowSeconds: 60 });
async function enforceRateLimit(key, action, { max = 60, windowSeconds = 60 } = {}) {
  if (!key) return; // unauthenticated paths are gated elsewhere
  const db = admin.firestore();
  const nowSec = Math.floor(Date.now() / 1000);
  const windowStart = nowSec - (nowSec % windowSeconds);
  const ref = db.collection('rate_limits').doc(`${action}__${key}`);

  const allowed = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : null;
    // New window (or first call): reset the counter.
    if (!data || data.windowStart !== windowStart) {
      tx.set(ref, { windowStart, count: 1, action, key });
      return true;
    }
    if (data.count >= max) return false;
    tx.update(ref, { count: data.count + 1 });
    return true;
  });

  if (!allowed) {
    throw new functions.https.HttpsError(
      'resource-exhausted',
      `Rate limit exceeded for ${action}. Try again shortly.`
    );
  }
}

module.exports = { enforceRateLimit };
