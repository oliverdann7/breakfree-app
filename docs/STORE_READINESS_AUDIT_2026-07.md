# iOS & Android Store-Readiness Audit — July 2026

Full audit of the native (iOS/Android) app against Apple App Store and Google
Play submission requirements, plus the fixes shipped alongside it. Companion
docs: `store/SUBMISSION_RUNBOOK.md` (account-side steps),
`store/APPLE_PRIVACY_LABELS.md`, `store/PLAY_DATA_SAFETY.md`.

**Verdict before this audit: neither store would have accepted the app, and
the binary would have crashed at launch on every device.** All code-side
blockers are fixed in this branch; the remaining work is account wiring
(Apple/Google/EAS/Firebase consoles) listed in the runbook.

---

## Launch blockers found & fixed

| # | Severity | Finding | Fix |
| --- | --- | --- | --- |
| 1 | 🔴 Crash on launch | `index.js` picked the entry with `typeof window` — React Native defines `global.window`, so **phones booted the web app** (raw DOM components) and crashed immediately. `web.js` also self-registered, double-registering the root. | `Platform.OS` split in `index.js`; single registration. |
| 2 | 🔴 Crash on launch | redux-persist used `localStorage` on native (same inverted guard) → `ReferenceError` at first rehydrate. | AsyncStorage everywhere (its web build is localStorage-backed, keys unchanged). |
| 3 | 🔴 Dead login buttons | Google/Apple sign-in used Firebase **web popup** (`signInWithPopup`), which throws on React Native. The correct native implementation existed in `socialSignIn.js` but nothing imported it. | Platform-split in `authService`; native path wired; `@react-native-google-signin/google-signin` + `expo-apple-authentication` installed; Apple entitlement added (`usesAppleSignIn`). |
| 4 | 🔴 Build failure | `sentryService` imported `sentry-expo` — not installed and deprecated → `eas build` would fail Metro resolution. | Migrated to `@sentry/react-native` (installed + config plugin). |
| 5 | 🔴 Play rejection | Expo SDK 51 targets Android API 34; Play requires 35+ now and 36 from Aug 31, 2026. Apple requires Xcode 16+ SDK builds. | **Upgraded Expo SDK 51 → 56** (RN 0.85, React 19, Reanimated 4, expo-av→expo-video, Firebase 12). `expo-doctor` 21/21, prebuild validated both platforms. |

## Store-approval blockers found & fixed

| # | Guideline | Finding | Fix |
| --- | --- | --- | --- |
| 6 | Apple 5.1.1 | Camera/photo/mic purpose strings + Android `CAMERA`/`RECORD_AUDIO`/storage permissions declared for features that don't exist. | Removed; `blockedPermissions` added so no library re-injects them (verified stripped in generated AndroidManifest). |
| 7 | Apple 2.1/3.1.1 | Reachable paywall (₺29.99/₺299.99) whose purchase button always fails — no IAP SDK installed. | Premium routes + video locks gated behind `premiumSubscription` flag (off). All content free until RevenueCat ships. Store descriptions no longer mention Pro pricing. |
| 8 | Apple 2.3.1 / Play metadata | Listings promised live audio, Apple Health/Google Fit/Garmin sync, mentor video calls, free trial — none shipped. Keywords exceeded Apple's 100-char limit. | Descriptions rewritten to shipped features; keywords ≤100; Play short descriptions (≤80) added TR+EN. |
| 9 | Silent push failure | `getExpoPushTokenAsync()` called without `projectId` (empty in app.json) and the error swallowed — push would never work in production. No Android notification channel (required 8+). | projectId passed from `expo-constants`; `default` channel created; failure now logged. `eas init` still required (runbook). |
| 10 | Export compliance | No `usesNonExemptEncryption` declaration → manual questionnaire every submission. | `ios.config.usesNonExemptEncryption: false`. |
| 11 | Deep linking | No `scheme` in app.json; `expo-linking` unused; NavigationContainer had no `linking`; notification-tap routing written but never wired. | `scheme: "breakfree"`, linking prefixes, `navigationRef` + response handler wired in `RootNavigator`. |

## Also fixed

- **Device locale detection never worked on native** (same `typeof window`
  bug) — replaced with `expo-localization`; TR remains the fallback.
- `isVideoLocked` semantics preserved under a feature-flag gate (tests updated).
- `imageCdn` used `URL.searchParams` (unimplemented in RN) — string building now.
- Error logs recorded `platform: undefined` on native — now `Platform.OS`.
- Removed 9 unused dependencies (victory-native, react-native-chart-kit,
  react-native-paper, framer-motion, lucide-react, moment, lodash, yup,
  react-hook-form) — smaller dependency graph, fewer audit surfaces.
- `eas.json`: `appVersionSource: remote` + production `autoIncrement`, new
  `development` (dev-client) profile.
- iOS `CFBundleLocalizations` (tr, en); versionCode/buildNumber baseline kept.
- Jest/TS toolchain fixed for React 19 / TS 6 (act-shim in `jest.setup.js`,
  `transformIgnorePatterns`, tsconfig `baseUrl` removal).

## Verified in this branch

- `npx expo-doctor`: **21/21 checks pass**
- `npx tsc --noEmit`: clean
- `npx jest`: **41 suites / 318 tests pass**
- `npx expo export` (web + iOS + Android Hermes bundles): builds
- `npx expo prebuild` (iOS + Android): config plugins apply cleanly; Apple
  Sign-In entitlement present; blocked permissions stripped from manifest

## Not fixable from the repo (see runbook, in order)

1. Apple Developer / Play Console / EAS accounts; `eas init` (projectId).
2. Firebase native apps: `google-services.json` (FCM won't deliver without
   it) + `GoogleService-Info.plist`; SHA-1 registration for Google sign-in;
   `iosUrlScheme` plugin option; `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
3. Production env vars (Firebase config, Sentry DSN) as EAS secrets.
4. Device testing via dev-client builds, then production builds + submit.
5. Console questionnaires (pre-answered in `store/*.md`), screenshots
   (spec + captions ready), demo review account.

## Risks / follow-ups

- **SDK 56 jump is large** (RN 0.74→0.85, React 19, New Architecture). JS
  test suite and bundling are green, but the first dev-client build must be
  smoke-tested on real devices before submission (runbook step 11).
- 30-day account purge job is promised by the privacy flow but not
  implemented server-side — needed for KVKK/GDPR follow-through.
- Android notification small icon not yet provided (renders app icon as
  flat silhouette until added).
- `expo-av` fully removed; `NativePlayer` now uses `expo-video` — verify Mux
  HLS playback on device during step 11.
