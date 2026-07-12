// Firestore security-rules suite. Runs against the Firestore emulator via
// `npm run test:rules` (firebase emulators:exec) — NOT part of `npm test`,
// which the root jest config keeps app-only by ignoring /rules-tests/.
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  transform: {},
  testTimeout: 15000,
};
