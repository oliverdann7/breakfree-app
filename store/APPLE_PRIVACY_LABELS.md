# App Store Connect — App Privacy questionnaire answers

Fill these in App Store Connect → App Privacy. Answers reflect what the code
actually does as of this commit (Firebase Auth/Firestore, self-logged health
metrics, expo-notifications push tokens, optional Sentry crash reports). Update
if RevenueCat, Agora, or HealthKit sync ship later.

**Do you collect data from this app?** Yes.

## Data types collected

### Contact Info
- **Email Address** — Linked to identity. Used for: App Functionality (account).
- **Name** (display name) — Linked to identity. Used for: App Functionality.

### Health & Fitness
- **Health** (self-logged sleep, steps, water, mood, wellness score) — Linked
  to identity. Used for: App Functionality. *Not* from HealthKit — user-entered.

### User Content
- **Other User Content** (community posts, talk chat messages, profile bio,
  goals) — Linked to identity. Used for: App Functionality.

### Identifiers
- **User ID** (Firebase UID) — Linked to identity. Used for: App Functionality.

### Diagnostics
- **Crash Data** — Not linked to identity (Sentry, only when
  `EXPO_PUBLIC_SENTRY_DSN` is configured; error logs also written to
  Firestore `error_logs` without UID). Used for: App Functionality.

## Data types NOT collected
Location, Contacts, Browsing History, Search History, Purchases (no IAP live),
Financial Info, Sensitive Info, Photos/Videos, Audio, Precise Location,
Advertising Data, Product Interaction / Analytics (Firebase Analytics is
web-only; native builds do not initialize it).

## Tracking
**No.** The app does not track users across apps/websites, contains no ads and
no third-party advertising/analytics SDKs. Do NOT declare tracking; ATT prompt
is not needed and must not be added.

## Privacy policy URL
https://breakfree.tr/legal/privacy (must serve `store/legal/PRIVACY.md` content)

## Account deletion (Guideline 5.1.1(v))
In-app: Profile → Gizlilik → "Hesabımı sil". Server disables the account
immediately and queues purge after a 30-day cooling-off period. Mention this
path in Review Notes.
