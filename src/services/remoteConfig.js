// Firebase Remote Config wrapper. Lets ops flip feature flags + adjust
// numbers (paywall price, sample rates, copy variants) without shipping a
// build. Falls back to featureFlags defaults when the SDK can't initialize.

import { featureFlags } from '../constants/featureFlags';

let rc = null;
let lastFetch = null;
const FETCH_INTERVAL_MS = 5 * 60_000; // 5 min — Firebase enforces ≥ 1 hour in prod by default

const DEFAULTS = {
  ...featureFlags,
  paywall_trial_days: 7,
  challenge_carousel_max: 3,
  mentor_directory_pagesize: 12,
  experiment_v1: 'control',
};

export async function initRemoteConfig() {
  try {
    const { getRemoteConfig, fetchAndActivate, getValue } = await import('firebase/remote-config');
    const { app } = await import('./firebase');
    if (!app) return false;

    rc = getRemoteConfig(app);
    rc.settings = { minimumFetchIntervalMillis: FETCH_INTERVAL_MS };
    rc.defaultConfig = stringifyDefaults(DEFAULTS);
    await fetchAndActivate(rc);
    lastFetch = Date.now();

    // Expose getValue for callers below.
    rc.__getValue = (key) => getValue(rc, key);
    return true;
  } catch {
    return false;
  }
}

function stringifyDefaults(defaults) {
  const out = {};
  for (const [k, v] of Object.entries(defaults)) {
    out[k] = typeof v === 'string' ? v : JSON.stringify(v);
  }
  return out;
}

export function get(key) {
  if (rc?.__getValue) {
    const v = rc.__getValue(key);
    const asStr = v?.asString?.() ?? '';
    if (asStr === '') return DEFAULTS[key];
    try {
      return JSON.parse(asStr);
    } catch {
      return asStr;
    }
  }
  return DEFAULTS[key];
}

export function getBool(key) {
  const v = get(key);
  if (typeof v === 'boolean') return v;
  return v === 'true' || v === 1 || v === '1';
}

export function getNumber(key) {
  const v = get(key);
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function getString(key) {
  const v = get(key);
  return typeof v === 'string' ? v : String(v);
}

export function lastFetchTime() {
  return lastFetch;
}

export const __defaults = DEFAULTS;
