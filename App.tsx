import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider, useAuth} from './context/AuthContext';
import AuthNavigator from './navigation/AuthNavigator';
import BottomNavigation from './components/BottomNavigation';
import {tryAutoLogin} from './utils/auth';
import 'react-native-get-random-values';
// import {login} from './context/AuthContext';
import './src/i18n';

import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {useEffect, useState} from 'react';

const RootNavigator = () => {
  const [fcmToken, setFcmToken] = useState<string | null | undefined>(
    undefined,
  );
  const {isLoggedIn, login} = useAuth();

  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('fcmToken');
      setFcmToken(token);

      const result = await tryAutoLogin();
      if (result.success) {
        login(result.accessToken);
      }
    };
    init();
  }, [login]);

  if (fcmToken === undefined) {
    return <AuthNavigator />;
  }

  if (fcmToken !== null) {
    return <BottomNavigation />;
  }

  return isLoggedIn ? <BottomNavigation /> : <AuthNavigator />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
