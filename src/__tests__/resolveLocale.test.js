import {
  resolveLocale,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
} from '../i18n/resolveLocale';

describe('normalizeLanguage', () => {
  it('maps a region tag to its base supported language', () => {
    expect(normalizeLanguage('en-US')).toBe('en');
    expect(normalizeLanguage('tr-TR')).toBe('tr');
    expect(normalizeLanguage('EN')).toBe('en');
    expect(normalizeLanguage('tr_TR')).toBe('tr');
  });

  it('returns null for unsupported or invalid tags', () => {
    expect(normalizeLanguage('de')).toBeNull();
    expect(normalizeLanguage('')).toBeNull();
    expect(normalizeLanguage(null)).toBeNull();
    expect(normalizeLanguage(undefined)).toBeNull();
    expect(normalizeLanguage(42)).toBeNull();
  });

  it('exposes the supported set and default', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['tr', 'en']);
    expect(DEFAULT_LANGUAGE).toBe('tr');
  });
});

describe('resolveLocale', () => {
  it('prefers an explicit, supported saved choice over the device', () => {
    expect(resolveLocale({ saved: 'en', deviceLocales: ['tr-TR'] })).toBe('en');
    expect(resolveLocale({ saved: 'tr', deviceLocales: ['en-US'] })).toBe('tr');
  });

  it("falls back to the device locale when saved is 'auto'", () => {
    expect(resolveLocale({ saved: 'auto', deviceLocales: ['en-GB', 'tr'] })).toBe('en');
    expect(resolveLocale({ saved: 'auto', deviceLocales: ['tr-TR'] })).toBe('tr');
  });

  it('falls back to the device locale when saved is missing or unsupported', () => {
    expect(resolveLocale({ saved: null, deviceLocales: ['en-US'] })).toBe('en');
    expect(resolveLocale({ saved: 'de', deviceLocales: ['en-US'] })).toBe('en');
  });

  it('picks the first supported device locale, skipping unsupported ones', () => {
    expect(resolveLocale({ saved: 'auto', deviceLocales: ['de-DE', 'fr', 'en-US'] })).toBe('en');
  });

  it('defaults to Turkish when nothing resolves', () => {
    expect(resolveLocale({ saved: 'auto', deviceLocales: ['de', 'fr'] })).toBe('tr');
    expect(resolveLocale({ saved: null, deviceLocales: [] })).toBe('tr');
    expect(resolveLocale({})).toBe('tr');
    expect(resolveLocale()).toBe('tr');
  });
});
