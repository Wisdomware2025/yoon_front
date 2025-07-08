import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// import MapMain from './MapMain';
import Test from './Test';
const Stack = createStackNavigator();

const MapScreen = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="MapMain" component={MapMain} /> */}
      <Stack.Screen name="test" component={Test} />
    </Stack.Navigator>
  );
};

export default MapScreen;
