import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChatMain from './ChatMain';
const Stack = createStackNavigator();

const ChatScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ChatMain" component={ChatMain} />
    </Stack.Navigator>
  );
};

export default ChatScreen;
