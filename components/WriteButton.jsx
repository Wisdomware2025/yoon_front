import {TouchableOpacity, StyleSheet, Text, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const WriteButton = () => {
  const navigation = useNavigation();
  const handleNewPostFarmerPress = () => {
    navigation.navigate('NewPostFarmer');
  };
  return (
    <TouchableOpacity
      style={styles.writeButton}
      onPress={handleNewPostFarmerPress}>
      <Image
        source={require('../assets/icons/Pen.png')}
        style={styles.writeButtonImg}
      />

      <Text style={styles.writeButtonText}>글쓰기</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  writeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#7DCA79',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  writeButtonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: 'bold',
  },

  writeButtonImg: {
    width: 20,
    height: 20,
  },
});
export default WriteButton;
