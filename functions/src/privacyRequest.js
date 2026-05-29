const functions = require('firebase-functions');
const admin = require('firebase-admin');

// KVKK / GDPR — when a user submits a privacy request, fulfill it server-side.
// type = 'export' → assemble JSON of all user-owned docs to Storage and email link.
// type = 'delete' → cascade-delete user data per retention policy.
exports.processPrivacyRequest = functions.firestore
  .document('users/{uid}/privacy_requests/{requestId}')
  .onCreate(async (snap, context) => {
    const { uid } = context.params;
    const request = snap.data();
    const db = admin.firestore();

    try {
      if (request.type === 'export') {
        const userDoc = await db.doc(`users/${uid}`).get();
        const data = { profile: userDoc.data(), collections: {} };

        for (const sub of ['health_metrics', 'mentorship_sessions', 'notifications']) {
          const subSnap = await db.collection(`users/${uid}/${sub}`).get();
          data.collections[sub] = subSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        }

        const bucket = admin.storage().bucket();
        const file = bucket.file(`privacy_exports/${uid}/${Date.now()}.json`);
        await file.save(JSON.stringify(data, null, 2), {
          contentType: 'application/json',
        });
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 3600_000,
        });

        await snap.ref.update({ status: 'completed', exportUrl: url, completedAt: Date.now() });
      } else if (request.type === 'delete') {
        // Soft-tombstone first; nightly job purges after 30d cooling-off.
        await db.doc(`users/${uid}`).update({
          deletionRequestedAt: admin.firestore.FieldValue.serverTimestamp(),
          accountStatus: 'pending_deletion',
        });
        await admin.auth().updateUser(uid, { disabled: true });
        await snap.ref.update({ status: 'pending_cooloff', completedAt: Date.now() });
      } else {
        await snap.ref.update({ status: 'error', error: 'Unknown request type' });
      }
    } catch (err) {
      console.error('Privacy request failed', err);
      await snap.ref.update({ status: 'error', error: err.message });
    }
    return null;
  });
