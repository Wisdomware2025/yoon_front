import {View, StyleSheet, Text} from 'react-native';
import BackButton from './BackButton';
const HeaderWithBack = ({title}) => {
  return (
    <View style={styles.header}>
      <BackButton />
      <Text style={styles.Title}>{title}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  Title: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    marginBottom: 3,
  },
});
export default HeaderWithBack;
