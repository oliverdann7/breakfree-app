# BreakFree — App Store & Google Play Submission Runbook

Everything code-side is done in this repo (Expo SDK 56, store-compliant
config, metadata, privacy questionnaires). The steps below are the ones that
need **your accounts, a Mac/phone, or a browser** — in order. Budget ~2–4
hours of console work plus review wait time (1–3 days per store).

---

## Phase A — Accounts (one-time)

1. **Apple Developer Program** — enroll at https://developer.apple.com
   ($99/yr) with danezolv@gmail.com (matches `eas.json` submit config).
2. **Google Play Console** — register at https://play.google.com/console
   ($25 one-time).
3. **Expo (EAS)** — free account at https://expo.dev, then locally:
   ```bash
   npm i -g eas-cli && eas login
   ```

## Phase B — Project wiring (one-time)

4. **EAS project id**:
   ```bash
   eas init
   ```
   This fills `expo.extra.eas.projectId` in `app.json` (currently `""`).
   Push notifications depend on it — `notificationService.js` reads it.
5. **Firebase — native apps**: in the Firebase console add an iOS app
   (bundle id `com.breakfree.app`) and an Android app (package
   `com.breakfree.app`). Download:
   - `GoogleService-Info.plist` → repo root; add `"ios": { "googleServicesFile": "./GoogleService-Info.plist" }`
   - `google-services.json` → repo root; add `"android": { "googleServicesFile": "./google-services.json" }`
   Both files are gitignored — also upload them as EAS secrets:
   ```bash
   eas env:create --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json
   ```
   Without the Android file, FCM (remote push) will not deliver.
6. **Android push (FCM v1)**: Firebase console → Project settings → Cloud
   Messaging → generate a service account key, then `eas credentials`
   (Android → Push notifications) to upload it.
7. **iOS push**: `eas credentials` (iOS) — let EAS create the APNs key.
8. **Google Sign-In (iOS)**: from the Firebase iOS app config take the
   `REVERSED_CLIENT_ID` and add to `app.json` plugins:
   ```json
   ["@react-native-google-signin/google-signin", { "iosUrlScheme": "com.googleusercontent.apps.XXXX" }]
   ```
   Set `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (the *Web* client id from Google
   Cloud console) as an EAS env var for all build profiles. Android needs
   the SHA-1 of the EAS keystore registered in Firebase: get it from
   `eas credentials`, paste into Firebase Android app settings.
9. **Sentry (optional but recommended)**: create a project at sentry.io, set
   `EXPO_PUBLIC_SENTRY_DSN` as an EAS env var. For source maps add
   `SENTRY_AUTH_TOKEN` and org/project options to the `@sentry/react-native`
   plugin entry.
10. **Runtime env vars**: set all `EXPO_PUBLIC_FIREBASE_*` values (from
    `.env.local.example`) as EAS env vars for the production profile.

## Phase C — Build & device test

11. **Dev-client sanity check** (recommended first):
    ```bash
    eas build --profile development --platform all
    ```
    Install on a real iPhone + Android phone. Verify: email sign-up/in,
    Google sign-in (both), Apple sign-in (iOS), community post, challenge
    join, metric logging, video playback (YouTube + any Mux/URL video),
    push permission prompt + a test push from Expo's push tool, account
    deletion flow, TR/EN language switch.
12. **Production builds**:
    ```bash
    eas build --profile production --platform all
    ```
    Version/build numbers auto-increment (`appVersionSource: remote`).

## Phase D — Store consoles

13. **App Store Connect** — create the app (bundle id `com.breakfree.app`,
    primary language Turkish). Fill:
    - Name/subtitle/keywords/description from `store/metadata/tr` (+ `en`
      localization).
    - Screenshots per `store/screenshots/SPEC.md` + `store/captions.json`
      (capture from the production build on an iPhone 15 Pro Max sim or
      device; 6.7" + 6.5" sets).
    - App Privacy answers: `store/APPLE_PRIVACY_LABELS.md`.
    - Category: Health & Fitness. Age rating questionnaire: expect 12+
      (unmonitored UGC → answer the social questions truthfully:
      user-generated content = yes, with moderation/report/block).
    - Privacy policy URL: publish `store/legal/PRIVACY.md` at
      https://breakfree.tr/legal/privacy (the web app already has a
      /legal route — verify it's deployed).
    - **Review notes**: provide a demo account (create
      review@breakfree.tr with a fixed password in Firebase Auth and
      seed it with data) and state: "Account deletion: Profile →
      Gizlilik → Hesabımı sil. No IAP in this version."
    - Copy the app's Apple ID (numeric) into `eas.json` → `ascAppId`.
14. **Play Console** — create the app (package `com.breakfree.app`). Fill:
    - Store listing from `store/metadata/tr` (title, short_description.txt,
      description.txt) + English localization.
    - Data safety + content rating + target audience:
      `store/PLAY_DATA_SAFETY.md`.
    - Screenshots (1080×1920+) + feature graphic 1024×500 (make from the
      splash/logo assets).
    - Create a **service account** (Play Console → API access), download
      the JSON key as `./google-play-service-account.json` (gitignored),
      grant it "Release manager".
15. **Submit**:
    ```bash
    eas submit --platform ios --profile production
    eas submit --platform android --profile production
    ```
    Android goes to the **internal** track first (per `eas.json`) — promote
    internal → closed → production in the console after testing. Google
    requires 12+ testers for 14 days for *personal* (new individual)
    accounts — if that applies, recruit testers via the internal track link.

## Phase E — After approval

16. Staged rollout per `docs/STAGED_ROLLOUT.md` (Play: 10% → 50% → 100%;
    iOS: phased release on).
17. Monitor: Sentry, Firestore `error_logs`, store review replies.

---

## Deliberately disabled at launch (re-enable later)

| Feature | Flag | Unblock |
| --- | --- | --- |
| Pro subscription / paywall | `premiumSubscription` (off) | Integrate `react-native-purchases` (RevenueCat), create products in both consoles, add Restore Purchases + Terms links to PremiumScreen, then set `EXPO_PUBLIC_FF_PREMIUM=true`. Server webhook is already live. |
| Live audio talks | `liveAudioTalks` (off) | Add `react-native-agora` + config plugin; token minting function already deployed. |
| Wearable sync | `wearableSync` (off) | Add HealthKit/Health Connect module behind `healthService`; update privacy labels/data safety forms when it ships. |

## Known follow-ups (not blockers)
- Android notification small icon: add a white-on-transparent 96×96 PNG and
  set it via the `expo-notifications` plugin options (currently the app icon
  is used, which renders as a flat silhouette).
- The 30-day account purge job promised by `privacyRequest.js` is not yet
  implemented as a scheduled function — implement before real users request
  deletion (KVKK/GDPR + Apple compliance).
- `eas.json` carries `appleId: danezolv@gmail.com`; that's fine (not a
  secret) but move to `EXPO_APPLE_ID` env var if the repo goes public.
