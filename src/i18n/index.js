import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr from './tr.json';
import en from './en.json';
import { resolveLocale, DEFAULT_LANGUAGE } from './resolveLocale';
import { getDeviceLocales } from './getDeviceLocales';

// First-paint language from the device locale (before redux-persist rehydrates).
// Once the store is ready, App restores the user's saved choice via syncLanguage.
const initialLanguage = resolveLocale({ saved: null, deviceLocales: getDeviceLocales() });

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

// Apply a saved preference ('tr' | 'en' | 'auto'/unset) on top of the device
// default. Safe to call repeatedly; only switches when the resolved language
// differs from the active one. Returns the resolved language.
export function syncLanguage(savedPreference) {
  const next = resolveLocale({ saved: savedPreference, deviceLocales: getDeviceLocales() });
  if (i18n.language !== next) {
    i18n.changeLanguage(next);
  }
  return next;
}

export default i18n;
