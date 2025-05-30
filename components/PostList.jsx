import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text} from 'react-native';
import axios from 'axios';
import PostCard from './PostCard';

const PostList = ({selectedTab}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint =
          selectedTab === '농부'
            ? 'https://172.28.2.114/board/farmer'
            : 'https://172.28.2.114/board/worker';
        const response = await axios.get(endpoint);
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
            key={post.boardId}
            title={post.title}
            authorName={post.authorName}
            createdAt={post.createdAt}
            likesCnt={post.likesCnt}
            comments={post.comments}
            imageUrl={post.imgUrl}
            // views={post.views}
          />
        ))
      ) : (
        <View style={{padding: 16}}>
          <Text>게시글이 없습니다.</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default PostList;
