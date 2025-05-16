import {StyleSheet, View, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CalendarScreen from '../screens/Calendar/CalendarScreen';
import MapScreen from '../screens/Map/MapScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import MyPageScreen from '../screens/MyPage/MyPageScreen';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (route, focused, color) => {
  let iconName;

  switch (route.name) {
    case '홈':
      iconName = focused
        ? require('../assets/icons/Home_Fill.png')
        : require('../assets/icons/Home.png');
      return <Image source={iconName} style={styles.icon} />;
    case '문자':
      iconName = focused
        ? 'chatbubble-ellipses'
        : 'chatbubble-ellipses-outline';
      return <Ionicons name={iconName} size={30} color={color} />;
    case '지도':
      iconName = focused
        ? require('../assets/icons/Map_Fill.png')
        : require('../assets/icons/Map.png');
      return <Image source={iconName} style={styles.icon} />;
    case '내 정보':
      iconName = focused
        ? require('../assets/icons/Person_Fill.png')
        : require('../assets/icons/Person.png');
      return <Image source={iconName} style={styles.icon} />;
    case '달력':
      iconName = focused
        ? require('../assets/icons/Calender_Fill.png')
        : require('../assets/icons/Calender.png');
      return <Image source={iconName} style={styles.icon} />;
    default:
      return null;
  }
};

const BottomNavigation = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color}) =>
              getTabBarIcon(route, focused, color),
            tabBarActiveTintColor: 'rgb(109, 163, 77)',
            tabBarInactiveTintColor: '#595959',
            headerShown: false,
          })}>
          <Tab.Screen name="달력" component={CalendarScreen} />
          <Tab.Screen name="지도" component={MapScreen} />
          <Tab.Screen name="홈" component={HomeScreen} />
          <Tab.Screen name="문자" component={ChatScreen} />
          <Tab.Screen name="내 정보" component={MyPageScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
  },
  icon: {
    width: 35,
    height: 30,
  },
});
