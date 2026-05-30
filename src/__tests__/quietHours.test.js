import {
  isWithinQuietHours,
  nextAllowedTime,
  minutesToLabel,
  DEFAULT_QUIET_HOURS,
} from '../utils/quietHours';

// Build a local-time Date at h:m today.
const at = (h, m = 0) => {
  const d = new Date('2026-05-31T00:00:00');
  d.setHours(h, m, 0, 0);
  return d;
};

describe('quietHours', () => {
  it('is inactive when disabled', () => {
    expect(isWithinQuietHours({ enabled: false, start: 0, end: 1439 }, at(3))).toBe(false);
    expect(isWithinQuietHours(null, at(3))).toBe(false);
  });

  it('handles a wrapping window (22:00 → 07:00)', () => {
    const qh = { enabled: true, start: 22 * 60, end: 7 * 60 };
    expect(isWithinQuietHours(qh, at(23))).toBe(true); // late night
    expect(isWithinQuietHours(qh, at(3))).toBe(true); // early morning
    expect(isWithinQuietHours(qh, at(7))).toBe(false); // exactly at end
    expect(isWithinQuietHours(qh, at(12))).toBe(false); // midday
  });

  it('handles a same-day window (01:00 → 06:00)', () => {
    const qh = { enabled: true, start: 60, end: 360 };
    expect(isWithinQuietHours(qh, at(2))).toBe(true);
    expect(isWithinQuietHours(qh, at(0, 30))).toBe(false);
    expect(isWithinQuietHours(qh, at(6))).toBe(false);
  });

  it('treats an empty window (start === end) as inactive', () => {
    expect(isWithinQuietHours({ enabled: true, start: 480, end: 480 }, at(8))).toBe(false);
  });

  it('nextAllowedTime returns now when not quiet', () => {
    const qh = { enabled: true, start: 22 * 60, end: 7 * 60 };
    const now = at(12);
    expect(nextAllowedTime(qh, now).getTime()).toBe(now.getTime());
  });

  it('nextAllowedTime advances to window end (same morning) for early-morning quiet', () => {
    const qh = { enabled: true, start: 22 * 60, end: 7 * 60 };
    const next = nextAllowedTime(qh, at(3));
    expect(next.getHours()).toBe(7);
    expect(next.getDate()).toBe(31); // same day
  });

  it('nextAllowedTime rolls to next day for pre-midnight quiet', () => {
    const qh = { enabled: true, start: 22 * 60, end: 7 * 60 };
    const next = nextAllowedTime(qh, at(23));
    expect(next.getHours()).toBe(7);
    expect(next.getDate()).toBe(1); // June 1
  });

  it('minutesToLabel formats zero-padded HH:MM', () => {
    expect(minutesToLabel(1320)).toBe('22:00');
    expect(minutesToLabel(420)).toBe('07:00');
    expect(minutesToLabel(5)).toBe('00:05');
  });

  it('exposes sane defaults', () => {
    expect(DEFAULT_QUIET_HOURS).toEqual({ enabled: false, start: 1320, end: 420 });
  });
});
