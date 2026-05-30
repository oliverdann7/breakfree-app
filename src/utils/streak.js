// Date-aware streak engine for daily wellness metrics.
//
// A "streak" is a run of consecutive calendar days on which the user logged a
// metric whose wellnessScore met the threshold. Unlike a naive document
// counter, this respects calendar gaps: logging on day 6, day 5, then day 1
// is a streak of 2 (days 5–6), not 3.
//
// The current streak is only "live" if the most recent qualifying day is today
// or yesterday — otherwise the streak has lapsed and current resets to 0.

export const DEFAULT_STREAK_THRESHOLD = 50;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Normalize any date input (Date, ISO string, 'YYYY-MM-DD', epoch ms) to a
// UTC day index — whole days since the epoch — so arithmetic is gap-aware and
// free of DST/time-of-day noise.
function toDayIndex(value) {
  if (value == null) return null;
  let date;
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'number') {
    date = new Date(value);
  } else if (typeof value === 'string') {
    // Bare 'YYYY-MM-DD' parses as UTC midnight, which is what we want.
    date = new Date(value);
  } else {
    return null;
  }
  const ms = date.getTime();
  if (Number.isNaN(ms)) return null;
  return Math.floor(ms / MS_PER_DAY);
}

/**
 * Compute current and longest streaks from a list of daily metrics.
 *
 * @param {Array<{date: any, wellnessScore?: number}>} metrics - daily metric
 *   docs in any order. `date` may be a Date, ISO string, 'YYYY-MM-DD', or
 *   epoch ms. Days are de-duplicated (multiple logs on one day count once).
 * @param {object} [opts]
 * @param {number} [opts.threshold=50] - minimum wellnessScore to qualify a day.
 * @param {any} [opts.today=new Date()] - reference "today" for liveness check.
 * @returns {{current: number, longest: number, lastActiveDate: string|null}}
 */
export function computeStreak(metrics, { threshold = DEFAULT_STREAK_THRESHOLD, today } = {}) {
  const empty = { current: 0, longest: 0, lastActiveDate: null };
  if (!Array.isArray(metrics) || metrics.length === 0) return empty;

  // Collect the unique day indices that qualify.
  const qualifyingDays = new Set();
  for (const m of metrics) {
    if (!m || (m.wellnessScore ?? 0) < threshold) continue;
    const day = toDayIndex(m.date);
    if (day != null) qualifyingDays.add(day);
  }
  if (qualifyingDays.size === 0) return empty;

  const days = [...qualifyingDays].sort((a, b) => a - b); // ascending

  // Longest run of consecutive days anywhere in the history.
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] + 1) {
      run++;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
  }

  // Current streak: walk back from the most recent qualifying day, but only if
  // that day is today or yesterday (otherwise the streak has lapsed).
  const todayIndex = toDayIndex(today ?? new Date());
  const lastDay = days[days.length - 1];
  let current = 0;
  if (todayIndex != null && (lastDay === todayIndex || lastDay === todayIndex - 1)) {
    current = 1;
    for (let i = days.length - 1; i > 0; i--) {
      if (days[i] === days[i - 1] + 1) {
        current++;
      } else {
        break;
      }
    }
  }

  const lastActiveDate = new Date(lastDay * MS_PER_DAY).toISOString().split('T')[0];
  return { current, longest, lastActiveDate };
}
