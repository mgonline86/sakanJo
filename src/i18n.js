import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from './locales/en.json';
import arTranslation from './locales/ar.json';

const resources = {
  en: {
    translation: enTranslation
  },
  ar: {
    translation: arTranslation
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || "ar", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

// Set initial html lang attribute and direction
document.querySelector('html').setAttribute('lang', i18n.language);
document.querySelector('html').setAttribute('dir', i18n.language === 'ar' ? 'rtl' : 'ltr');

export default i18n;
