// screens/HomeScreen.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeMain from './HomeMain';
import PostDetail from './PostDetail/PostDetail';
import LanguageScreen from './LanguageScreen';
import NewPostFarmer from './NewPostFarmer/NewPostFarmer';
import NewPostWorker from './NewPostWorker/NewPostWorker';
import AlarmScreen from './AlarmScreen';
const Stack = createStackNavigator();

const HomeScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeMain" component={HomeMain} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Alarm" component={AlarmScreen} />
      <Stack.Screen name="NewPostFarmer" component={NewPostFarmer} />
      <Stack.Screen name="NewPostWorker" component={NewPostWorker} />
    </Stack.Navigator>
  );
};

export default HomeScreen;
