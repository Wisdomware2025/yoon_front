import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Start from '../screens/Auth/Start';
import Join from '../screens/Auth/Join';
import JoinIn from '../screens/Auth/JoinIn';
import Login from '../screens/Auth/Login';
import LanguageScreen from '../screens/Home/LanguageScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Start" component={Start} />
    <Stack.Screen name="Join" component={Join} />
    <Stack.Screen name="JoinIn" component={JoinIn} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Language" component={LanguageScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
