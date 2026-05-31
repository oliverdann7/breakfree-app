// Feature flags for staged rollout across Phase 1 → Phase 3.
// Default off; flip to true when backend + accounts are ready.
// Override locally via EXPO_PUBLIC_FF_* env vars (string "true").

const envFlag = (name, fallback = false) => {
  const v = process.env[`EXPO_PUBLIC_FF_${name}`];
  if (v == null) return fallback;
  return v === 'true' || v === '1';
};

export const featureFlags = {
  // Phase 2
  liveAudioTalks: envFlag('LIVE_AUDIO', false), // Agora SDK
  wearableSync: envFlag('WEARABLE_SYNC', false), // HealthKit / Google Fit
  mentorBooking: envFlag('MENTOR_BOOKING', true), // mentor list + detail + booking
  challengesV2: envFlag('CHALLENGES_V2', true), // dedicated challenges/leaderboard screens
  premiumSubscription: envFlag('PREMIUM', false), // Stripe / RevenueCat
  // Dev-only: let `subscribe` return a local, non-persisted "active" sub so the
  // Pro UI can be exercised before the native IAP SDK lands. Never grants real
  // entitlement — subscription docs are written server-side by the webhook only.
  mockPremiumPurchase: envFlag('MOCK_PREMIUM', __DEV__ ?? false),
  pushNotifications: envFlag('PUSH', true), // expo-notifications

  // Phase 3
  offlineMode: envFlag('OFFLINE', false), // SQLite mirror
  dataExport: envFlag('DATA_EXPORT', true), // KVKK/GDPR
  accountDeletion: envFlag('ACCOUNT_DELETE', true),

  // Dev
  debugMenu: envFlag('DEBUG_MENU', __DEV__ ?? false),
};

export function isEnabled(flag) {
  return Boolean(featureFlags[flag]);
}
