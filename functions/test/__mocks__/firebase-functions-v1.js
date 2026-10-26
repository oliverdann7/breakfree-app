// Lightweight stand-in for `firebase-functions/v1` used by the unit suite.
// Trigger builders (`onRequest`, `onCall`, `firestore.document().onCreate`,
// `pubsub.schedule().onRun`, …) just return the raw handler so tests can invoke
// it directly with synthetic args. Configuration comes from process.env, as in
// production; there is deliberately no `config()` (removed in
// firebase-functions v7), so any regression to it fails the suite.

class HttpsError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'HttpsError';
  }
}

function documentBuilder() {
  return {
    onCreate: (handler) => handler,
    onWrite: (handler) => handler,
    onUpdate: (handler) => handler,
    onDelete: (handler) => handler,
  };
}

function scheduleBuilder() {
  const builder = {
    timeZone: () => builder,
    onRun: (handler) => handler,
  };
  return builder;
}

const functions = {
  // runWith({ secrets, ... }) returns the same builder surface.
  runWith: () => functions,
  https: {
    HttpsError,
    onRequest: (handler) => handler,
    onCall: (handler) => handler,
  },
  firestore: {
    document: () => documentBuilder(),
  },
  pubsub: {
    schedule: () => scheduleBuilder(),
  },
};

module.exports = functions;
