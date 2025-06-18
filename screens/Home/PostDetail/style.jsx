import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'transparent',
    padding: 20,
  },

  Container: {
    width: '100%',
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    marginBottom: 10,
  },

  backButton: {
    width: 25,
    height: 25,
    marginRight: 'auto',
    marginTop: 5,
    marginRight: 'auto',
  },

  profileCon: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  profileImg: {
    width: 45,
    height: 45,
    backgroundColor: 'silver',
    borderRadius: 60,
    marginRight: 15,
  },

  userName: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 5,
  },

  stateCon: {
    width: '100%',
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  Con: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallImg: {
    width: 17,
    height: 17,
    opacity: 0.9,
  },

  samllText: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
    opacity: 0.9,
  },

  smallNumber: {
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 5,
    opacity: 0.9,
  },

  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    opacity: 0.5,
  },

  infCon: {
    width: '100%',
    height: 160,
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
  },

  img: {
    width: 23,
    height: 23,
    marginRight: 10,
    opacity: 0.9,
  },

  text: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 5,
    opacity: 0.9,
  },

  number: {
    fontSize: 15,
    marginBottom: 2,
    marginLeft: 5,
    opacity: 0.9,
  },

  contentCon: {
    width: '100%',
    height: 'auto',
    display: 'flex',
  },

  conText: {
    fontSize: 17,
    opacity: 0.9,
    lineHeight: 30,
    marginBottom: 20,
  },

  conImg: {
    width: '100%',
    height: 500,
    objectFit: 'cover',
    marginBottom: 100,
  },

  button: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 110,
    height: 45,
    backgroundColor: '#7DCA79',
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default styles;