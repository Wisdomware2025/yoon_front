import {View, StyleSheet, Text, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PostCard = () => {
  return (
    <View style={styles.postCard}>
      <View style={styles.postContent}>
        <View style={styles.postText}>
          <Text style={styles.postTitle}>사과 수확 도와드립니다!</Text>
          <Text style={styles.postAuthor}>- 성실한 사과</Text>

          <View style={styles.postInfoRow}>
            <Ionicons
              name="time-outline"
              size={14}
              style={styles.postInfoIcon}
            />
            <Text style={styles.postInfoText}>33분 전 · 조회 79</Text>
          </View>
        </View>

        <View style={styles.postImageWrapper}>
          <Image
            source={require('../assets/img/apple.png')}
            style={styles.postImage}
          />

          <View style={styles.iconRow}>
            <Ionicons name="heart-outline" size={16} />
            <Text style={styles.iconText}>6</Text>
            <Ionicons
              name="chatbubble-ellipses-outline"
              style={styles.iconTextChat}
            />
            <Text style={styles.iconText}>3</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#fff',
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  postContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  postText: {
    flex: 1,
    marginRight: 10,
  },

  postTitle: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  postAuthor: {
    color: '#666',
    marginTop: 2,
    fontSize: 13,
    marginBottom: 25,
  },

  postInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  postInfoIcon: {
    marginRight: 4,
  },

  postInfoText: {
    fontSize: 12,
    color: '#888',
  },

  postImageWrapper: {
    alignItems: 'center',
  },

  postImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },

  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  iconText: {
    fontSize: 12,
    marginLeft: 2,
  },

  iconTextChat: {
    marginLeft: 10,
    fontSize: 12,
  },
});

export default PostCard;
