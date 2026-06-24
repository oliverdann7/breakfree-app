// Lightweight stand-in for `firebase-functions` used by the unit suite.
// Trigger builders (`onRequest`, `onCall`, `firestore.document().onCreate`,
// `pubsub.schedule().onRun`, …) just return the raw handler so tests can invoke
// it directly with synthetic args. `config()` is controllable via __setConfig.

class HttpsError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = 'HttpsError';
  }
}

let _config = {};

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

module.exports = {
  __setConfig: (cfg) => {
    _config = cfg || {};
  },
  __resetConfig: () => {
    _config = {};
  },
  config: () => _config,
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
