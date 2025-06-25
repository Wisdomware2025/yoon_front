import {
  Pressable,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const Start = () => {
  const navigation = useNavigation();
  const handleLanguagePress = () => {
    navigation.navigate('Language');
  };

  const handleStartPress = () => {
    navigation.navigate('Join');
  };
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.StartContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLanguagePress}>
          <Image
            source={require('../../assets/icons/Language.png')}
            style={styles.LanguageImage}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Ilson_Logo.png')}
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>Ilson</Text>
        <Text style={styles.logoSubText}>의성 일자리, 빠르고 간편하게</Text>
      </View>
      <View style={styles.footer}>
        <Pressable onPress={handleStartPress} style={styles.StartButton}>
          <Text style={styles.StartButtonText}>시작하기</Text>
        </Pressable>
        <View style={styles.loginTexts}>
          <Text style={styles.loginText}>이미 계정이 있나요? </Text>
          <Pressable onPress={handleLoginPress}>
            <Text style={styles.loginLink}>로그인</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  StartContainer: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  header: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
  },
  LanguageImage: {
    width: 30,
    height: 30,
    marginLeft: 280,
  },
  logoContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    height: 130,
    width: 260,
  },
  logoText: {
    fontSize: 40,
    fontFamily: 'BalooPaaji2-Bold',
  },
  logoSubText: {
    fontSize: 16,
    color: '#555',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  StartButton: {
    backgroundColor: '#7DCA79',
    width: '90%',
    height: 50,
    alignItems: 'center',

    justifyContent: 'center',
    borderRadius: 7,
    // marginBottom: 15,
    marginBottom: 10,
  },
  StartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginTexts: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginLink: {
    color: '#285EFF',
    fontWeight: 'bold',
  },
});

export default Start;
