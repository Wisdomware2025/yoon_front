import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import axios from 'axios';
import PostCard from './PostCard';

const PostList = ({ selectedTab }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint =
          selectedTab === '농부'
            ? 'https://ilson-924833727346.asia-northeast3.run.app/board/farmer'
            : 'https://ilson-924833727346.asia-northeast3.run.app/board/worker';

        const response = await axios.get(endpoint);
        console.log('Fetched posts:', response.data);
        setPosts(response.data);
      } catch (error) {
        console.error('게시글 가져오기 실패', error);
      }
    };

    fetchPosts();
  }, [selectedTab]);

  return (
    <ScrollView>
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard
            key={post._id}
            _id={post._id}
            title={post.title}
            authorName={post.authorName}
            createdAt={post.createdAt}
            likesCnt={post.likesCnt}
            comments={
              Array.isArray(post.comments)
                ? post.comments.length
                : post.comments || 0
            }
            viewCnt={post.viewCnt}
            image={post.image || post.imgUrl}
            role={post.role}
          />
        ))
      ) : (
        <View style={{ padding: 16 }}>
          <Text>게시글이 없습니다.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default PostList;