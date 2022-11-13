import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import zh from '../locales/zh-CN.json';
import en from '../locales/en.json';
import jp from '../locales/ja.json';
i18n.use(LanguageDetector).init({
    resources: {
        en: { translation: en },
        zh: { translation: zh },
        ja: { translation: jp },
    },
    fallbackLng: 'zh',
    debug: __isDev__,
    detection: {
        order: ['querystring', 'navigator', 'localStorage'],
        lookupQuerystring: 'lang',
    },
});
export const useTranslation = () => {
    return {
        t(...args: Parameters<typeof i18n['t']>) {
            return i18n.t(...args);
        },
    };
};
// console.log(i18n);
export default i18n;
