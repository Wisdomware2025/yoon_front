import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChatMain from './ChatMain';
import ChatPage from './ChatPage';
import Join from '../Auth/Join';
const Stack = createStackNavigator();

const ChatScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChatMain" component={ChatMain} />
      <Stack.Screen name="ChatPage" component={ChatPage} />
    </Stack.Navigator>
  );
};

export default ChatScreen;