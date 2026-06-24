// Standalone Jest config for Cloud Functions unit tests. Runs in a Node
// environment with no Babel transform (the functions are plain CommonJS that
// Node 20 understands natively). External SDKs are redirected to hand-written
// mocks so tests never touch the network or real Firebase.
module.exports = {
  testEnvironment: 'node',
  rootDir: __dirname,
  testMatch: ['<rootDir>/test/**/*.test.js'],
  moduleNameMapper: {
    '^firebase-admin$': '<rootDir>/test/__mocks__/firebase-admin.js',
    '^firebase-functions$': '<rootDir>/test/__mocks__/firebase-functions.js',
    '^agora-token$': '<rootDir>/test/__mocks__/agora-token.js',
    '^google-auth-library$': '<rootDir>/test/__mocks__/google-auth-library.js',
  },
  transform: {},
  collectCoverageFrom: ['src/**/*.js'],
};
