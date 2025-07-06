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
import CheckBox from '@react-native-community/checkbox';
import {useAuth} from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import jwt_decode from 'jwt-decode';

const getFcmToken = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('fcm token:', fcmToken);
        return fcmToken;
      } else {
        console.log('fcm token을 받아오지 못함');
        return null;
      }
    } else {
      console.log('FCM 권한이 허용되지 않았습니다.');
      return null;
    }
  } catch (error) {
    console.error('FCM 토큰을 발급 실패', error);
    return null;
  }
};
const Login = () => {
  const {login} = useAuth();
  const [error, setError] = useState('');
  const [codeError, setCodeError] = useState('');

  const [phoneNum, setPhoneNum] = useState('');
  const [code, setCode] = useState('');
  // const [isSelected, setSelection] = useState(false);
  const navigation = useNavigation();

  const handleLanguagePress = () => {
    navigation.navigate('Language');
  };
  const handleJoinPress = () => {
    navigation.navigate('Join');
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://ilson-924833727346.asia-northeast3.run.app/auth/Login',
        {
          phoneNum: phoneNum,
        },
      );

      console.log('로그인 성공:', response.data);
      const token = response.data.token;
      const accessToken = response.data.accessToken;
      let userId = response.data.userId;

      if (accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken);
        
        // userId가 응답에 없으면 JWT 토큰에서 추출
        if (!userId && accessToken) {
          try {
            const decodedToken = jwt_decode(accessToken);
            userId = decodedToken.userId || decodedToken.sub || decodedToken.id;
            console.log('JWT에서 추출한 userId:', userId);
          } catch (error) {
            console.error('JWT 디코드 실패:', error);
          }
        }
        
        if (userId) {
          await AsyncStorage.setItem('userId', userId);
          console.log('userId 저장 완료:', userId);
        }
        console.log('Access token 저장 완료');
        console.log('accessToken:', accessToken);
        login();
        try {
          const fcmToken = await getFcmToken();
          const fcmTokenResponse = await axios.post(
            'https://ilson-924833727346.asia-northeast3.run.app/auth/get-fcmToken',
            {fcmToken: fcmToken},

            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          console.log('fcmToken:', fcmToken);
          // const userId = response.data.userId;
          // await AsyncStorage.setItem('userId', userId);
          // console.log('userId:', userId);
          // await AsyncStorage.setItem('userId', response.data.user._id);
          // await AsyncStorage.setItem('accessToken', response.data.token);
          // const fcmToken = fcmTokenResponse.data.fcmToken;
          // await AsyncStorage.setItem('fcmToken', fcmToken);
          // console.log('fcm token 저장 완료: ', fcmToken);
        } catch (error) {
          if (error.response) {
            console.error('에러 응답:', error.response.data);
          }

          console.error('FCM 토큰 저장 실패:', error);
        }
      } else {
        console.error('로그인 실패: refreshToken이 없습니다.');
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인 중 오류가 발생했습니다.');
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
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Ilson</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.contentText}>전화번호</Text>
        <View style={styles.content}>
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
          <Pressable
            onPress={handleSendCode}
            style={styles.certificationButton}>
            <Text style={styles.certification}>전송</Text>
          </Pressable>
        </View>
        <Text style={styles.contentTexts}>인증번호 입력</Text>
        <View style={styles.content}>
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
          <Pressable
            onPress={handleVerifyCode}
            style={styles.certificationButton}>
            <Text style={styles.certification}>확인</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.footer}>
        <Pressable style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <View style={styles.loginTexts}>
          <Text style={styles.loginText}>계정이 없으신가요?</Text>
          <Pressable onPress={handleJoinPress}>
            <Text style={styles.loginLink}>계정 만들기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    widht: '100%',
    height: 100,

    justifyContent: 'center',
  },
  Language: {
    width: 30,
    height: 30,
    marginLeft: 280,
  },
  logoContainer: {
    width: '100%',
    height: 100,
    alignItems: 'center',

    overflow: 'visible',
  },
  logoText: {
    fontFamily: 'BalooPaaji2-Bold',
    fontSize: 50,
    lineHeight: 55,
    textAlign: 'center',
    transform: [{translateY: -10}],
  },
  container: {
    width: '100%',
    height: 350,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 16,
    marginLeft: 30,
    marginTop: 30,
  },
  contentTexts: {
    fontSize: 16,
    marginLeft: 30,
    marginTop: 50,
  },
  loginButton: {
    backgroundColor: '#7DCA79',
    width: '90%',
    height: 50,
    alignItems: 'center',

    justifyContent: 'center',
    borderRadius: 7,
    // marginBottom: 15,
    marginBottom: 18,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',

    marginLeft: 30,
  },
  phoneNumber: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    width: 210,
    paddingLeft: 15,
  },

  certificationButton: {
    backgroundColor: 'rgba(125, 202, 121, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 40,
    borderRadius: 5,
    marginLeft: 23,
    marginTop: 5,
  },

  certification: {
    color: '#fff',
    fontSize: 14,
  },
  loginTexts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 16,
    color: '#285EFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Login;
