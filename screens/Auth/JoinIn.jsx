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
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../context/AuthContext';
import messaging from '@react-native-firebase/messaging';
import ReactNativeBlobUtil from 'react-native-blob-util';
import storage from '@react-native-firebase/storage';
import {useTranslation} from 'react-i18next';

// import {getApp} from '@react-native-firebase/app';
// import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {Buffer} from 'buffer';

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

// const convertImageUriToBlob = async imageUri => {
//   const base64Data = await RNFS.readFile(imageUri, 'base64');

//   const binaryString = Buffer.from(base64Data, 'base64').toString('binary');

//   const len = binaryString.length;
//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }

//   return bytes;
// };
const JoinIn = () => {
  const {t} = useTranslation();
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

    // let imageSource;
    // if (imageUri) {
    //   const base64Raw = await readFile(imageUri, 'base64');
    //   imageSource = {uri: `data:image/jpeg;base64,${base64Raw}`};
    // } else {
    //   imageSource = null;
    // }

    // await ReactNativeBlobUtil.fetch(
    //   'PUT',
    //   presigendURLs.putUrl,
    //   {
    //     'Content-Type': fileData.contentType,
    //   },
    //   ReactNativeBlobUtil.wrap(fileUri.subString(7)),
    // );
    let profileImgUrl = null;

    try {
      if (imageUri) {
        const fileName = `profile_${Date.now()}.jpg`;
        const reference = storage().ref(`profiles/${fileName}`);
        await reference.putFile(imageUri); // imageUri는 'file://'로 시작해야 함
        profileImgUrl = await reference.getDownloadURL();

        // const app = getApp();

        // const storage = getStorage(app);

        // const storageRef = ref(storage, `profiles/${fileName}`);

        // const fileBlob = await convertImageUriToBlob(imageUri);

        // await uploadBytes(storageRef, fileBlob);

        // profileImgUrl = await getDownloadURL(storageRef);
        console.log('이미지 업로드 성공:', profileImgUrl);
      } else {
        profileImgUrl = null;
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      Alert.alert('오류', '이미지 업로드 중 문제가 발생했습니다.');
      return;
    }

    const formData = {
      phoneNum,
      username,
      intro,
      profileImg: profileImgUrl,
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

      console.log('서버 응답:', response.data);

      Alert.alert('성공', '회원가입이 완료되었습니다.');

      // 서버 응답 구조 맞게 꺼내기
      const {user} = response.data;

      if (!user || !user.accessToken) {
        console.error('accessToken이 응답에 포함되어 있지 않습니다.');
        Alert.alert(
          '오류',
          '회원가입 중 문제가 발생했습니다. 다시 시도해주세요.',
        );
        return;
      }

      const {accessToken, refreshToken, userId} = user;

      // 저장
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userId', userId);

      console.log('Access token 저장 완료');
      console.log('Refresh token 저장 완료');
      console.log('userId 저장 완료:', userId);

      // 로그인 처리
      login(accessToken);

      // FCM 토큰 저장
      try {
        const fcmToken = await getFcmToken();
        await axios.post(
          'https://ilson-924833727346.asia-northeast3.run.app/auth/get-fcmToken',
          {fcmToken},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // 인증 필요시
            },
          },
        );
        console.log('fcm token 저장 완료: ', fcmToken);
      } catch (error) {
        console.error('FCM 토큰 저장 실패:', error);
      }
    } catch (error) {
      console.log('보내는 데이터:', formData);
      console.error(error.response?.data || error);
      Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
      console.log('서버 응답:', error.response?.data);
      console.log('서버 상태 코드:', error.response?.status);
    }
  };
  return (
    <ScrollView style={styles.background}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('knowYou')}</Text>
      </View>

      <View style={styles.contentBox}>
        <Image
          source={
            imageUri
              ? {uri: imageUri}
              : require('../../assets/images/defaultProfile.png')
          }
          style={styles.photoBox}
        />

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
        <Text style={styles.inputTitle}>{t('name')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('nameInputPlaceholder')}
          placeholderTextColor={'#919191'}
          value={username}
          onChangeText={setUserName}
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.inputTitle}>{t('myKnow')}</Text>
        <TextInput
          style={styles.textArea2}
          placeholder={t('myKnowPlaceholder')}
          multiline
          placeholderTextColor={'#919191'}
          value={intro}
          onChangeText={setIntro}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{t('JoinIn')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  background: {
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#fff',
  },
  titleContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
  },
  header: {
    marginTop: 10,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
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
