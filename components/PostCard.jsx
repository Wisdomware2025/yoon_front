import {View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const PostCard = ({
  title,
  authorName,
  createdAt,
  viewCnt,
  likesCnt,

  comments,
  imageUrl,
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('PostDetail')}>
      <View style={styles.postCard}>
        <View style={styles.postContent}>
          <View style={styles.postText}>
            <Text style={styles.postTitle}>{title}</Text>
            <Text style={styles.postAuthor}>- {authorName}</Text>

            <View style={styles.postInfoRow}>
              <Ionicons
                name="time-outline"
                size={14}
                style={styles.postInfoIcon}
              />
              <Text style={styles.postInfoText}>
                {dayjs(createdAt).fromNow()} · 조회 {viewCnt}
              </Text>
            </View>
          </View>

          <View style={styles.postImageWrapper}>
            <Image
              source={{uri: imageUrl}}
              style={styles.postImage}
              resizeMode="cover"
            />
            <View style={styles.iconRow}>
              <Ionicons name="heart-outline" size={16} />
              <Text style={styles.iconText}>{likesCnt}</Text>
              <Ionicons
                name="chatbubble-ellipses-outline"
                style={styles.iconTextChat}
              />
              <Text style={styles.iconText}>{comments}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
