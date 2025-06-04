import {View, StyleSheet, TouchableOpacity} from 'react-native';
import HeaderWithBack from '../../components/HeaderWithBack';
import TabContainer from '../../components/TabContainer';
import {useState, useEffect} from 'react';
import {SequencedTransition} from 'react-native-reanimated';
import ReviewCard from '../../components/ReviewCard';
import PostCard from '../../components/PostCard';
import axios from 'axios';

const dummyPosts = [
  {
    receiverId: 1,
    profileImage: require('../../assets/images/ranking1.png'),
    authorName: '금장미',
    createdAt: '2025.04.16.수',
    title: '만족해요',
    content:
      '사장님이 친절하십니다. 새참이라고 하시더니 갑자기 고기 불판을 가져오셔서 구워주셨어요 ㅎㅎ',
    imageUrl: [
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
    ],
  },
  {
    profileImage: require('../../assets/images/ranking2.png'),
    name: '장은수',
    createdAt: '2025.04.15.수',
    title: '별로에요',
    content: '벌에서 드론소리나요. 벌이 너무 많아요 죽을 것 같아요.',
    imageUrl: [
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
    ],
  },
  {
    profileImage: require('../../assets/images/ranking3.png'),
    name: '김나혜',
    createdAt: '2025.04.23.수',
    title: '만족해요',
    content: '사장님이 친절하십니다.',
    imageUrl: [
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
    ],
  },
];

const ReviewComment = () => {
  const [posts, setPosts] = useState([]);

  const [selectedTab, setSelectedTab] = useState('후기');

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const endpoint =
  //         selectedTab === '후기'
  //           ? 'https://172.28.2.114/reviews/:receiverId'
  //           : 'https://172.28.2.114/board/comment';
  //       const response = await axios.get(endpoint);
  //       setPosts(response.data);
  //     } catch (error) {
  //       console.error('게시글 가져오기 실패', error);
  //     }
  //   };

  //   fetchPosts();
  // }, [selectedTab]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (selectedTab === '후기') {
          // 후기 탭은 API 데이터 + 더미 데이터
          const response = await axios.get(
            'https://172.28.2.114/reviews/:receiverId',
          );
          setPosts([...dummyPosts, ...response.data]); // 합치기
        } else {
          // 댓글 탭은 API 데이터만
          const response = await axios.get(
            'https://172.28.2.114/board/comment',
          );
          setPosts(response.data);
        }
      } catch (error) {
        console.error('게시글 가져오기 실패', error);
      }
    };

    fetchPosts();
  }, [selectedTab]);
  const sortedPosts = [...posts].sort((a, b) => {
    //최신순 정렬
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // useEffect(() => {
  //   if (selectedTab === '후기') {
  //     setPosts(dummyPosts);
  //   }
  // }, [selectedTab]);

  return (
    <View>
      <HeaderWithBack title="후기 및 댓글" style={styles.header} />
      <TabContainer
        tabs={['후기', '댓글']}
        selectedTab={selectedTab}
        onTabPress={setSelectedTab}
      />
      {selectedTab === '후기'
        ? sortedPosts.map((post, index) => {
            return (
              <ReviewCard
                key={post.receiverId || index}
                content={post.content}
                image={post.image}
                authorName={post.authorName}
                likesCnt={post.likesCnt}
                createdAt={post.createdAt}
              />
            );
          })
        : sortedPosts.map((post, index) => {
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
  header: {
    marginBottom: 10,
  },
});
export default ReviewComment;
