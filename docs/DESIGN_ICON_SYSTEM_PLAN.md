# BreakFree — Layout Fix & Icon System: Design and Implementation Plan

_Last updated: 2026-08-26_

## 1. Problems observed (breakfreeturkiye.com)

1. **Broken layout — white band past the first viewport.** On the Palestralar and
   Profil pages, everything scrolled past the first screen rendered on a white
   canvas, washing out cards and text.
   - **Root cause:** `expo export` (Metro web) builds its HTML from
     `public/index.html`. That file did not exist, so the deployed site used
     Expo's **default** template: white body, `body { overflow: hidden }`, and a
     fixed-height `#root`. The app re-enables scrolling at runtime
     (`overflow: auto !important`), so overflowing content painted over the
     white browser canvas. The hand-written root `index.html` (which had the
     correct dark reset) is **not** used by the build — it was a stale copy of
     an old build output.
2. **Duplicated talk list items.** Every sample talk appeared twice.
   - **Root cause:** `seedTalks` had no idempotency guard; running the seed
     twice (double click / two sessions) wrote the 4 sample docs again.
3. **Emoji used as UI iconography** (🏠 🎧 ❤️ 👥 👤 🔔 🌍 📏 🔒 🚪 🧠 🥗 …).
   Emoji render differently per OS/browser, clash with the premium brand look,
   can't be colored to match the palette, and are invisible to theming.

## 2. What this change ships (Phase 1 — web dashboard)

### Layout

- `public/index.html` — the real Expo web template: dark canvas
  (`#061829`) on `html`, `body` and `#root`, `min-height` (never fixed
  height) on `#root`, `overflow: auto` on body. Favicons/manifest are now in
  `public/` so they actually deploy.
- Runtime guard in `web.js` / `src/WebApp.jsx` global styles:
  `html, body { background: #061829 !important }`,
  `#root { height: auto !important; min-height: 100vh }` — so even a stale or
  default template can never produce the white band again.

### Data

- `seedTalks` now checks the `talks` collection and no-ops when any talk
  already exists (idempotent seeding).
- `WebTalksTab` dedupes rendered talks by `title|host|category|status` so
  already-duplicated Firestore data displays cleanly. (Optional cleanup: delete
  the duplicate docs from Firestore console — the UI no longer depends on it.)

### Icon system

- New `src/components/web/Icons.jsx`: a single `Icon` component with a
  Lucide-style, 24×24 stroke SVG path registry (~30 icons). Icons inherit
  `currentColor`, accept `size`, `color`, `strokeWidth`, `filled`, and are
  `aria-hidden` (decorative; adjacent text labels carry meaning).
- All UI-chrome emoji in the dashboard replaced with icons:

  | Location | Before | After |
  |---|---|---|
  | Sidebar / bottom nav tabs | 🏠 🎧 ❤️ 👥 👤 | `home` `headphones` `heart` `users` `user` |
  | Header notification | 🔔 | `bell` |
  | Talks category badges | 🧠 🏃 🌙 🥗 🎯 | `brain` `activity` `moon` `apple` `target` |
  | Talks empty state / listen CTA | 🎧 | `headphones` |
  | Profile settings rows | 🌍 🔔 📏 🔒 › | `globe` `bell` `ruler` `lock` `chevronRight` |
  | Logout | 🚪 | `logout` |
  | Home metric cards | 😴 ❤️ 👟 🔥 | `moon` `heart` `footprints` `flame` |
  | Home plan rows | 🧘 💪 🎙 ✓ → 📋 | `flower` `dumbbell` `mic` `check` `arrowRight` `clipboard` |
  | Health breakdown / AI insight | 😴 👟 🧘 🔥 ✨ | `moon` `footprints` `flower` `flame` `sparkles` |
  | Community stats / actions | ⭐ 👟 😴 ❤️ 🤍 💬 ▲▼ 🏆 → | `star` `footprints` `moon` `heart(filled)` `messageCircle` `chevronUp/Down` `trophy` `arrowRight` |
  | Metric logger labels / close | 😴 ❤️ 👟 🔥 ✨ ✕ | `moon` `heart` `footprints` `flame` `sparkles` `x` |

- **Deliberately kept as emoji:** community avatars (`AVATAR_EMOJIS`) and emoji
  typed inside user posts — that is user-generated content, not UI chrome.

## 3. Design guidelines going forward

- **One icon language:** Lucide-style 1.5–2 px stroke, round caps/joins, 24×24
  grid. Never mix emoji, filled glyph fonts and stroke icons in chrome.
- **Color:** icons take the text color of their context by default
  (`currentColor`). Accent icons use the palette tokens in `WebStyles.C`
  (cyan `#14B8D4` for "mind/data", gold `#C9961A` for "premium/live",
  red `#EF4444` only for destructive).
- **Sizing:** 14–16 px inline with text, 18–19 px navigation, 22 px card
  badges, 40 px empty states. Always pair with a visible text label or an
  `aria-label` on the interactive parent.
- **Adding an icon:** add a path entry to `PATHS` in
  `src/components/web/Icons.jsx` (24×24 viewBox, stroke-based, no fill) and use
  it by name. Do not inline one-off `<svg>` in feature components.

## 4. Roll-out plan for the rest of the app

### Phase 2 — Landing page (`src/components/BreakFreeLanding.jsx`) — DONE
- Feature-card emoji, stat chips, ★ ratings, ✓ bullets and → arrows replaced
  with `Icon` components; auth modals' ✕ close buttons and the Legal/Admin
  "←" back links use `x`/`arrowLeft`.

### Phase 3 — Native app (React Native screens) — DONE
- The registry was extracted to a platform-neutral module,
  `src/components/icons/paths.js` (plain path/circle/rect data). Two thin
  renderers consume it: `src/components/web/Icons.jsx` (DOM `<svg>`) and
  `src/components/common/Icon.js` (`react-native-svg`, already an app
  dependency — no new packages). Same API on both:
  `<Icon name size color strokeWidth filled />`. Jest mocks
  `react-native-svg` via `__mocks__/react-native-svg.js`.
- Replaced across: the tab bar (`AppNavigator`), feature components
  (`TalkCard`, `HealthStatusCard`, `LeaderboardCard`, `VideoCard`,
  `MetricCard` — which now takes an `icon` name with `emoji` kept as the
  content fallback), `Input` (eye/eyeOff), `ErrorBoundary`, and the Talks,
  Community, Mentor, Videos, Home, Health, Profile, Auth and Premium screens.
- Deliberately still emoji (content, not chrome): user avatars
  (`AVATAR_EMOJIS`, `avatarEmoji`), emoji inside user posts, the mood-face
  scale in `HealthMetricsScreen` (😞…😄 — an affective scale, not an icon),
  and `challenge.icon` values stored in Firestore (the *fallback* is now the
  `trophy` icon). The Google/Apple login buttons dropped their placeholder
  emoji; proper brand SVGs can be added later if wanted.

### Phase 4 — Avatars (product decision, not a bug)
- Community avatars are emoji chosen by users and stored in Firestore
  (`avatarEmoji`). Long-term options: (a) keep emoji avatars as a playful
  brand element, (b) curated SVG avatar set, (c) photo uploads (needs storage
  rules + moderation). Migration requires a data mapping, so keep as-is until
  decided.

### Phase 5 — QA / regression
- After `npm run build:web`, verify `dist/index.html` contains the dark
  `expo-reset` block from `public/index.html`.
- Scroll every dashboard tab past the fold at 1440×900 and 375×812 — no white
  band, no washed-out cards.
- Seed flow: on an empty `talks` collection the seed button loads 4 talks once;
  clicking again adds nothing.
- Lint gate idea (future): an ESLint rule / CI grep that rejects emoji
  codepoints in `src/components/**` outside `AVATAR_EMOJIS` and i18n strings.
