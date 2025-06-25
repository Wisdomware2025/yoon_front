import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import {useTranslation} from 'react-i18next';
import i18n from '../../src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
  {labelKey: '한국어', code: 'ko'},
  {labelKey: 'English', code: 'en'},
  {labelKey: '中国人', code: 'jh'},
  {labelKey: 'ภาษาไทย', code: 'th'},
  {labelKey: 'ភាសាខ្មែរ', code: 'km'},
  {labelKey: 'Tiếng Việt', code: 'vi'},
  {labelKey: 'Монгол хэл', code: 'mn'},
  {labelKey: "o'zbek", code: 'uz'},
  {labelKey: 'සිංහල', code: 'si'},
  {labelKey: 'Bahasa Indonesia', code: 'id'},
  {labelKey: 'Myanma Bahasa', code: 'my'},
  {labelKey: 'नेपाली भाषा', code: 'ne'},
];

const LanguageScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || 'ko',
  );

  // 앱 시작 시 저장된 언어 불러오기
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang && savedLang !== i18n.language) {
        i18n.changeLanguage(savedLang);
        setSelectedLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);

  const handleLanguagePress = async code => {
    try {
      await i18n.changeLanguage(code);
      setSelectedLanguage(code);
      await AsyncStorage.setItem('appLanguage', code);
    } catch (err) {
      console.error('언어 변경 오류:', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.languageTitle}>{t('languageSetting')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.languageList}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={styles.languageItem}
            onPress={() => handleLanguagePress(lang.code)}>
            <Text
              style={[
                styles.languageText,
                selectedLanguage === lang.code && styles.selectedText,
              ]}>
              {lang.labelKey}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  languageTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    marginBottom: 3,
  },
  languageList: {
    marginTop: 30,
    paddingBottom: 30,
  },
  languageItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default LanguageScreen;
