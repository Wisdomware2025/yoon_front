import HeaderWithBack from '../../components/HeaderWithBack';
import {View, StyleSheet} from 'react-native';
import PostCard from '../../components/PostCard';

const MyLikes = () => {
  const posts = [
    {
      boardId: 1,
      title: '첫 번째 게시글',
      authorName: '철수',
      createdAt: '2025-05-31T12:34:56Z',
      viewCnt: 123,
      likesCnt: 10,
      comments: 5,
      imgUrl: require('../../assets/images/ranking1.png'),
    },
    {
      boardId: 2,
      title: '두 번째 게시글',
      authorName: '영희',
      createdAt: '2025-05-30T09:20:00Z',
      viewCnt: 456,
      likesCnt: 20,
      comments: 8,
      imgUrl: require('../../assets/images/ranking2.png'),
    },
  ];

  const sortedPosts = [...posts].sort((a, b) => {
    //최신순 정렬
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  return (
    <View style={styles.MyLikes}>
      <HeaderWithBack title="좋아요 목록" style={styles.list} />
      {sortedPosts.map((post, index) => {
        return (
          <PostCard
            key={post.boardId || index}
            title={post.title}
            authorName={post.authorName}
            createdAt={post.createdAt}
            viewCnt={post.viewCnt}
            likesCnt={post.likesCnt}
            comments={post.comments}
            imageUrl={post.imgUrl}
          />
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  MyLikes: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  list: {
    marginBottom: 30,
  },
});
export default MyLikes;
