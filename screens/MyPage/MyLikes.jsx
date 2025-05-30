import HeaderWithBack from '../../components/HeaderWithBack';
import {View} from 'react-native';
import PostCard from '../../components/PostCard';
const MyLikes = () => {
  return (
    <View>
      <HeaderWithBack title="좋아요 목록" />
      <PostCard
      // key={post.boardId}
      // title={post.title}
      // authorName={post.authorName}
      // createdAt={post.createdAt}
      // // {/* */}
      // likesCnt={post.likesCnt}
      // comments={post.comments}
      // imageUrl={post.imgUrl}
      />
      ;
    </View>
  );
};

export default MyLikes;
