import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {readFile} from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../context/AuthContext';
import messaging from '@react-native-firebase/messaging';

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

const JoinIn = () => {
  const {login} = useAuth();
  const route = useRoute();
  const {phoneNum} = route.params;
  const navigation = useNavigation();
  const [username, setUserName] = useState('');
  const [intro, setIntro] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [userError, setUserError] = useState('');
  const [introError, setIntroError] = useState('');

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('사용자가 이미지를 선택하지 않았습니다.');
      } else if (response.errorCode) {
        console.log('이미지 선택 오류:', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (!username) {
      setUserError('이름을 입력해주세요!');
      return;
    }
    if (!intro) {
      setIntroError('자기소개를 입력해주세요!');
      return;
    }
    let base64Image = null;
    if (imageUri) {
      const base64Raw = await readFile(imageUri, 'base64');
      base64Image = `data:image/jpeg;base64,${base64Raw}`;
    }
    const formData = {
      phoneNum: phoneNum,
      username: username,
      intro: intro,
      profileImg: base64Image,
    };

    try {
      const response = await axios.post(
        'https://ilson-924833727346.asia-northeast3.run.app/auth/signup',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      Alert.alert('성공', '회원가입이 완료되었습니다.');
      const accessToken = response.data.accessToken;
      const userId = response.data.userId;
      await AsyncStorage.setItem('userId', userId);

      // const refreshToken = response.data.refreshToken;

      if (accessToken) {
        await AsyncStorage.setItem('accessToken', accessToken);

        // await AsyncStorage.setItem('refreshToken', refreshToken);

        console.log('Access token 저장 완료');
        // console.log('Refresh token 저장 완료');

        login();
        try {
          const fcmToken = await getFcmToken();
          const fcmTokenResponse = await axios.post(
            'https://ilson-924833727346.asia-northeast3.run.app/auth/get-fcmToken',
            {fcmToken: fcmToken},
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          // const fcmToken = fcmTokenResponse.data.fcmToken;
          // await AsyncStorage.setItem('fcmToken', fcmToken);
          // console.log('fcm token 저장 완료: ', fcmToken);
        } catch (error) {
          console.error('FCM 토큰 저장 실패:', error);
        }
      }
    } catch (error) {
      console.log('보내는 데이터:', formData);
      console.error(error.response?.data || error);
      Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
      console.log('서버 응답:', error.response?.data);
    }
  };

  return (
    <ScrollView style={styles.background}>
      <Text style={styles.headerText}>당신을 알려주세요!</Text>
      <View style={styles.contentBox}>
        <View style={styles.photoBox}>
          {imageUri && (
            <Image source={{uri: imageUri}} style={styles.previewImage} />
          )}
        </View>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleSelectImage}>
          <Image
            style={styles.image2}
            source={require('../../assets/images/camera.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.inputTitle}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="이름을 입력하세요."
          placeholderTextColor={'#919191'}
          value={username}
          onChangeText={setUserName}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.inputTitle}>자기 소개</Text>
        <TextInput
          style={styles.textArea2}
          placeholder="예시) 한국 경상북도 의성에서 농장을 몇 개 하고 있는 곽철용입니다."
          multiline
          placeholderTextColor={'#919191'}
          value={intro}
          onChangeText={setIntro}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>회원가입</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  background: {
    padding: 50,
  },
  titleContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
  },
  backImage: {
    width: 30,
    height: 30,
  },
  contentBox: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  photoBox: {
    width: 125,
    height: 125,
    borderRadius: 100,
    backgroundColor: 'black',
    position: 'absolute',
  },
  photo: {
    width: 125,
    height: 125,
    borderRadius: 300,
    resizeMode: 'cover',
  },
  uploadButton: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderRadius: 60,
    borderColor: '#000',
    backgroundColor: 'white',
    marginTop: 70,
    marginLeft: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image2: {
    width: 20,
    height: 20,
  },
  inputBox: {
    width: '100%',
    marginBottom: 25,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    padding: 10,
  },
  textArea2: {
    width: '100%',
    height: 200,
    marginTop: 15,
    textAlignVertical: 'top',
    padding: 15,
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#7DCA79',
    height: 50,
    marginVertical: 30,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default JoinIn;
