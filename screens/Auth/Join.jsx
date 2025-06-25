import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 번역기능 잠시 사용 안 함
// import {useTranslation} from 'react-i18next';

const Join = () => {
  // const {t} = useTranslation();
  const [phoneNum, setPhoneNum] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [codeError, setCodeError] = useState('');
  const navigation = useNavigation();

  const handleLanguagePress = () => {
    navigation.navigate('Language');
  };

  const handleJoinInPress = () => {
    if (phoneNum.trim() === '') {
      setError('전화번호를 입력해주세요!');
      return;
    }
    if (code.trim() === '') {
      setCodeError('인증번호를 입력해주세요!');
      return;
    }
    if (phoneNum.trim() !== '' && code.trim() !== '') {
      navigation.navigate('JoinIn', {phoneNum: phoneNum});
    }
  };

  const handleSendCode = async () => {
    try {
      const cleanPhoneNum = phoneNum.replace(/-/g, '');
      console.log('전송할 번호:', cleanPhoneNum);

      const response = await axios.post(
        'https://ilson-924833727346.asia-northeast3.run.app/auth/send-code',
        {phoneNum: cleanPhoneNum},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('인증번호 전송 성공:', response.data);
      alert('인증번호가 전송되었습니다.');
    } catch (error) {
      if (error.response) {
        console.error(
          '서버 응답 오류:',
          error.response.status,
          JSON.stringify(error.response.data, null, 2),
        );
      } else {
        console.error('네트워크 오류:', error.message);
      }
      alert('인증번호 전송에 실패했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(
        'https://ilson-924833727346.asia-northeast3.run.app/auth/code-check',
        {
          phoneNum: phoneNum,
          inputCode: code,
        },
      );
      console.log('인증 성공:', response.data);

      // const {accessToken, refreshToken} = response.data;

      // await AsyncStorage.setItem('accessToken', accessToken);
      // await AsyncStorage.setItem('refreshToken', refreshToken);

      alert('인증에 성공했습니다.');
      navigation.navigate('HomeMain');
    } catch (error) {
      console.error('인증 실패:', error);
      alert('인증 중 오류가 발생했습니다.');
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLanguagePress}>
          <Image
            style={styles.Language}
            source={require('../../assets/icons/Language.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.logoText}>Ilson</Text>
        <View style={styles.content}>
          <Text style={styles.contentText}>전화번호</Text>
          <TextInput
            style={styles.phoneNumber}
            placeholder="010-1234-5678"
            value={phoneNum}
            onChangeText={text => {
              setPhoneNum(text);
              if (error) setError('');
            }}
            keyboardType="phone-pad"
          />
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          <Pressable onPress={handleSendCode}>
            <Text style={styles.certification}>전송</Text>
          </Pressable>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentText}>인증번호 입력</Text>
          <TextInput
            style={styles.phoneNumber}
            placeholder="인증번호 입력"
            value={code}
            onChangeText={text => {
              setCode(text);
              if (codeError) setCodeError('');
            }}
            keyboardType="numeric"
          />
          {codeError !== '' && (
            <Text style={styles.errorText}>{codeError}</Text>
          )}
          <Pressable onPress={handleVerifyCode}>
            <Text style={styles.certification}>확인</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.loginButton} onPress={handleJoinInPress}>
            <Text style={styles.loginButtonText}>다음</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 여기에 스타일 정의 추가하세요
});

export default Join;
