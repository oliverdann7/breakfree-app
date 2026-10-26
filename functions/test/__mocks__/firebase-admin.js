// Shared state behind the firebase-admin mocks. The functions use the modular
// API (firebase-admin/app, /firestore, /auth, /storage — v14 has no namespaced
// API); the sibling firebase-admin-*.js mocks re-export these jest.fn()s, and
// tests reach them via `require('firebase-admin').__api` to program return
// values and assert on calls. Call `admin.__reset()` in beforeEach.

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
