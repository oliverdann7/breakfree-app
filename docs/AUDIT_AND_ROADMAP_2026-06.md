# BreakFree Türkiye — Full Repo Audit & Master Roadmap (June 2026)

> Mission: **connect people** and be the **content hub for health & wellness in Turkey**.
> This document is the single source of truth going forward. It supersedes the phase
> status claims in CHANGELOG.md where they conflict with verified reality below.

---

## Part 1 — Audit: where the repo actually stands

### 1.1 What is genuinely solid ✅

- **App shell**: 23 screens, React Navigation, Redux Toolkit (11 slices) + redux-persist, design tokens, feature flags.
- **Firebase core**: Auth (email + social scaffolding), Firestore wiring for community, challenges, leaderboard, mentors, talks, profile. ~70% of screens hit real backend.
- **Cloud Functions**: 6+ real implementations (Agora token mint w/ rate limiting, RevenueCat webhook, leaderboard recompute, scheduled backup, KVKK/GDPR privacy requests, push fan-out). No stubs.
- **Security rules**: well-designed owner-only access, server-only subscription writes, `onlyChanges()` guards on likes/listener counts.
- **Quality gates**: CI (lint, typecheck, jest, web build), Husky pre-commit, 26 test files for slices/utils, 10 real Maestro E2E flows, Lighthouse CI, perf budgets doc, ops runbook.
- **Compliance**: KVKK/GDPR export + 30-day delete flow, legal markdown (TR), privacy screens.

### 1.2 Critical gaps 🔴 (block real launch)

| # | Gap | Evidence |
|---|-----|----------|
| C1 | **Health data is always mock** — no native HealthKit/Google Fit modules installed; `healthService.js` is a stub | `src/services/healthService.js` |
| C2 | **Live audio doesn't actually play** — Agora token minting works server-side, but the native Agora SDK is not in the app; no EAS dev build exists (`extra.eas.projectId` empty in `app.json`) | `functions/src/agoraToken.js`, `app.json` |
| C3 | **Payments are mock** — PremiumScreen uses a local mock purchase; RevenueCat SDK not integrated client-side; Stripe/RevenueCat accounts + webhook secret unverified | `src/store/premiumSlice.js`, `functions/src/revenueCatWebhook.js` |
| C4 | **i18n built but unused** — 226-line tr/en locale files exist, but only ProfileScreen calls `useTranslation()`; ~95% of strings hardcoded Turkish. Blocks EN expansion and proper TR consistency | `src/i18n/` |
| C5 | **No production deploy automation** — no workflow deploys functions, firestore rules, or web; rules could drift from what's deployed | `.github/workflows/` |

### 1.3 High-priority issues 🟡

- **Accessibility ~1%**: almost no `accessibilityLabel`s; emoji-only buttons unlabeled. (Lighthouse a11y gate ≥90 applies only to 2 web pages.)
- **No screen/component tests**; videos & talks slices untested; Cloud Functions have zero tests (lint-only CI).
- **Offline mode feature-flagged off** and `expo-sqlite` not installed; video watch progress not persisted.
- **Maestro E2E not in CI** (needs `MAESTRO_API_KEY` + workflow).
- **RevenueCat webhook validation minimal** (no signature/format validation of `product_id`, `expiration_at_ms`).
- **Security headers incomplete** on Vercel (`CSP`, `X-Frame-Options` missing).
- **Firestore rules**: no size/enum guards, no write rate-limiting → spam possible on posts/talks.
- **Mixed error handling**: fire-and-forget Firestore writes, silent 401 refresh failure, single root ErrorBoundary only.
- **Community feed loads only first 20 posts** — no pagination/infinite scroll.

### 1.4 Cleanups 🟢

- Avatar component implemented 3× (CommunityScreen, LeaderboardCard, HealthStatusCard) → extract shared component.
- `BreakFreeAppPreview.jsx` + `BreakFreeAppPreviewInline.jsx` (~4,300 lines) appear unused → confirm and delete.
- `MOCK_VIDEOS` hardcoded in `videosSlice.js` → move to seed script.
- Inconsistent SafeAreaView/loading-state/thunk-error patterns → standardize.
- Missing `dispatch` in some useEffect deps (MentorScreen, VideoPlayerScreen).
- `userParticipation` populated but never rendered in ChallengesScreen.

### 1.5 Docs vs reality

CHANGELOG marks Phases 1–3 "complete", but Phase 2/3 completion means *code exists*, not *validated in the real world*. Everything requiring native builds, third-party accounts (Agora, RevenueCat, Stripe, Apple/Google sign-in credentials), or real users is unverified. The roadmap below is sequenced to close exactly that gap.

---

## Part 2 — Beast-Mode Roadmap

Six phases, ordered by dependency. Each phase has an exit gate — do not start the next phase's headline work until the gate passes. Parallel tracks marked (∥) can run alongside.

### Phase 0 — Make it real (Weeks 1–3): native builds, accounts, deploys
*Nothing else matters until the app runs on a real phone with real services.*

1. **EAS dev build**: `eas init` (fill `extra.eas.projectId`), create iOS/Android dev clients. Add native modules: `react-native-agora`, `react-native-health` / `react-native-google-fit` (or `expo-health-connect`), `@react-native-google-signin/google-signin`, `expo-apple-authentication`, RevenueCat `react-native-purchases`, `expo-sqlite`.
2. **Third-party accounts wired end-to-end**:
   - Agora project → set `agora.app_id`/`app_cert` in Firebase config; join a talk on two devices; verify audio.
   - RevenueCat + App Store Connect / Play Console products (₺ pricing); sandbox purchase → webhook → Firestore subscription doc.
   - Apple Developer + Google Cloud OAuth credentials for social sign-in; verify both on device.
3. **Deploy automation** (∥): `.github/workflows/deploy.yml` — on main merge: deploy functions + firestore rules (Firebase), web (Vercel verified), tag-based EAS production builds. Add `npm audit` / dependency scanning to CI.
4. **Webhook hardening** (∥): RevenueCat signature verification + payload validation; complete Vercel security headers (CSP, X-Frame-Options).

**Exit gate:** On a physical device — sign in with Google, join a live talk and hear audio, complete a sandbox premium purchase, sync one real HealthKit metric. CI deploys on merge.

### Phase 1 — Trustworthy core (Weeks 3–6): data, i18n, resilience

1. **Kill mock fallbacks**: real HealthKit/Google Fit sync behind the existing `healthService` abstraction (graceful empty states when not connected, never fake data). Move talk/video/mentor seed data to an explicit `scripts/seed.js` + Firestore emulator; production never self-seeds.
2. **i18n sweep**: wire `useTranslation()` across all 23 screens + web tabs; extract every hardcoded string into `tr.json`/`en.json`; device-locale detection with TR default; add ESLint rule (`no-literal-strings` style) to prevent regressions.
3. **Resilience**: retry + user feedback on Firestore writes (toast on failure); per-screen error states; fix 401 silent logout; persist video watch progress; cache TTLs for talks/videos/community.
4. **Pagination**: infinite scroll on community feed, talks, videos (cursor-based Firestore queries).
5. **Cleanups batch** (∥): shared Avatar, delete unused preview files, useEffect deps fixes, standardize loading/error patterns, render challenge participation state.

**Exit gate:** No mock data reachable in production builds; language toggle flips the entire app; airplane-mode test shows graceful errors, not silence.

### Phase 2 — Quality & safety net (Weeks 5–8, ∥ with Phase 1 tail)

1. **Tests**: Cloud Functions unit suite (target ≥80% on webhook, privacy, leaderboard, rate limiter) run in `functions-ci.yml`; screen tests for the 6 critical flows (auth, dashboard, premium, talk join, community post, mentor booking); videos/talks slice tests.
2. **Maestro in CI**: add `MAESTRO_API_KEY`, workflow running auth + premium + privacy flows on PRs to main.
3. **Accessibility pass**: labels on all touchables/inputs/emoji buttons, roles, dynamic type sanity, contrast check against design tokens; add a11y lint rule. Target: screen-reader-complete on the 6 critical flows.
4. **Firestore rules hardening**: enum/status validation, doc size guards, per-collection write throttling (rate-limit pattern); rules unit tests with emulator.
5. **Offline v1**: enable `expo-sqlite` offline store for health metrics, talks cache, draft posts (the existing `offlineStore.js` scaffold).

**Exit gate:** CI red on any of: lint, typecheck, unit, functions tests, Maestro core flows. A11y audit of critical flows passes with VoiceOver/TalkBack.

### Phase 3 — Content hub (Weeks 8–14): become THE wellness content destination for Turkey

*This is the product differentiator. Everything before was plumbing.*

1. **Editorial content system**: extend the existing `/admin` CMS into a real content pipeline — articles, programs (multi-week plans), video series, talk recordings. Firestore `content` collection with categories matching Turkish wellness verticals (beslenme, hareket, zihin sağlığı, uyku, bağımlılıkla mücadele).
2. **Talk recordings & replay**: Agora cloud recording → Storage/Mux → playback in VideoPlayer; premium-gated replays (the monetization hook).
3. **Search & discovery**: cross-content search (talks, videos, articles, mentors, people); rules-based "For You" feed using wellness score + interests from onboarding; trending in-Turkey section.
4. **Creator tools**: host application flow, talk scheduling UX, basic creator stats (listeners, replays, follows). Creators are the content flywheel.
5. **Notifications that retain**: talk-starting-soon, mentor message, challenge milestone, streak-at-risk — all respecting quiet hours (already built).
6. **Web SEO** (∥): server-rendered or pre-rendered public pages for talks/articles (Turkish keywords) — the web app becomes the acquisition funnel.

**Exit gate:** A non-technical editor can publish an article + schedule a talk from /admin; a user can discover, attend live, and replay it; public content pages indexed by Google.

### Phase 4 — Connection layer (Weeks 12–18): connect people, not just content

1. **Profiles & follow graph**: public profiles (opt-in, KVKK-consented), follow users/mentors/hosts, followers feed.
2. **Direct messaging**: extend the existing mentor-chat Firestore pattern to user-to-user DMs with consent (request/accept), block & report from day one.
3. **Groups/circles**: interest- and city-based groups (İstanbul koşu, Ankara yoga…) with their own feed, challenges, and talks. City dimension is the Turkey-specific moat.
4. **Events**: in-person event listings with RSVP (scaffold exists), map integration, post-event community threads.
5. **Moderation & safety (non-negotiable before DMs/groups ship)**: report/block on every surface, moderation queue in /admin, Turkish-language content filtering (profanity + self-harm escalation path), KVKK-compliant data handling for messages.
6. **Group challenges**: team leaderboards on top of the existing leaderboard infra.

**Exit gate:** Two strangers can find each other via a group, DM safely, join the same challenge, and attend the same talk. Moderation queue triages reports within the runbook SLA.

### Phase 5 — Monetize & launch (Weeks 16–22)

1. **Premium hardening**: entitlement checks on gated surfaces (replays, mentor sessions/month, advanced analytics), restore purchases, grace periods, family/annual upsell; churn-save flow.
2. **Mentor marketplace economics**: paid 1-on-1 sessions (mentor payout ledger — Stripe Connect or iyzico for TR), session video links (Zoom/Meet integration per API spec).
3. **Local payments**: verify TR store pricing tiers; consider iyzico for web-based purchases where store rules allow.
4. **Launch ops**: staged rollout per `docs/STAGED_ROLLOUT.md` (internal → 10% → 50% → 100%), store metadata/screenshots (specs exist in `store/`), beta program (TestFlight/Play internal, 100→1,000 users), Sentry/Better Stack alerts live per RUNBOOK.
5. **Analytics activation**: verify every event in `BREAKFREE_ANALYTICS_PLAYBOOK.md` actually fires; conversion + retention dashboards; weekly cohort review ritual.

**Exit gate:** Real money flows end-to-end (purchase → entitlement → feature access → renewal webhook); staged rollout at 100% with crash rate <1% and D7 retention measured.

### Phase 6 — Scale & intelligence (Weeks 20+, continuous)

- AI wellness insights (the "AI insight card" becomes real — Claude API over user metrics with consent), AI mentor matching, semantic content recommendations.
- Apple Watch / Wear OS companion; background health sync.
- Performance: list virtualization audit, bundle analysis vs `PERF_BUDGETS.md`, image CDN activation (scaffold exists).
- Corporate wellness (B2B) — Turkish companies as distribution channel.
- Regional expansion groundwork (the i18n work from Phase 1 pays off here).

---

## Part 3 — Operating rules

1. **PRs for everything**; CI must be green; one phase exit gate per milestone review.
2. **Definition of done** = wired to real backend + i18n strings + a11y labels + error states + tests for new logic. No new mock fallbacks, ever.
3. **Weekly cadence**: ship to internal track every Friday (EAS preview); review crash rate + analytics Monday.
4. **Sequencing rationale**: Phase 0 unblocks everything (native+accounts), Phases 1–2 make the foundation trustworthy, Phase 3 builds the content moat, Phase 4 builds the network moat, Phase 5 turns both into revenue. Content before connection because empty social networks die; people come for content, stay for community.

## Part 4 — Immediate next 10 actions (this sprint)

1. `eas init` + dev client builds for iOS/Android (C2).
2. Create Agora project, set Firebase config, device-to-device audio test (C2).
3. RevenueCat account + store products + `react-native-purchases` + sandbox purchase (C3).
4. Apple/Google sign-in credentials configured and tested on device.
5. `deploy.yml` workflow: functions + rules + web on main merge (C5).
6. RevenueCat webhook signature validation + Vercel CSP headers.
7. i18n sweep PR #1: Dashboard, Auth, Community screens (C4).
8. Native health module install + first real HealthKit read (C1).
9. Functions unit-test suite bootstrap + run in CI.
10. Shared Avatar component + delete unused preview files + useEffect dep fixes.
