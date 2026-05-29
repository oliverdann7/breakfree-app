# App Store + Play Store Screenshots — Spec

Capture once per release. All images PNG, no transparency.

## iOS sizes (App Store Connect)

| Display | Size | Required? |
| --- | --- | --- |
| 6.7" (iPhone 15 Pro Max) | 1290 × 2796 | ✅ |
| 6.5" (iPhone 14 Plus) | 1284 × 2778 | ✅ |
| 5.5" (iPhone 8 Plus) | 1242 × 2208 | optional |
| 12.9" iPad Pro | 2048 × 2732 | only if iPad supported |

## Android sizes (Google Play Console)

| Display | Size | Required? |
| --- | --- | --- |
| Phone | 1080 × 1920 (min) | ✅ |
| 7" tablet | 1200 × 1920 | optional |
| 10" tablet | 1920 × 1200 | optional |

## Shots to capture (8 total per size)

1. **Hero — Landing/Dashboard** — wellness ring at 87, daily plan cards
2. **Live Talks (Palestralar)** — talk detail with chat
3. **Health Analytics** — weekly chart + 4 metric cards
4. **Mentor 1-on-1** — mentor profile + weekly focus + goals
5. **Community feed** — post + leaderboard card
6. **Challenges + Leaderboard** — challenge card + leaderboard with "you" highlight
7. **BreakFree Pro paywall** — plan selector + trial banner
8. **Privacy & data control** — KVKK/GDPR settings

## Caption text (overlay)

Use Fraunces 600 + Manrope 500. Color: cream (#F4E8C8) on navy (#0A2540).
Captions per shot — see `store/captions.json` once written.

## Workflow

```bash
# 1. EAS build to TestFlight, screenshots via Xcode Simulator
xcrun simctl io booted screenshot store/screenshots/ios-6.7/01-hero.png

# 2. Android via emulator
adb -e exec-out screencap -p > store/screenshots/android-phone/01-hero.png

# 3. Optional: fastlane snapshot for automation
fastlane snapshot
```

## Naming convention

`{size-id}/{order}-{shot-name}.png` — e.g. `ios-6.7/03-health.png`.
