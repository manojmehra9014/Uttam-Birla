import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import language JSON files
import en from '../assets/locales/en';
import hi from '../assets/locales/hi';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        hi: {
            translation: hi,
        },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
