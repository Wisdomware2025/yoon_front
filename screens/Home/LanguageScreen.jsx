import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../../components/BackButton';
const languages = [
  {label: '한국어', code: 'ko'},
  {label: 'English', code: 'en'},
  {label: 'ภาษาไทย(태국어)', code: 'th'},
  {label: 'ភាសាខ្មែរ(캄보디아어)', code: 'km'},
  {label: 'Tiếng Việt(베트남어)', code: 'vi'},
  {label: 'Монгол хэл(몽골어)', code: 'mn'},
  {label: 'Myanma Bahasa(미얀마어)', code: 'my'},
  {label: 'नेपाली भाषा(네팔어)', code: 'ne'},
];

const LanguageScreen = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('ko');

  const handleLanguagePress = code => {
    setSelectedLanguage(code);
    // TODO: 선택된 언어로 앱 언어 변경하는 로직 추가
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.languageTitle}>언어 설정</Text>
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
              {lang.label}
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
