import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MyPageMain from './MyPageMain';
const Stack = createStackNavigator();

const MyPageScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MyPageMain" component={MyPageMain} />
      {/* Add other screens here if needed */}
    </Stack.Navigator>
  );
};

export default MyPageScreen;
