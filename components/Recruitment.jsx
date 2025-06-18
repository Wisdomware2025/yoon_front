import {View, Text, StyleSheet} from 'react-native';
const Recruitment = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>구인완료</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: '#5CBD66',
    borderwidth: 1,
    borderRadius: 50,
    width: 150,
    height: 50,
  },
  mainText: {
    fontSize: 20,
    color: '#63CB6D',
  },
});
export default Recruitment;
