import {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image, FlatList} from 'react-native';
import HeaderWithBack from '../../components/HeaderWithBack';
const dummyPosts = [
  {
    profileImage: require('../../assets/images/ranking1.png'),
    name: '금장미',
    date: '2025.04.16.수',
    title: '만족해요',
    content:
      '사장님이 친절하십니다. 새참이라고 하시더니 갑자기 고기 불판을 가져오셔서 구워주셨어요 ㅎㅎ',
    images: [
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
    ],
  },
  {
    profileImage: require('../../assets/images/ranking2.png'),
    name: '장은수',
    date: '2025.04.15.수',
    title: '별로에요',
    content: '벌에서 드론소리나요. 벌이 너무 많아요 죽을 것 같아요.',
    images: [
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
    ],
  },
  {
    profileImage: require('../../assets/images/ranking3.png'),
    name: '김나혜',
    date: '2025.04.23.수',
    title: '만족해요',
    content: '사장님이 친절하십니다.',
    images: [
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
      require('../../assets/images/apple.png'),
    ],
  },
];
const ChatMain = () => {
  const [post, setPost] = useState([]);

  useEffect(() => {
    setPost(dummyPosts);
  }, []);

  if (!post) {
    return <Text>게시글이 없습니다.</Text>;
  }

  return (
    <View style={styles.Business}>
      <HeaderWithBack title="내 후기를 모아볼까요?" />
      <View style={styles.mainTitle} />

      <FlatList
        data={post}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Image source={item.profileImage} style={styles.avatar} />
              <View style={styles.headerText}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subTitle}>
                  {item.name} {item.date}
                </Text>
              </View>
            </View>

            <FlatList
              data={item.images}
              horizontal
              keyExtractor={(img, index) => index.toString()}
              renderItem={({item: img}) => (
                <Image source={img} style={styles.reviewImage} />
              )}
              style={styles.imageRow}
              showsHorizontalScrollIndicator={false}
            />

            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainTitle: {
    marginBottom: 20,
  },
  Business: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  card: {
    padding: 15,

    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,

    marginRight: 15,
  },
  headerText: {
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  subTitle: {
    color: '#555',
    fontSize: 15,
    marginTop: 2,
  },
  imageRow: {
    marginVertical: 8,
  },
  reviewImage: {
    width: 150,
    height: 150,

    marginRight: 6,
  },
  content: {
    fontSize: 15,
    color: '#333',
  },
});

export default ChatMain;
