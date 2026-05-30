import { computeStreak, DEFAULT_STREAK_THRESHOLD } from '../utils/streak';

// Fixed reference day so tests are deterministic regardless of wall clock.
const TODAY = '2026-05-31';

// Helper: build a metric doc N days before TODAY with a given score.
const day = (offset, score = 80) => {
  const d = new Date('2026-05-31T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate() - offset);
  return { date: d.toISOString().split('T')[0], wellnessScore: score };
};

describe('computeStreak', () => {
  it('returns zeros for empty or invalid input', () => {
    expect(computeStreak([], { today: TODAY })).toEqual({
      current: 0,
      longest: 0,
      lastActiveDate: null,
    });
    expect(computeStreak(null, { today: TODAY }).current).toBe(0);
    expect(computeStreak(undefined, { today: TODAY }).longest).toBe(0);
  });

  it('counts consecutive days logged through today', () => {
    const metrics = [day(0), day(1), day(2)];
    const r = computeStreak(metrics, { today: TODAY });
    expect(r.current).toBe(3);
    expect(r.longest).toBe(3);
    expect(r.lastActiveDate).toBe('2026-05-31');
  });

  it('keeps the streak live when last log was yesterday', () => {
    const metrics = [day(1), day(2), day(3)];
    expect(computeStreak(metrics, { today: TODAY }).current).toBe(3);
  });

  it('lapses the current streak when the last log is older than yesterday', () => {
    const metrics = [day(2), day(3), day(4)];
    const r = computeStreak(metrics, { today: TODAY });
    expect(r.current).toBe(0); // lapsed
    expect(r.longest).toBe(3); // history is still longest
  });

  it('does NOT count non-consecutive days as a streak (the core bug)', () => {
    // Logged today, yesterday, then a gap, then 3 older days.
    const metrics = [day(0), day(1), day(5), day(6), day(7)];
    const r = computeStreak(metrics, { today: TODAY });
    expect(r.current).toBe(2); // only today + yesterday
    expect(r.longest).toBe(3); // the 5,6,7 run
  });

  it('breaks the streak on a sub-threshold day', () => {
    const metrics = [day(0, 80), day(1, 30), day(2, 80)];
    const r = computeStreak(metrics, { today: TODAY });
    expect(r.current).toBe(1); // only today qualifies before the gap
  });

  it('de-duplicates multiple logs on the same day', () => {
    const metrics = [day(0, 80), day(0, 90), day(1, 70)];
    expect(computeStreak(metrics, { today: TODAY }).current).toBe(2);
  });

  it('respects a custom threshold', () => {
    const metrics = [day(0, 60), day(1, 60)];
    expect(computeStreak(metrics, { today: TODAY, threshold: 70 }).current).toBe(0);
    expect(computeStreak(metrics, { today: TODAY, threshold: 50 }).current).toBe(2);
  });

  it('handles unordered input', () => {
    const metrics = [day(2), day(0), day(1)];
    expect(computeStreak(metrics, { today: TODAY }).current).toBe(3);
  });

  it('exposes a sane default threshold', () => {
    expect(DEFAULT_STREAK_THRESHOLD).toBe(50);
  });
});
