import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    padding: 20,
  },

  Container: {
    width: '100%',
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    position: 'absolute',
  },

  backButton: {
    width: 25,
    height: 25,
    marginRight: 300,
    marginTop: 5,
  },

  inputForm: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 20,
  },

  inputTitle: {
    fontSize: 22,
    fontWeight: '500',
    marginLeft: 30,
  },

  textInput: {
    height: 35,
    margin: 30,
    marginTop: 15,
    padding: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
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

  textArea: {
    height: 80,
    margin: 30,
    marginTop: 15,
    textAlignVertical: 'top',
    padding: 15,
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
  },

  textArea2: {
    height: 250,
    margin: 30,
    marginTop: 15,
    textAlignVertical: 'top',
    padding: 15,
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
  },

  imageListContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 20,
  },

  imageItemContainer: {
    marginRight: 15,
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  removeImageText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },

  imageUploadButton: {
    width: 125,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    marginHorizontal: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },

  imageIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
    tintColor: '#333',
  },

  imageUploadText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
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

  buttonContainer: {
    width: 40,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    padding: 0,
    margin: 0,
    marginBottom: 30,
  },

  iconButton: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  inputContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 15,
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
