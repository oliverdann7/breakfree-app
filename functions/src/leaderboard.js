const functions = require('firebase-functions/v1');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Triggered when a challenge participant's progress changes.
// Updates the cached leaderboard doc for fast reads from the app.
exports.onMetricUpdated = functions.firestore
  .document('challenge_participants/{docId}')
  .onWrite(async (change, _context) => {
    const after = change.after.exists ? change.after.data() : null;
    if (!after?.challengeId) return null;
    return recompute(after.challengeId);
  });

// Manual recompute callable (admin only). `isAdmin` is the one admin custom
// claim used everywhere (firestore.rules isAdmin(), AdminPage, set-admin script).
exports.recomputeLeaderboard = functions.https.onCall(async (data, context) => {
  if (context.auth?.token?.isAdmin !== true) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }
  const { challengeId } = data || {};
  if (!challengeId) {
    throw new functions.https.HttpsError('invalid-argument', 'challengeId required');
  }
  await recompute(challengeId);
  return { ok: true, challengeId };
});

async function recompute(challengeId) {
  const db = getFirestore();
  const snap = await db
    .collection('challenge_participants')
    .where('challengeId', '==', challengeId)
    .orderBy('currentProgress', 'desc')
    .limit(100)
    .get();

  const entries = await Promise.all(
    snap.docs.map(async (d, idx) => {
      const data = d.data();
      const userSnap = await db.doc(`users/${data.uid}`).get();
      const user = userSnap.data() || {};
      return {
        rank: idx + 1,
        uid: data.uid,
        value: data.currentProgress || 0,
        name: user.nickname || user.displayName || 'Üye',
        avatarEmoji: user.avatarEmoji || '🧘',
        avatarBg: user.avatarBg || '#0072B0',
      };
    })
  );

  await db.doc(`leaderboards/${challengeId}`).set({
    challengeId,
    entries,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
