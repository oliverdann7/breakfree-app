const functions = require('firebase-functions');
const admin = require('firebase-admin');

// When a notification doc is created at users/{uid}/notifications/{id},
// fan out an Expo push to the user's stored pushToken (if any).
exports.onNotificationCreated = functions.firestore
  .document('users/{uid}/notifications/{id}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    if (notification?.silent) return null;

    const userSnap = await admin.firestore().doc(`users/${context.params.uid}`).get();
    const token = userSnap.data()?.pushToken;
    if (!token) return null;

    const payload = {
      to: token,
      sound: 'default',
      title: notification.title || 'BreakFree',
      body: notification.body || '',
      data: notification.data || {},
    };

    try {
      const res = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'accept-encoding': 'gzip, deflate',
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      console.log('Expo push result', result);
    } catch (err) {
      console.error('Push send failed', err);
    }
    return null;
  });
