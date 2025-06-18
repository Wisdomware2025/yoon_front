import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CalendarMain from './CalendarMain';
import NewSchedule from './NewSchedule';
import Test from './Test';
const Stack = createStackNavigator();

const CalendarScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CalendarMain" component={CalendarMain} />
      {/* <Stack.Screen name="Test" component={Test} /> */}
      <Stack.Screen name="NewSchedule" component={NewSchedule} />
    </Stack.Navigator>
  );
};

export default CalendarScreen;
