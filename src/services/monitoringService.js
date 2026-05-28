let analytics = null;
let analyticsSupported = false;
let initPromise = null;

function initAnalytics() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const { getAnalytics, isSupported } = await import('firebase/analytics');
      analyticsSupported = await isSupported();
      if (analyticsSupported) {
        const { app } = await import('./firebase');
        if (app) {
          analytics = getAnalytics(app);
        }
      }
    } catch (e) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn('[Analytics] initialization skipped:', e.message);
      }
    }
  })();
  return initPromise;
}

export const logAnalyticsEvent = async (eventName, eventParams = {}) => {
  await initAnalytics();
  if (analytics) {
    try {
      const { logEvent } = await import('firebase/analytics');
      logEvent(analytics, eventName, eventParams);
    } catch (e) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn('[Analytics] logEvent failed:', e.message);
      }
    }
  } else if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.log('[Analytics]', eventName, eventParams);
  }
};

export const setAnalyticsUserId = async (uid) => {
  await initAnalytics();
  if (analytics && uid) {
    try {
      const { setUserId } = await import('firebase/analytics');
      setUserId(analytics, uid);
    } catch (e) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn('[Analytics] setUserId failed:', e.message);
      }
    }
  }
};

export const logError = async (error, context = {}) => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.error('[Error logged to Firebase]:', error?.message || error, context);
  }

  try {
    const { db } = await import('./firebase');
    if (!db) return;

    const { addDoc, collection } = await import('firebase/firestore');
    await addDoc(collection(db, 'error_logs'), {
      message: error?.message || String(error),
      name: error?.name || 'Error',
      stack: error?.stack || null,
      context: JSON.stringify(context),
      timestamp: Date.now(),
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'mobile',
      appVersion: '1.0.0',
    });
  } catch {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn('[Monitoring] Failed to log error to Firestore.');
    }
  }
};

export const logCrashReport = async (error, errorInfo = {}) => {
  await logError(error, { ...errorInfo, type: 'crash' });
  await logAnalyticsEvent('app_crash', {
    error_message: error?.message?.substring(0, 200),
    component_stack: errorInfo?.componentStack?.substring(0, 500),
  });
};

export const trackScreenView = (screenName) => {
  logAnalyticsEvent('screen_view', { screen_name: screenName });
};

export const trackUserAction = (action, params = {}) => {
  logAnalyticsEvent('user_action', { action, ...params });
};

export { analytics, analyticsSupported };
