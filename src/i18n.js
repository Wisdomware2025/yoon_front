import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 번역 리소스 import
import ko from './locales/ko/translation.json';
import en from './translations/locales/en/translation.json';
import jh from './translations/locales/jh/translation.json';
import th from './translations/locales/th/translation.json';
import km from './translations/locales/km/translation.json';
import vi from './translations/locales/vi/translation.json';
import mn from './translations/locales/mn/translation.json';
import uz from './translations/locales/uz/translation.json';
import si from './translations/locales/si/translation.json';
import id from './translations/locales/id/translation.json';
import my from './translations/locales/my/translation.json';
import ne from './translations/locales/ne/translation.json';

// 리소스 객체 구성
const resources = {
  ko: {translation: ko},
  en: {translation: en},
  jh: {translation: jh},
  th: {translation: th},
  km: {translation: km},
  vi: {translation: vi},
  mn: {translation: mn},
  uz: {translation: uz},
  si: {translation: si},
  id: {translation: id},
  my: {translation: my},
  ne: {translation: ne},
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    const savedLang = await AsyncStorage.getItem('appLanguage');
    callback(savedLang || 'ko');
  },
  init: () => {},
  cacheUserLanguage: async lng => {
    await AsyncStorage.setItem('appLanguage', lng);
  },
};

i18n
  .use(languageDetector) // 언어 자동 감지
  .use(initReactI18next) // React와 연동
  .init({
    resources,
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false, // React XSS 자동 처리
    },
    compatibilityJSON: 'v3', // react-native 호환 설정
    react: {
      useSuspense: false, // Suspense 사용 여부
    },
  });

export default i18n;
