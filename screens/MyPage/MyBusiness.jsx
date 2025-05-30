import {useEffect, useState} from 'react';

import {View, StyleSheet, Text, Image, FlatList} from 'react-native';

import HeaderWithBack from '../../components/HeaderWithBack';
import axios from 'axios';

const MuBusiness = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get('https://172.28.2.114/board/review')
      .then(response => {
        setPost(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('데이터 불러오는 중 오류 발생:', error);
        setLoading(false);
      });
  }, []);

  if (!post) {
    return <Text>게시글이 없습니다.</Text>;
  }
  return (
    <View>
      <HeaderWithBack title="내 후기를 모아볼까요?" />
      <View style={styles.card}>
        <View style={styles.header}>
          <Image source={{uri: post.profileImage}} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.subTitle}>
              {post.name} {post.date}
            </Text>
          </View>
        </View>

        <FlatList
          data={post.images}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Image source={{uri: item}} style={styles.reviewImage} />
          )}
          style={styles.imageRow}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.content}>{post.content}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
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
export default MuBusiness;
