import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const tryAutoLogin = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  if (!refreshToken) {
    return {success: false, reaon: 'No refresh token found'};
  }

  try {
    const response = await axios.post(
      'https://ilson-924833727346.asia-northeast3.run.app/auth/auto-login',
      {},
      {
        withCredentials: true,
      },
      // {
      //   refreshToken: refreshToken,
      // },
    );

    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    await AsyncStorage.setItem('accessToken', newAccessToken);
    await AsyncStorage.setItem('refreshToken', newRefreshToken);

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error('자동 로그인 실패:', error);
    if (error.response) {
      console.error(
        '서버 응답 오류:',
        error.response.status,
        error.response.data,
      );
    } else {
      console.error('네트워크 오류:', error.message);
    }
    return {success: false, reason: 'refresh_failed'};
  }
};
