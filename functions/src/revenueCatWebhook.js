const functions = require('firebase-functions');
const admin = require('firebase-admin');

const VALID_TYPES = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'CANCELLATION',
  'EXPIRATION',
  'BILLING_ISSUE',
  'NON_RENEWING_PURCHASE',
]);

// HTTPS endpoint receiving RevenueCat webhook events.
// Secure via Authorization: Bearer <REVENUECAT_WEBHOOK_TOKEN> shared secret.
exports.revenueCatWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const token =
    functions.config().revenuecat?.webhook_token || process.env.REVENUECAT_WEBHOOK_TOKEN;
  const auth = req.get('Authorization') || '';
  if (!token || auth !== `Bearer ${token}`) {
    return res.status(401).send('Unauthorized');
  }

  const event = req.body?.event;
  if (!event || !VALID_TYPES.has(event.type)) {
    return res.status(400).send('Invalid event');
  }

  const uid = event.app_user_id;
  if (!uid) {
    return res.status(400).send('Missing app_user_id');
  }

  const isActive = !['CANCELLATION', 'EXPIRATION', 'BILLING_ISSUE'].includes(event.type);

  await admin
    .firestore()
    .doc(`users/${uid}/subscription/current`)
    .set(
      {
        planId: event.product_id,
        status: isActive ? 'active' : 'cancelled',
        renewAt: event.expiration_at_ms || null,
        startedAt: event.purchased_at_ms || Date.now(),
        provider: 'revenuecat',
        lastEvent: event.type,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

  return res.status(200).send('OK');
});
