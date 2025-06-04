import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MyPageMain from './MyPageMain';
import MyPosts from './MyPosts';
import MyLikes from './MyLikes';
import MyBusiness from './MyBusiness';
import ReviewComment from './ReviewComment';
const Stack = createStackNavigator();

const MyPageScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MyPageMain" component={MyPageMain} />
      <Stack.Screen name="MyPosts" component={MyPosts} />
      <Stack.Screen name="MyLikes" component={MyLikes} />
      <Stack.Screen name="MyBusiness" component={MyBusiness} />
      <Stack.Screen name="ReviewComment" component={ReviewComment} />
    </Stack.Navigator>
  );
};

export default MyPageScreen;
