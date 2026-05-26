import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en.json'
import es from '@/locales/es.json'

export const I18N_NAMESPACES = [
  'common',
  'auth',
  'home',
  'settings',
  'tasks',
  'calendar',
  'errors',
  'notFound',
  'footer',
  'about',
  'admin',
] as const

await i18n.use(initReactI18next).init({
  resources: { en, es },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: [...I18N_NAMESPACES],
  interpolation: { escapeValue: false },
  returnEmptyString: false,
})

export default i18n
