/**
 * Regression gate for the icon system (docs/DESIGN_ICON_SYSTEM_PLAN.md §5):
 * UI chrome must use the shared Icon registry, never emoji. Emoji are allowed
 * only as user content — avatars, sample post text, the mood-face scale —
 * which lives on the allowlisted lines below.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..');
const EMOJI = /(?:[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}★]|\u{FE0F})/u;

// file (relative to src/) → substrings marking lines that may contain emoji
const ALLOWED = {
  'components/web/WebCommunityTab.jsx': ['AVATAR_EMOJIS', 'emoji:', 'text:', 'bio:'],
  'components/common/Avatar.js': ['🧘'],
  'components/features/HealthStatusCard.js': ["emoji = '🧘'"],
  'components/features/LeaderboardCard.js': ['avatarEmoji'],
  'screens/Community/CommunityScreen.js': ['AVATAR_EMOJIS', 'avatarEmoji'],
  'screens/Community/LeaderboardScreen.js': ['emoji:'],
  'screens/Mentor/MentorScreen.js': ['avatarEmoji'],
  'screens/Mentor/MentorDirectoryScreen.js': ['avatarEmoji'],
  'screens/Health/HealthMetricsScreen.js': ["emoji: '", 'moodFace'],
  'store/slices/metricsSlice.js': ['avatarEmoji'],
  'store/slices/mentorSlice.js': ['avatarEmoji'],
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['__tests__', '__mocks__', 'scripts'].includes(entry.name)) walk(p, out);
    } else if (/\.(js|jsx|json)$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

test('no emoji in UI chrome — icons come from the shared registry', () => {
  const offenders = [];
  for (const file of walk(SRC)) {
    const rel = path.relative(SRC, file).split(path.sep).join('/');
    const allowed = ALLOWED[rel] || [];
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (EMOJI.test(line) && !allowed.some((marker) => line.includes(marker))) {
        offenders.push(`${rel}:${i + 1}: ${line.trim().slice(0, 80)}`);
      }
    });
  }
  expect(offenders).toEqual([]);
});
