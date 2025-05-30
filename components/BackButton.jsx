import {Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const BackButton = () => {
  const navigation = useNavigation();
  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity onPress={handleBackPress}>
      <Image
        source={require('../assets/icons/Back.png')}
        style={styles.backButton}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  backButton: {
    marginLeft: 15,
    width: 23,
    height: 23,
  },
});
export default BackButton;
