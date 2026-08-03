# Google Play Console — Data safety form answers

Fill these in Play Console → App content → Data safety. Answers reflect the
code as of this commit. Update if RevenueCat, Agora, or Health Connect ship.

## Overview
- **Does your app collect or share any of the required user data types?** Yes (collects; shares: No).
- **Is all of the user data collected by your app encrypted in transit?** Yes (Firebase uses TLS).
- **Do you provide a way for users to request that their data is deleted?** Yes —
  in-app (Profile → Gizlilik → Hesabımı sil) and via privacy@breakfree.tr.
  Delete URL for the form: https://breakfree.tr/legal/privacy#delete

## Data types

| Data type | Collected | Shared | Optional | Purpose |
| --- | --- | --- | --- | --- |
| Personal info → Email address | Yes | No | No (required for account) | App functionality, Account management |
| Personal info → Name | Yes | No | Yes | App functionality |
| Health and fitness → Health info (self-logged sleep/steps/water/mood) | Yes | No | Yes | App functionality |
| Messages → Other in-app messages (talk chat) | Yes | No | Yes | App functionality |
| Photos and videos | No | — | — | — |
| App activity → Other user-generated content (posts, bio, goals) | Yes | No | Yes | App functionality |
| App info and performance → Crash logs | Yes | No | Yes | Analytics (crash diagnostics) |
| Device or other IDs → Device or other IDs | No* | — | — | *Expo push token is stored against the account for notifications; declare under "Device or other IDs → Collected, App functionality" if reviewer asks. |
| Location | No | — | — | — |
| Financial info | No | — | — | — |
| Web browsing | No | — | — | — |
| Contacts | No | — | — | — |

Data is processed by Firebase (Google Cloud) as a service provider — this
does not count as "sharing" under Play's definition (service-provider
exemption).

## Security practices
- Encrypted in transit: Yes
- User can request deletion: Yes
- Committed to Play Families Policy: No (app is not targeted at children)
- Independent security review: No

## Other Play forms to complete
- **Target audience**: 18+ (health/wellness content; avoids Families policy).
- **Content rating (IARC)**: answer "No" to violence/sex/gambling/drugs;
  "Yes" to user-generated content with moderation + report/block. Expect
  PEGI 3 / ESRB Everyone with an interaction warning.
- **Health apps declaration**: declare as "Health & fitness" app collecting
  self-reported wellness data; not a medical device; no health research.
- **Account deletion URL**: https://breakfree.tr/legal/privacy#delete
- **News app**: No. **COVID-19 app**: No. **Government app**: No.
