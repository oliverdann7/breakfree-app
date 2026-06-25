// Pure locale-resolution helpers shared by i18n init and boot-time restore.
// Kept free of platform/SDK imports so they're trivially unit-testable.

export const SUPPORTED_LANGUAGES = ['tr', 'en'];
export const DEFAULT_LANGUAGE = 'tr';

// Map a BCP-47 tag ('en-US') or bare code ('EN') to a supported app language,
// or null when unsupported.
export function normalizeLanguage(tag) {
  if (!tag || typeof tag !== 'string') return null;
  const base = tag.toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(base) ? base : null;
}

// Resolve the active language. Precedence:
//   explicit saved choice → first supported device locale → DEFAULT_LANGUAGE.
// A saved value of 'auto' (or anything unsupported) defers to the device.
export function resolveLocale({ saved, deviceLocales = [] } = {}) {
  const fromSaved = normalizeLanguage(saved);
  if (fromSaved) return fromSaved;

  for (const tag of deviceLocales) {
    const match = normalizeLanguage(tag);
    if (match) return match;
  }
  return DEFAULT_LANGUAGE;
}
