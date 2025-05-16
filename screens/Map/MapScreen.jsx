import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MapMain from './MapMain';
const Stack = createStackNavigator();

const MapScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MapMain" component={MapMain} />
    </Stack.Navigator>
  );
};

export default MapScreen;
