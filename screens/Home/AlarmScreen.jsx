import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../../components/BackButton';
const notifications = {
  어제: [
    {
      id: 1,
      message: '김나혜님이 친구 요청을 보냈습니다.',
      time: '11시간 전',
    },
    {
      id: 2,
      message: '이현석님이 내 게시물에 좋아요를 눌렀습니다.',
      time: '23시간 전',
    },
  ],
  '최근 7일': [
    {
      id: 3,
      message: '최윤정님이 나를 추천했습니다.',
      time: '3일 전',
    },
    {
      id: 4,
      message: '김태우님이 내 댓글에 좋아요를 눌렀습니다.',
      time: '3일 전',
    },
    {
      id: 5,
      message: '사과농장 일정이 3일 남았습니다.',
      time: '6일 전',
    },
  ],
  '최근 30일': [
    {
      id: 6,
      message: '김나혜님이 친구 요청을 보냈습니다.',
      time: '23시간 전',
    },
    {
      id: 7,
      message: '김나혜님이 친구 요청을 보냈습니다.',
      time: '23시간 전',
    },
  ],
};
const AlarmScreen = () => {
  return (
    <View style={styles.Alarm}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.titleWrapper}>
          <Text style={styles.Title}>알림</Text>
        </View>
      </View>
      <ScrollView style={styles.container}>
        {Object.keys(notifications).map(section => (
          <View key={section} style={styles.section}>
            {/* <View style={styles.separator} /> */}
            <Text style={styles.sectionTitle}>{section}</Text>
            {notifications[section].map(item => (
              <View key={item.id} style={styles.notification}>
                <Image
                  source={require('../../assets/images/ranking3.png')}
                  style={styles.avatar}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.message}>{item.message}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Image
                  source={require('../../assets/images/apple.png')}
                  style={styles.thumbnail}
                />
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  Alarm: {
    backgroundColor: 'white',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    position: 'relative',
  },
  titleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  Title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  thumbnail: {
    width: 45,
    height: 45,
    borderRadius: 4,
    marginLeft: 8,
  },
  // separator: {
  //   borderTopWidth: 2,
  //   borderTopColor: '#E0E0E0',
  //   marginBottom: 20,
  //   width: '100%',
  // },
});
export default AlarmScreen;
