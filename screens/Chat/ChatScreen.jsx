import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChatMain from './ChatMain';
import Login from '../Auth/Login';
const Stack = createStackNavigator();

const ChatScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="ChatMain" component={ChatMain} /> */}
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

export default ChatScreen;
