// Best-effort device-locale detection without a native module. On web we read
// the browser's languages; on native we fall back to Intl (Hermes ships a
// limited Intl, guarded). Returns BCP-47 tags, or [] when unavailable — callers
// default to Turkish.
//
// `typeof window` is evaluated once at module load so web/native branches
// tree-shake cleanly (see project convention on platform detection).
const isWeb = typeof window !== 'undefined' && typeof navigator !== 'undefined';

export function getDeviceLocales() {
  try {
    if (isWeb) {
      if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
        return navigator.languages;
      }
      return navigator.language ? [navigator.language] : [];
    }
    if (typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function') {
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      return locale ? [locale] : [];
    }
  } catch {
    // Locale APIs unavailable on this runtime — fall through to default.
  }
  return [];
}
