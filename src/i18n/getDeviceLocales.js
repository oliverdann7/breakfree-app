// Device-locale detection via expo-localization, which works on iOS, Android
// and web. (The previous hand-rolled `typeof window` branch always took the
// web path on native — React Native defines `global.window` — so device
// locale never resolved on phones.) Returns BCP-47 tags, or [] when
// unavailable — callers default to Turkish.

export function getDeviceLocales() {
  try {
    // Required lazily so test environments without the module still work.
    const { getLocales } = require('expo-localization');
    return getLocales()
      .map((locale) => locale.languageTag)
      .filter(Boolean);
  } catch {
    // Locale APIs unavailable on this runtime — fall through to default.
    return [];
  }
}
