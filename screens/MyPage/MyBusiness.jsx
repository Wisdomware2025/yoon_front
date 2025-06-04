import {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import HeaderWithBack from '../../components/HeaderWithBack';
import PostCard from '../../components/PostCard';
import axios from 'axios';

const fallbackPosts = [
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

const MuBusiness = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://172.28.2.114/board/business')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('데이터 불러오는 중 오류 발생:', error);
        setPosts(fallbackPosts);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const sortedPosts = Array.isArray(posts)
    ? [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  return (
    <View style={styles.MyBusiness}>
      <HeaderWithBack title="거래 내역" style={styles.header} />
      {loading ? (
        <Text>데이터 불러오는 중...</Text>
      ) : (
        sortedPosts.map(post => (
          <PostCard
            key={post.boardId}
            title={post.title}
            authorName={post.authorName}
            createdAt={post.createdAt}
            viewCnt={post.viewCnt}
            likesCnt={post.likesCnt}
            comments={post.comments}
            imageUrl={post.imgUrl}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  MyBusiness: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 30,
  },
});
export default MuBusiness;
