// screens/HomeScreen.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeMain from './HomeMain';
import PostScreen from './PostScreen';
import LanguageScreen from './LanguageScreen';
const Stack = createStackNavigator();

const HomeScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeMain" component={HomeMain} />
      <Stack.Screen name="Post" component={PostScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
    </Stack.Navigator>
  );
};

export default HomeScreen;
