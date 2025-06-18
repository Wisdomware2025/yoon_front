import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  background: {
    padding: 30,
  },

  titleContainer: {
    width: '100%',
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 500,
    marginLeft: 30,
  },
  contentBox: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 20,
  },
  photoBox: {
    width: 125,
    height: 125,
    borderRadius: 100,
    backgroundColor: 'black',
  },
  name: {
    fontSize: 20,
    fontWeight: 500,
  },
  intro: {
    fontSize: 13,
    color: '#424242',
  },
  numberBox: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 65,
  },
  Box1: {
    width: 'auto',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 30,
    fontWeight: 500,
  },
  text1: {
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 30,
  },
  container2: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 30,
    gap: 35,
  },
  container3: {
    width: '100%',
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  img2: {
    width: 27,
    height: 27,
  },
  title2: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 2,
  },
});

export default styles;
