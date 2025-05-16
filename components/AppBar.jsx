import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import App from '../App';

const AppBar = () => {
  const navigation = useNavigation();
  const handleLanguagePress = () => {
    navigation.navigate('Language');
  };
  return (
    <View style={styles.appBar}>
      <Text style={styles.appBarTitle}>Ilson</Text>
      <View style={styles.appBarContent}>
        <TouchableOpacity onPress={handleLanguagePress}>
          <Image
            source={require('../assets/icons/Language.png')}
            style={styles.TitleImage}
          />
        </TouchableOpacity>

        <Image
          source={require('../assets/icons/alarm.png')}
          style={styles.TitleImage}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginLeft: 25,

    marginTop: 15,
    alignItems: 'center',

    backgroundColor: '#fff',
  },
  appBarContent: {
    flexDirection: 'row',
  },
  appBarTitle: {
    fontSize: 40,

    fontFamily: 'BalooPaaji2-Bold',
  },
  TitleImage: {
    marginRight: 15,
    width: 28,
    height: 28,
  },
});
export default AppBar;
