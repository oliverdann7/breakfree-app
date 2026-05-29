# BreakFree — Performance Budgets

Phase 3 Sprint 11 targets, with measurement methodology. Budgets are
guardrails, not floors — CI fails when a PR regresses any metric by > 10%.

## Targets

| Metric | Target | Stretch | Measured how |
| --- | --- | --- | --- |
| App startup (cold) | < 2.0s | < 1.5s | Sentry App Start span |
| Time to interactive (web) | < 2.5s | < 2.0s | Lighthouse CI |
| First Contentful Paint (web) | < 1.5s | < 1.2s | Lighthouse CI |
| Screen transition | < 300ms | < 200ms | Sentry navigation span |
| API call p95 | < 500ms | < 300ms | Sentry HTTP span |
| Talks audio join latency | < 1.5s | < 1.0s | Agora dashboard |
| List scroll FPS (FlatList) | > 55 | 60 | RN Perf Monitor |
| App bundle (native) | < 80 MB | < 60 MB | EAS artifact size |
| App bundle (web initial) | < 2 MB | < 1.5 MB | `expo export` analyze |
| Cold cache image load | < 800ms | < 500ms | Sentry resource span |
| Crash-free sessions | > 99.5% | > 99.8% | Sentry / Crashlytics |

## How CI enforces

1. **Lighthouse** — `npm run build:web` → `lhci autorun --collect.url=https://breakfree-app.vercel.app/`. PR gets a comment with deltas. Score < 80 on Performance fails the job.
2. **Bundle audit** — `expo export --platform web` then `npx source-map-explorer dist/*.js`. Compare to baseline in `docs/perf-baseline.json` (commit baseline when a known improvement lands).
3. **Jest** — synthetic perf assertions on hot utilities (wellness score < 1ms, badge eval < 5ms over 10k iterations).
4. **Maestro** — `.maestro/flows/perf.yaml` records cold-start time on a device farm sample weekly.

## Mitigation playbook

When a budget breaks:

- **Startup**: hold heavy imports for after first paint (`AppNavigator` lazy import). Drop sync work in `App.tsx`. Defer i18n bundle for non-default locale.
- **Web FCP**: code-split per route. Inline critical CSS. Preconnect to Firebase + CDN. Verify font preloads.
- **Bundle**: run `npx expo customize metro.config.js` and enable Hermes for Android. Use `babel-plugin-transform-imports` for `lodash`, `lucide-react`. Drop unused locales.
- **Scroll**: confirm `getItemLayout`, `keyExtractor`, `removeClippedSubviews`, `windowSize=5`. Memoize row components.
- **Network**: enable Firestore offline persistence on mobile (free), batch via `requestBatcher`, paginate at 20.
- **Images**: use `LazyImage` (CDN-transformed), `expo-image` with disk cache. Avoid native `Image` for hero shots.

## Web Vitals snapshot

```
LCP: target < 2.5s
INP: target < 200ms
CLS: target < 0.1
```

Capture via `web-vitals` library, post to `/api/vitals` (Cloud Function) for daily aggregation. Dashboard in Looker Studio linked from RUNBOOK §1.

## Owner

Performance is everyone's job, but the on-call engineer for the week
chairs the bi-weekly perf review.
