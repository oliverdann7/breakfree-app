# BreakFree — Operations Runbook

Practical playbook for incidents, hotfixes, and routine ops. Mirrors Phase 3
Sprint 13 launch requirements.

---

## 1. On-call rotation

Weekly rotation. Primary + secondary. Handoff Mondays 10:00 TR. Pages from:

- Better Stack (uptime, SLO breach)
- Sentry (crash rate > 1%, P0 errors)
- Firebase Alerts (function failures > 5%, Firestore quota)
- RevenueCat (failed renewals spike)

Acknowledge in PagerDuty within 5 min. Post `:eyes:` in `#bf-oncall` Slack.

## 2. Severity classes

| Sev | Definition | Examples | Response target |
| --- | --- | --- | --- |
| Sev 1 | All users blocked | Auth down, app won't open, payments broken | Page primary + secondary, war-room within 10m |
| Sev 2 | Major feature broken for many | Talks audio fails, push not delivering | Primary on-call, fix within 4h |
| Sev 3 | Minor regression or degraded UX | Slow chart render, one talk audio glitch | Track in Linear, fix within 2 business days |
| Sev 4 | Cosmetic / single-user | Layout typo, edge-case crash | Backlog |

## 3. Hotfix flow

1. Cut branch from `main`: `hotfix/<issue>`.
2. PR with minimal diff. Add `Fixes #N` and `hotfix` label.
3. CI must pass (lint + tests + Functions lint). Smoke-test via `preview_*`.
4. Merge → triggers `eas-preview.yml` (requires `EXPO_TOKEN` secret).
5. Tag release: `git tag v1.x.y-hotfix && git push --tags`.
6. EAS Build production → Submit to TestFlight + Play Internal.
7. Apple expedited review request if Sev 1 (App Store Connect → "Request expedited review").
8. Staged rollout: 10% → 50% → 100% over 48h unless data flat.
9. Postmortem within 5 business days.

## 4. Rollback

- **Web (Vercel)**: Vercel → Deployments → "Promote to production" on previous.
- **iOS / Android**: stop staged rollout in Play Console / App Store Connect. Submit previous binary if blocking.
- **Cloud Functions**: `firebase functions:rollback` or redeploy previous tag.
- **Firestore schema**: forward-only — see §6.

## 5. Common incidents

### App won't sign in
1. Firebase Status → Auth.
2. Sentry → search "auth/" errors last 30m.
3. Try anonymous sign-in via console. If broken globally → Firebase support.
4. If only Apple/Google sign-in: check OAuth client config didn't expire.

### Live talks audio drops
1. Agora dashboard → channel quality.
2. Verify `mintAgoraToken` 200s in Functions logs.
3. Cert rotated? Re-set `firebase functions:config:set agora.app_certificate=...` and redeploy.

### Payments failing
1. RevenueCat → Webhook deliveries. Re-deliver failed events.
2. Stripe dashboard → recent disputes / declines.
3. App Store / Play receipt validation errors → check shared secret.

### Push not delivering
1. Expo push receipts: `expo push:receipt`.
2. Check `onNotificationCreated` Function logs.
3. Verify `users/{uid}.pushToken` is recent (< 30d).

### KVKK / GDPR request not processed
1. `users/{uid}/privacy_requests` doc → `status` field.
2. Function logs `processPrivacyRequest` for error.
3. If `delete` stuck in `pending_cooloff`, that's normal — purges after 30d via scheduled job.

## 6. Firestore schema changes

Forward-only. Strategy:
1. Write new field alongside old.
2. Backfill via one-shot Cloud Function.
3. Update reads to prefer new.
4. After 2 weeks, stop writing old; another 2 weeks, drop reads.
5. Compact / delete old field via Firebase CLI batch.

Never rename. Never drop without staged removal.

## 7. Backup + restore

- **Auto**: `scheduledBackup` runs daily 03:00 TR to `gs://breakfree-backups`.
- **Manual export**: `gcloud firestore export gs://breakfree-backups/manual-YYYY-MM-DD`.
- **Restore**: clone the project to a sandbox first, restore there, verify, then schedule a maintenance window for production restore via `gcloud firestore import`.
- Retention: 30 days hot, 1 year cold (lifecycle rule on bucket).

## 8. Quotas + cost ceilings

- Firestore: 1M reads/day baseline. Alert at 70%.
- Cloud Functions: 2M invocations/month. Alert at 80%.
- Cloud Storage: 100 GB. Alert at 80 GB.
- Agora: monthly minutes pre-paid. Alert when 50% consumed mid-month.
- RevenueCat: per-MTU plan; monitor active subscriber count weekly.

## 9. Contact list

| Service | Account | Owner |
| --- | --- | --- |
| Firebase / GCP | breakfree-prod | TBD |
| Vercel | breakfree-web | TBD |
| RevenueCat | breakfree | TBD |
| Agora.io | breakfree | TBD |
| Sentry | breakfree-org | TBD |
| Apple Developer | Team ID TBD | TBD |
| Google Play Console | Account TBD | TBD |
| Stripe | breakfree-tr | TBD |

Fill in owners when accounts are provisioned. Keep credentials in 1Password vault `BreakFree-Ops`.
