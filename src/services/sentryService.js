// Sentry initialization wrapper. Reads DSN from EXPO_PUBLIC_SENTRY_DSN at
// runtime so the native module install can come later without code churn.
// When the DSN or module is missing, this is a no-op (queue is intentional —
// in tests the queue is the assertion target).

const queue = [];
let SentryNS = null;

const DSN_KEY = 'EXPO_PUBLIC_SENTRY_DSN';
const ENV_KEY = 'EXPO_PUBLIC_SENTRY_ENV';

const getDsn = () => process.env[DSN_KEY];
const getEnv = () => process.env[ENV_KEY] || 'production';

export async function initSentry({ release } = {}) {
  const dsn = getDsn();
  if (!dsn) return false;

  try {
    SentryNS = await import('sentry-expo');
    SentryNS.init({
      dsn,
      enableInExpoDevelopment: false,
      debug: false,
      environment: getEnv(),
      release,
      tracesSampleRate: 0.2,
      integrations: [],
    });
    flush();
    return true;
  } catch {
    // sentry-expo not installed yet — keep queuing.
    return false;
  }
}

function flush() {
  if (!SentryNS) return;
  while (queue.length) {
    const item = queue.shift();
    try {
      if (item.kind === 'exception') {
        SentryNS.Native?.captureException(item.error, { extra: item.context });
      } else if (item.kind === 'message') {
        SentryNS.Native?.captureMessage(item.message, item.level || 'info');
      } else if (item.kind === 'breadcrumb') {
        SentryNS.Native?.addBreadcrumb(item.breadcrumb);
      } else if (item.kind === 'user') {
        SentryNS.Native?.setUser(item.user);
      }
    } catch {
      // intentional no-op
    }
  }
}

export function captureException(error, context = {}) {
  if (SentryNS?.Native) {
    SentryNS.Native.captureException(error, { extra: context });
  } else {
    queue.push({ kind: 'exception', error, context });
  }
}

export function captureMessage(message, level = 'info') {
  if (SentryNS?.Native) {
    SentryNS.Native.captureMessage(message, level);
  } else {
    queue.push({ kind: 'message', message, level });
  }
}

export function addBreadcrumb(breadcrumb) {
  if (SentryNS?.Native) {
    SentryNS.Native.addBreadcrumb(breadcrumb);
  } else {
    queue.push({ kind: 'breadcrumb', breadcrumb });
  }
}

export function setUser(user) {
  if (SentryNS?.Native) {
    SentryNS.Native.setUser(user);
  } else {
    queue.push({ kind: 'user', user });
  }
}

// Test helpers
export const __pendingQueue = () => [...queue];
export const __reset = () => {
  SentryNS = null;
  queue.length = 0;
};
