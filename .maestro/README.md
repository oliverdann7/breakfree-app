# Maestro E2E Flows

End-to-end test flows for BreakFree, runnable via [Maestro](https://maestro.mobile.dev/).

## Install

```bash
curl -Ls https://get.maestro.mobile.dev | bash
```

## Run one flow

```bash
maestro test .maestro/signup.yaml
```

## Run all

```bash
maestro test .maestro/
```

## Add CI

Once stable, gate PR merges on Maestro Cloud — add `MAESTRO_API_KEY` secret
and call `maestro cloud .maestro/` from a GitHub Action.

## Flows

| File | Tests |
| --- | --- |
| `signup.yaml` | Email/password signup → onboarding → dashboard renders |
| `dashboard.yaml` | Authenticated user lands on dashboard, wellness ring visible |
| `challenges.yaml` | Topluluk tab → Challenges → Leaderboard |
| `premium.yaml` | Profile → Premium → plan selection visible |
| `mentor.yaml` | Mentor tab loads, send chat message |
