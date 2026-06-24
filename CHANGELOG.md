# Changelog

All notable changes to BreakFree. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Versions follow SemVer; stores use `versionCode` (Android) / `buildNumber`
(iOS) bumped per submission.

## [Unreleased] — closeout of Phase 2 + Phase 3 scaffolding

### Changed
- Extracted a shared `Avatar` component (`components/common/Avatar.js`),
  replacing three near-identical local implementations in HealthStatusCard,
  LeaderboardCard and CommunityScreen (roadmap §1.4 cleanup). The shared
  component carries an `accessibilityLabel` (defaulting to the user's name),
  a small step toward the §1.3 accessibility gap.

### Removed
- Deleted the unused `BreakFreeAppPreview.jsx` / `BreakFreeAppPreviewInline.jsx`
  preview mockups (~4,350 lines of dead code, no imports anywhere; roadmap §1.4).

### Fixed
- Added missing `dispatch` to `useEffect` dependency arrays in MentorScreen and
  VideoPlayerScreen (roadmap §1.4).

### Added
- Community feed infinite scroll (roadmap §1.3): the realtime listener now
  grows its window by `POSTS_PAGE_SIZE` (20) each time the user reaches the end
  of the list, instead of hard-capping at the newest 20 posts. Pagination state
  (`hasMorePosts`, `loadingMorePosts`) lives in `communitySlice`; the feed shows
  a loading spinner while fetching and an "Akışın sonuna ulaştın" marker at the
  end. `fetchPosts` accepts `{ uid, pageSize }` (bare-uid calls still work).
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
- Cloud Functions unit suite (32 tests, 7 files): rate limiter, RevenueCat
  webhook, Agora token mint, leaderboard recompute + trigger, KVKK/GDPR
  privacy export/delete, scheduled backup, and push fan-out. Runs with
  hand-written firebase-admin / firebase-functions / agora-token mocks (no
  emulator), 99% statement / 100% line coverage. Wired into `functions-ci.yml`
  (`npm run test:coverage`) and a `functions/jest.config.js`. Closes the
  roadmap §1.3 "Cloud Functions have zero tests" gap.

### Fixed
- `functions/package.json` was missing `google-auth-library`, a runtime
  `require` in `scheduledBackup` — added to dependencies.

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
