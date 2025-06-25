import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider, useAuth} from './context/AuthContext';
import AuthNavigator from './navigation/AuthNavigator';
import BottomNavigation from './components/BottomNavigation';
import './src/i18n';

const RootNavigator = () => {
  const {isLoggedIn} = useAuth();
  return isLoggedIn ? <BottomNavigation /> : <AuthNavigator />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
    // <BottomNavigation />
  );
}
