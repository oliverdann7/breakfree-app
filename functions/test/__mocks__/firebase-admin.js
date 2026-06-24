// Lightweight stand-in for `firebase-admin`. Exposes the jest.fn()s the
// functions touch (`firestore().doc/collection/runTransaction`, `auth()`,
// `storage()`) via `admin.__api` so each test can program return values and
// assert on calls. Call `admin.__reset()` in beforeEach.

const firestoreApi = {
  doc: jest.fn(),
  collection: jest.fn(),
  runTransaction: jest.fn(),
};

const firestore = jest.fn(() => firestoreApi);
firestore.FieldValue = { serverTimestamp: jest.fn(() => 'SERVER_TS') };

const authApi = { updateUser: jest.fn() };
const storageApi = { bucket: jest.fn() };

module.exports = {
  initializeApp: jest.fn(),
  firestore,
  auth: jest.fn(() => authApi),
  storage: jest.fn(() => storageApi),
  __api: { firestoreApi, authApi, storageApi },
  __reset() {
    firestoreApi.doc.mockReset();
    firestoreApi.collection.mockReset();
    firestoreApi.runTransaction.mockReset();
    authApi.updateUser.mockReset().mockResolvedValue(undefined);
    storageApi.bucket.mockReset();
    firestore.mockClear();
    firestore.FieldValue.serverTimestamp.mockClear();
  },
};
