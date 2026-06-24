# BreakFree Cloud Functions

Firebase Cloud Functions backing the Phase 2 + Phase 3 features.

## Functions

| Name | Type | Purpose |
| --- | --- | --- |
| `mintAgoraToken` | Callable | Mint short-lived Agora RTC token for live talks. |
| `revenueCatWebhook` | HTTPS | Receive RevenueCat subscription events → mirror to Firestore. |
| `onMetricUpdated` | Firestore trigger | Recompute leaderboard when a participant's progress changes. |
| `recomputeLeaderboard` | Callable (admin) | Manual leaderboard rebuild. |
| `scheduledBackup` | Cron (24h) | Daily Firestore export to Cloud Storage. |
| `onNotificationCreated` | Firestore trigger | Fan out Expo push for new in-app notifications. |
| `processPrivacyRequest` | Firestore trigger | Fulfill KVKK/GDPR export / delete requests. |

## Setup

```bash
cd functions
npm install
firebase use <project-id>
```

Required env / config:

```bash
# Agora live audio
firebase functions:config:set agora.app_id="..." agora.app_certificate="..."

# RevenueCat webhook auth
firebase functions:config:set revenuecat.webhook_token="..."

# Daily backup destination
firebase functions:config:set backup.bucket="gs://breakfree-backups"
```

## Deploy

```bash
npm run deploy
```

Requires the Firebase Blaze plan (pay-as-you-go) — outbound HTTP, scheduled
triggers, and Cloud Storage backups all need it.

## Tests

```bash
npm test              # unit suite
npm run test:coverage # with coverage report
```

Pure unit tests — no emulator, no network. External SDKs (`firebase-admin`,
`firebase-functions`, `agora-token`, `google-auth-library`) are redirected to
hand-written mocks under `test/__mocks__/` via `jest.config.js`, so each handler
is invoked directly with synthetic args. Run in CI by `functions-ci.yml`.

## Local emulator

```bash
npm run serve
```

Use the Firebase Emulator Suite to test triggers without touching production.
