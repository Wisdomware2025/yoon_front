import {View, Text, FlatList, StyleSheet, Image} from 'react-native';

const ReviewCard = (
  receiverId,
  content,
  image,
  authorName,
  likesCnt,
  createdAt,
) => {
  return (
    <FlatList
      // data={posts}
      key={receiverId}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>
                {item.isSatisfaction ? '만족해요' : '별로에요'}
              </Text>
              <Text style={styles.subTitle}>
                {item.authorName} ·{' '}
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {item.image ? (
            <Image source={{uri: item.image}} style={styles.reviewImage} />
          ) : null}

          <Text style={styles.content}>{item.content}</Text>

          <Text style={styles.likes}>좋아요 {item.likesCnt}</Text>
        </View>
      )}
    />
  );
};
const styles = StyleSheet.create({
  card: {
    padding: 15,

    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  subTitle: {
    color: '#555',
    fontSize: 12,
    marginTop: 2,
  },
  imageRow: {
    marginVertical: 8,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 6,
  },
  content: {
    fontSize: 13,
    color: '#333',
  },
});
export default ReviewCard;
