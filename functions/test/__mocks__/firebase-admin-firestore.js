// firebase-admin/firestore → shares state with the firebase-admin mock, so
// tests keep programming `admin.__api.firestoreApi` as before.
const admin = require('./firebase-admin');

module.exports = { getFirestore: admin.firestore, FieldValue: admin.firestore.FieldValue };
