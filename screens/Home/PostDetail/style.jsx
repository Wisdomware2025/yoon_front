import { ImageBackground, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    width: '100%',
    marginTop: 50,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  backContainer: {
    width: 30,
    height: 30,
  },
  backButton: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 800,
    marginTop: 10,
  },
  profileContainer: {
    width: '100%',
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 40,
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 60,
  },
  name: {
    fontSize: 20,
    marginLeft: 20,
    marginBottom: 5,
    fontWeight: 500,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#D0D0D0',
    marginBottom: 20,
  },
  contentContainer: {
    width: '100%',
  },
  content: {
    fontSize: 20,
  },
  imgContainer: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    marginTop: 20,
  },
});

export default styles;