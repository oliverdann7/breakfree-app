# BreakFree — Staged Rollout Playbook

How we ship to production. Mirrors Phase 3 Sprint 13 §3.4.

## Cadence

| Phase | % users | Duration | Watch for |
| --- | --- | --- | --- |
| Internal | 100% of testers (≤ 100 ppl) | 3 days | Smoke, crash rate, qualitative bugs |
| TestFlight External / Play Open | 10% | 24h | Crash-free > 99.5%, no Sev 1 issues |
| Production | 10% | 24h | Crash, retention, ANR |
| Production | 50% | 24h | Same + revenue parity |
| Production | 100% | — | Done |

Each gate requires green on:
- Sentry crash-free sessions ≥ 99.5%
- Average rating ≥ 4.4 stars (no drop > 0.2)
- Payments success rate ≥ 99%
- Push delivery rate ≥ 95%
- No active Sev 1/Sev 2 (see `RUNBOOK.md` §2)

## How to gate in stores

### App Store Connect (iOS)
- App Store Connect → My Apps → BreakFree → Distribution → Phased Release.
- Phased Release auto-ramps 1% → 100% over 7 days. We override with manual pauses at the percentages above.
- Pause via "Pause Release" if any gate breaks.

### Google Play (Android)
- Play Console → Production → Manage Releases → Staged rollout %.
- Halt rollout via "Halt rollout" button.

### Web (Vercel)
- Atomic deploys; rollback is one click on previous deployment.
- For graduated UI changes, ship behind `featureFlags.*` and flip via Remote Config (Firebase) without redeploying.

## Pre-launch checklist (per release)

```
[ ] All CI green on `main` (lint, tests, Functions lint, web build)
[ ] CHANGELOG.md entry added under "Unreleased" → moved to version heading
[ ] Version bumped in app.json (iOS buildNumber, Android versionCode)
[ ] Release notes drafted in TR + EN
[ ] Screenshots updated if UI changed (store/screenshots/)
[ ] Privacy policy / TOS reviewed if data collection changed
[ ] Sentry release created: `npx sentry-cli releases new v1.x.y`
[ ] EAS Build for both platforms green
[ ] Submitted via `eas submit`
[ ] Internal smoke pass on iOS + Android physical devices
[ ] Phased release configured to 10%
[ ] On-call notified
```

## Communication

- 24h before release: post in `#bf-engineering` + `#bf-support`.
- At 100%: post user-facing release notes in-app + Twitter.
- Postmortem if rollback triggered, within 5 business days.

## Hotfix vs feature release

Hotfix: minimum diff, skip phased release for Sev 1, ship 100% with expedited review. See `RUNBOOK.md` §3.

Feature release: phased release always. Even for "small" features — surprises lurk in 1% tail.
