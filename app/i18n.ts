import i18n, { type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from '@/locales/en/common.json';
import esCommon from '@/locales/es/common.json';
import frCommon from '@/locales/fr/common.json';
import ptCommon from '@/locales/pt/common.json';

const resources = {
  en: { common: enCommon },
  es: { common: esCommon },
  fr: { common: frCommon },
  pt: { common: ptCommon },
};

const detectionOptions = {
  order: ['cookie', 'localStorage', 'htmlTag', 'navigator'],
  caches: ['cookie'],
};

const fallbackLng = 'en';
const supportedLngs: InitOptions['supportedLngs'] = ['en', 'es', 'fr', 'pt'];
const shouldUseLanguageDetector = typeof window !== 'undefined';

const config: InitOptions = {
  resources,
  fallbackLng,
  supportedLngs,
  ns: ['common'],
  defaultNS: 'common',
  debug: true,
  interpolation: { escapeValue: true },
  react: { useSuspense: false },
};

if (shouldUseLanguageDetector) {
  config.detection = detectionOptions;
}

if (!i18n.isInitialized) {
  if (shouldUseLanguageDetector) {
    i18n.use(LanguageDetector);
  }
  i18n.use(initReactI18next).init(config);
}

export default i18n;
