import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    padding: 20,
  },

  Container: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    position: 'absolute',
    marginRight: 10,
  },

  backButton: {
    width: 25,
    height: 25,
    marginRight: 300,
    marginTop: 5,
  },

  inputForm: {
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },

  inputTitle: {
    fontSize: 22,
    marginLeft: 30,
    fontWeight: '500',
  },

  textInput: {
    height: 40,
    marginHorizontal: 30,
    marginTop: 15,
    marginBottom: 20,
    padding: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
  },

  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 15,
  },

  textInput1: {
    flex: 1,
    height: 40,
    padding: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 30,
  },

  buttonContainer: {
    width: 40,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 30,
  },

  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  submitButton: {
    backgroundColor: '#7DCA79',
    marginHorizontal: 30,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  customPickerButton: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },

  customPickerText: {
    color: '#333',
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  modalDoneButton: {
    backgroundColor: '#fff',
    padding: 12,
    alignItems: 'center',
  },

  modalDoneText: {
    color: '#007aff',
    fontSize: 18,
    fontWeight: '600',
  },

  picker: {
    backgroundColor: '#fff',
  },

  dropdown: {
    width: 80,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    marginBottom: 30,
  },

  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
  },

  placeholderStyle: {
    fontSize: 14,
  },
});

export default styles;
