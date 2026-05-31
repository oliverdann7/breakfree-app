// Health service — abstraction over Apple HealthKit (iOS) and Google Fit (Android).
// Native modules (react-native-health, react-native-google-fit) are not installed yet;
// this stub returns mock data so the rest of the app can integrate now.
// When native modules land, implement the platform branches and remove the mock fallback.

import { Platform } from 'react-native';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

// Native bridge integration seam. Stays null until the native modules
// (react-native-health on iOS, react-native-google-fit on Android) are
// installed and an EAS dev build is produced. To wire real data, set this to
// an object implementing { requestPermissions(sourceId, os), getDailyMetrics(
// sourceId, os) } — e.g. in a platform-specific healthBridge.native.js loaded
// here. Until then every reader below falls back to mockSample() so the rest
// of the app integrates against a stable shape.
const NATIVE_BRIDGE = null;

const mockSample = () => ({
  sleep: { hours: 7.2, quality: 'good', startedAt: Date.now() - 8 * 3600_000 },
  steps: 8420,
  heartRate: { resting: 62, current: 78, max24h: 142 },
  calories: { active: 412, total: 2180 },
  hydration: 1600,
  mood: 7,
  syncedAt: Date.now(),
});

export const healthSources = {
  appleHealth: { id: 'appleHealth', name: 'Apple Health', platform: 'ios' },
  googleFit: { id: 'googleFit', name: 'Google Fit', platform: 'android' },
  garmin: { id: 'garmin', name: 'Garmin Connect', platform: 'all' },
};

export async function requestPermissions(source) {
  // Delegates to AppleHealthKit.initHealthKit / GoogleFit.authorize via the
  // native bridge when installed; mock-grants otherwise so onboarding flows.
  if (NATIVE_BRIDGE && isNative) {
    return NATIVE_BRIDGE.requestPermissions(source, Platform.OS);
  }
  return { granted: true, mock: true };
}

export async function getDailyMetrics(source) {
  // Reads from the platform's native module (iOS HealthKit / Android Google
  // Fit) via the bridge when available; falls back to a mock sample.
  if (NATIVE_BRIDGE && isNative) {
    return NATIVE_BRIDGE.getDailyMetrics(source, Platform.OS);
  }
  return mockSample();
}

export async function getWeeklyMetrics(_source) {
  const days = 7;
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 86_400_000).toISOString().slice(0, 10),
    ...mockSample(),
  }));
}

export async function disconnect(_source) {
  return { ok: true };
}

export function getAvailableSources() {
  if (Platform.OS === 'ios') return [healthSources.appleHealth, healthSources.garmin];
  if (Platform.OS === 'android') return [healthSources.googleFit, healthSources.garmin];
  return [healthSources.garmin]; // web
}

export const __isMock = !NATIVE_BRIDGE || !isNative; // true until the native bridge is wired
