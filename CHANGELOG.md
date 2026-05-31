# Changelog

All notable changes to BreakFree. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Versions follow SemVer; stores use `versionCode` (Android) / `buildNumber`
(iOS) bumped per submission.

## [Unreleased] — closeout of Phase 2 + Phase 3 scaffolding

### Added
- Daily mood + hydration check-in on HealthMetricsScreen: 5-face mood picker
  and a water (cups) field in the log sheet, surfaced as breakdown cards. The
  daily wellness score now uses the canonical weighted algorithm
  (`scoreDailyEntry`) across all five dimensions instead of an ad-hoc
  sleep+steps average, and logging a single field reflects the whole day.
- Dashboard wellness card shows a qualitative status badge
  (Mükemmel/İyi/Orta/Düşük/Dikkat) via the `wellnessLabel` helper, giving the
  numeric ring meaning at a glance.

### Added — Phase 2 (Sprints 5–10)
- Premium subscription: PremiumScreen + premiumSlice (Pro Monthly ₺29.99 /
  Annual ₺299.99), 7-day trial, RevenueCat webhook ingest in Cloud Functions
- Challenges + Leaderboard: dedicated ChallengesScreen, LeaderboardScreen,
  badges engine (10 rules), leaderboard cache via `onMetricUpdated` Cloud Function
- Mentor directory: 7 seed mentors, MentorDirectoryScreen (search + categories),
  MentorDetailScreen (7-day calendar + hourly slot picker + booking write)
- Wellness score algorithm: sleep 30% + activity 25% + HR 20% + hydration
  15% + mood 10% per roadmap §2.1
- healthSlice + healthService.js: Apple Health / Google Fit / Garmin
  abstraction (mock fallback until native modules install)
- notificationsSlice + NotificationsScreen: in-app notification center,
  mark-read, mark-all-read, Expo push fan-out via Cloud Function
- featureFlags constant for staged rollout, override via EXPO_PUBLIC_FF_*

### Added — Phase 3 (Sprints 11–13)
- Offline mirror: offlineStore.js (expo-sqlite wrapper for health_metrics,
  talks_cache, draft_posts) behind featureFlags.offlineMode
- Image CDN: imageCdn.js URL builder (Cloudinary/Imgix) + LazyImage component
- Request batcher: N-to-1 fetchMany coalescer
- Feedback: feedbackService.js with submitFeedback + dynamic shake listener
- Sentry wrapper: queue-buffered captureException/Message/Breadcrumb/setUser
  pending DSN
- Remote Config: featureFlags-backed get/getBool/getNumber with sensible defaults
- Apple + Google sign-in: signInWithCredential glue via expo-apple-authentication
  + @react-native-google-signin

### Added — Infrastructure
- Cloud Functions: mintAgoraToken, revenueCatWebhook, recomputeLeaderboard,
  scheduledBackup, onNotificationCreated, processPrivacyRequest, with
  firebase.json emulator config
- KVKK / GDPR: PrivacyScreen with data export + 30-day cool-off delete;
  PRIVACY.md, TERMS.md, KVKK.md ready to host at /legal
- Web routes: /legal (markdown viewer) and /admin (4-tab CRUD CMS,
  allowlist gated)
- CI: functions-ci.yml lints Cloud Functions; eas-preview.yml manual build
- E2E: 10 Maestro flows (signup, login, dashboard, challenges, premium,
  mentor, mentor-book, privacy-export, notifications, talk-join)
- App Store: TR + EN metadata (title/subtitle/description/keywords),
  screenshot SPEC.md, legal markdown

### Tests
- 43 new unit tests covering wellnessScore, badges, premiumSlice,
  healthSlice, notificationsSlice, imageCdn, requestBatcher — all passing

### Docs
- docs/RUNBOOK.md — on-call, severity classes, hotfix flow, rollback,
  common incidents, schema-change policy, backup/restore, quotas, contacts
- docs/PERF_BUDGETS.md — 11 perf metrics with CI enforcement strategy
- docs/STAGED_ROLLOUT.md — Internal → 10% → 50% → 100% phased release

### Requires (operator action before release)
- Firebase production keys → .env.local
- Agora app ID + certificate → `firebase functions:config:set agora.*`
- RevenueCat product config + webhook token
- Apple Developer + Google Play Console accounts + EXPO_TOKEN secret
- Firebase Blaze plan to deploy Cloud Functions
- Native modules: `npm i react-native-health react-native-google-fit
  react-native-agora @stripe/stripe-react-native expo-sqlite expo-image
  expo-shake expo-apple-authentication @react-native-google-signin/google-signin
  sentry-expo` then EAS dev build
- Sentry DSN → EXPO_PUBLIC_SENTRY_DSN
- Cloudinary / Imgix CDN → EXPO_PUBLIC_CLOUDINARY_BASE
- VERBİS registration for KVKK
- App Store screenshots captured from EAS preview build
- Staged rollout per docs/STAGED_ROLLOUT.md

---

## Prior history

See git log for entries before this changelog was introduced — notable
milestones: Phase 1 MVP shell complete, production readiness merged
(monitoring, error boundaries, component tests), Vercel auto-deploy live,
mentor + community + talks Firebase wiring.
