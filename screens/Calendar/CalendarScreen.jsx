import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CalendarMain from './CalendarMain';
import UploadSchedule from './UploadSchedule';
const Stack = createStackNavigator();

const CalendarScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CalendarMain" component={CalendarMain} />
      <Stack.Screen name="UploadSchedule" component={UploadSchedule} />
    </Stack.Navigator>
  );
};

export default CalendarScreen;
