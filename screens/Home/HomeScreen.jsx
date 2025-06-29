// screens/HomeScreen.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeMain from './HomeMain';
// import PostDetail from './PostDetail/PostDetail';
import LanguageScreen from './LanguageScreen';
import PostDetailFarmer from './PostDetail/PostDetailFarmer/PostDetailFarmer';
import PostDetailWorker from './PostDetail/PostDetailWorker/PostDetailWorker';
import NewPost from './NewPost';
import AlarmScreen from './AlarmScreen';
const Stack = createStackNavigator();

const HomeScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeMain" component={HomeMain} />
      {/* <Stack.Screen name="PostDetail" component={PostDetail} /> */}
      <Stack.Screen name="PostDetailFarmer" component={PostDetailFarmer} />
      <Stack.Screen name="PostDetailWorker" component={PostDetailWorker} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Alarm" component={AlarmScreen} />
      <Stack.Screen name="NewPost" component={NewPost} />
    </Stack.Navigator>
  );
};

export default HomeScreen;
