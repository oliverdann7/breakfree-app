// Do Not Disturb / quiet-hours scheduling for notifications.
//
// A quiet-hours window is stored as { enabled, start, end } where start/end are
// minutes-from-midnight (0–1439) in the user's local time. Windows may wrap
// past midnight (e.g. 22:00 → 07:00). When active, local notifications are
// suppressed or deferred to the end of the window.

export const DEFAULT_QUIET_HOURS = { enabled: false, start: 22 * 60, end: 7 * 60 };

// Minutes-from-midnight for a Date (local time).
function minutesOfDay(date) {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Is the given moment inside the quiet-hours window?
 * @param {{enabled:boolean,start:number,end:number}} quietHours
 * @param {Date} [now=new Date()]
 */
export function isWithinQuietHours(quietHours, now = new Date()) {
  if (!quietHours || !quietHours.enabled) return false;
  const { start, end } = quietHours;
  if (start == null || end == null || start === end) return false;
  const m = minutesOfDay(now);
  if (start < end) {
    // Same-day window, e.g. 01:00 → 06:00.
    return m >= start && m < end;
  }
  // Wrapping window, e.g. 22:00 → 07:00.
  return m >= start || m < end;
}

/**
 * Next moment notifications may fire — the end of the current quiet window, or
 * `now` if not currently quiet. Returns a Date.
 */
export function nextAllowedTime(quietHours, now = new Date()) {
  if (!isWithinQuietHours(quietHours, now)) return new Date(now);
  const end = quietHours.end;
  const result = new Date(now);
  const m = minutesOfDay(now);
  // If the window wraps and we're in the pre-midnight portion, the end is tomorrow.
  if (quietHours.start > quietHours.end && m >= quietHours.start) {
    result.setDate(result.getDate() + 1);
  }
  result.setHours(Math.floor(end / 60), end % 60, 0, 0);
  return result;
}

// "22:00" <-> minutes helpers for the settings UI.
export function minutesToLabel(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
}
