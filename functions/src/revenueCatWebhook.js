const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

const VALID_TYPES = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'CANCELLATION',
  'EXPIRATION',
  'BILLING_ISSUE',
  'NON_RENEWING_PURCHASE',
]);

// app_user_id is interpolated into a Firestore document path below, so it must
// never be able to alter that path ('/', '..', ...). The app registers users
// with their Firebase uid, so a Firebase-uid-shaped value is all we accept;
// RevenueCat anonymous ids ($RCAnonymousID:...) have no user doc to update
// anyway and are rejected with the rest.
const VALID_UID = /^[A-Za-z0-9_-]{1,128}$/;

const isMillis = (v) => typeof v === 'number' && Number.isFinite(v) && v > 0;

// Constant-time comparison; hashing first normalizes lengths so
// timingSafeEqual never throws and length itself leaks nothing.
const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

// HTTPS endpoint receiving RevenueCat webhook events.
// Secure via Authorization: Bearer <REVENUECAT_WEBHOOK_TOKEN> shared secret.
exports.revenueCatWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const token =
    functions.config().revenuecat?.webhook_token || process.env.REVENUECAT_WEBHOOK_TOKEN;
  const auth = req.get('Authorization') || '';
  if (!token || !safeEqual(auth, `Bearer ${token}`)) {
    return res.status(401).send('Unauthorized');
  }

  const event = req.body?.event;
  if (!event || !VALID_TYPES.has(event.type)) {
    return res.status(400).send('Invalid event');
  }

  const uid = event.app_user_id;
  if (typeof uid !== 'string' || uid.length === 0 || uid.length > 256) {
    return res.status(400).send('Invalid app_user_id');
  }
  if (!VALID_UID.test(uid)) {
    // Authenticated but unmappable — e.g. a RevenueCat anonymous id
    // ($RCAnonymousID:...) from a purchase made before sign-in, or any id
    // that isn't one of our Firebase uids. There is no user doc to update,
    // and a 4xx would make RevenueCat retry the delivery forever, so
    // acknowledge and skip. The path-safety property holds either way:
    // nothing outside VALID_UID ever reaches the Firestore path below.
    return res.status(200).send('Ignored: unmappable app_user_id');
  }

  const {
    product_id: productId,
    expiration_at_ms: expirationAtMs,
    purchased_at_ms: purchasedAtMs,
  } = event;
  if (
    productId != null &&
    (typeof productId !== 'string' || !productId || productId.length > 200)
  ) {
    return res.status(400).send('Invalid product_id');
  }
  if (expirationAtMs != null && !isMillis(expirationAtMs)) {
    return res.status(400).send('Invalid expiration_at_ms');
  }
  if (purchasedAtMs != null && !isMillis(purchasedAtMs)) {
    return res.status(400).send('Invalid purchased_at_ms');
  }

  const isActive = !['CANCELLATION', 'EXPIRATION', 'BILLING_ISSUE'].includes(event.type);

  const update = {
    status: isActive ? 'active' : 'cancelled',
    renewAt: expirationAtMs ?? null,
    startedAt: purchasedAtMs ?? Date.now(),
    provider: 'revenuecat',
    lastEvent: event.type,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  // Events without a product_id (e.g. some cancellations) keep the existing
  // planId via merge — writing `planId: undefined` would make Firestore throw.
  if (productId) {
    update.planId = productId;
  }

  await admin.firestore().doc(`users/${uid}/subscription/current`).set(update, { merge: true });

  return res.status(200).send('OK');
});
