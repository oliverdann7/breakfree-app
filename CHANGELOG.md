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

### Security

- RevenueCat webhook hardening (roadmap Phase 0 §4): `app_user_id` — which is
  interpolated into the Firestore document path — is now validated against a
  Firebase-uid shape, closing a path-manipulation hole where a crafted id
  containing `/` could write another user's subscription doc; `product_id`
  and the `*_at_ms` timestamps are type/format-checked (400 on violation);
  the bearer-token comparison is constant-time. Events without a
  `product_id` no longer attempt to write `planId: undefined` (which real
  Firestore rejects). Authenticated events whose id is well-formed but not
  one of our uids (e.g. RevenueCat anonymous ids) are acknowledged with 200
  and skipped — a 4xx would make RevenueCat retry them forever — while
  nothing outside the uid shape ever reaches the Firestore path. +6 webhook
  tests.
- Completed the Vercel security headers (roadmap Phase 0 §4):
  `Content-Security-Policy` (script-src 'self' verified against the built
  web bundle — one external self-hosted script, no inline scripts; style
  needs 'unsafe-inline' for the Expo reset style + react-native-web runtime
  injection; connect/frame/img/font sources enumerated from actual usage:
  Firebase, formsubmit.co, YouTube, Mux, Google Fonts), `X-Frame-Options:
DENY`, `Strict-Transport-Security`, and a restrictive `Permissions-Policy`.

### Fixed

- **TalksListScreen crashed on the first realtime snapshot** whenever
  Firestore was configured: `realtimeTalksUpdate` was defined in `talksSlice`
  but never exported, so the screen imported `undefined` and the `onSnapshot`
  callback threw. Exported the action + regression test.
- Silent 401 sign-out (roadmap §1.3 "mixed error handling"): when the API's
  token refresh fails, the interceptor now dispatches a new
  `auth/sessionExpired` action after logout settles, clearing the session but
  leaving a localized "session expired" message that LoginScreen's existing
  error box displays — previously the user was bounced to login with no
  explanation.
- Added missing `dispatch` to `useEffect` dependency arrays in MentorScreen and
  VideoPlayerScreen (roadmap §1.4).

### Added

- Fetch cache TTLs (roadmap §1.3, closing the resilience line): the videos
  catalog, mentor directory, and the talks non-realtime fetch path now skip
  refetching for 5 minutes after a successful fetch (`condition` on the
  thunks, backed by pure `is*CacheFresh` helpers), so re-visiting a tab no
  longer refires the same Firestore query. A grown pagination window or
  `{ force: true }` always bypasses the cache; realtime listeners are
  unaffected. +12 slice tests.
- `npm audit --omit=dev --audit-level=high` now gates CI (roadmap Phase 0
  §3 dependency scanning). Getting it green meant remediating 13 high
  advisories in the production tree: `npm audit fix` cleared most (ws,
  axios, form-data, nanoid, js-yaml, ...), and a package.json `overrides`
  pin dedupes metro/metro-config/metro-transform-worker to ^0.84.5 (the
  patched line, already within react-native's declared `^0.84.3` range),
  which also removes the vulnerable image-size copy. 15 moderate expo-chain
  advisories remain below the gate; they clear with the next Expo SDK
  upgrade.
- Failed Firestore writes now surface to the user (roadmap §1.3 "retry +
  user feedback on writes"): a new dependency-free toast
  (`components/common/Toast.js` — imperative `showToast` + a `ToastHost`,
  with a11y live-region/alert semantics) shows a localized "couldn't save"
  message whenever a fire-and-forget write rejects. The host is mounted at
  the native root and at the real web root (`web.js` — `src/WebApp.jsx` is
  the unreachable legacy web branch), and the toast pins to the viewport on
  web (`position: fixed`) since the web app scrolls the document. Wired
  into posts, comments, likes, challenge joins, talk joins and profile
  saves on native and web; on native, posts, comments and profile saves
  offer a one-tap retry that re-dispatches the same write.
  TalkDetailScreen's "joined" alert now waits for the join write to settle
  instead of confirming unconditionally. New `common.writeFailed` key
  (tr/en). +4 Toast component tests.
- Talks and videos pagination (roadmap §1.3, closing the pagination line):
  both lists previously queried their whole Firestore collection. The talks
  realtime listener and the videos fetch now run with a windowed `limit`
  (`TALKS_PAGE_SIZE` / `VIDEOS_PAGE_SIZE`, 20) that grows as the user nears
  the end of the scroll — the same pattern the community feed uses — with
  `hasMore*`/`loadingMore*` state, a footer spinner, and back-compat for the
  legacy bare-array payloads. +4 slice tests.
- Video watch progress now survives cold starts (roadmap §1.3): a new
  `fetchWatchProgress` thunk hydrates the in-memory progress map from the
  `users/{uid}/watched_videos` documents that `saveWatchProgress` was already
  writing (the restore half was missing — the videos slice is not
  redux-persisted). VideoFeedScreen dispatches it once the signed-in uid is
  known; fresher in-session values win over the fetched snapshot. The map
  is uid-scoped: it is cleared on logout and replaced (not merged) when the
  fetch is for a different account, so one user's positions can never bleed
  into — or be saved over — another's on a shared device. +4 slice tests.
- i18n screen sweep completed (roadmap C4, step 2): the last three unwired
  screens — MentorDirectoryScreen, MentorDetailScreen and VideoFeedScreen —
  now render all UI chrome via `useTranslation()`, covering headers, search,
  category chips, empty states, booking CTAs/alerts and day labels (with
  locale-aware short dates via the active i18n language). Data-derived
  category values (Firestore content, e.g. video/mentor categories used as
  filter sentinels) intentionally stay untranslated, matching the sweep's
  convention. Missing `mentor.*` / `video.*` keys added to both locale files
  (tr/en key parity verified); MentorDetailScreen tests updated to the
  key-assertion convention used by the other screen tests.
- i18n locale foundation (roadmap C4, step 1 — unblocks the string sweep):
  device-locale detection at startup (`getDeviceLocales` — browser languages on
  web, guarded `Intl` on native) and a pure, tested `resolveLocale` helper
  (saved choice → device locale → TR default). The user's saved language is now
  **restored on every cold start** via `syncLanguage` in `App` — previously the
  app reset to Turkish on launch regardless of the saved preference.
  `preferences.language` gains an `'auto'` sentinel (follow device) distinct
  from an explicit `'tr'`/`'en'`; the Settings toggle drives off the active i18n
  language. +9 `resolveLocale` unit tests.
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
- featureFlags constant for staged rollout, override via `EXPO_PUBLIC_FF_*`

### Added — Phase 3 (Sprints 11–13)

- Offline mirror: offlineStore.js (expo-sqlite wrapper for health_metrics,
  talks_cache, draft_posts) behind featureFlags.offlineMode
- Image CDN: imageCdn.js URL builder (Cloudinary/Imgix) + LazyImage component
- Request batcher: N-to-1 fetchMany coalescer
- Feedback: feedbackService.js with submitFeedback + dynamic shake listener
- Sentry wrapper: queue-buffered captureException/Message/Breadcrumb/setUser
  pending DSN
- Remote Config: featureFlags-backed get/getBool/getNumber with sensible defaults
- Apple + Google sign-in: signInWithCredential glue via
  `expo-apple-authentication` + `@react-native-google-signin`

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
