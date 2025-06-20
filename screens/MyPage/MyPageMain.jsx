import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import styles from './style';

const MyPageItem = ({image, title}) => {
  return (
    <TouchableOpacity style={styles.container3}>
      <Image style={styles.img2} source={image} />
      <Text style={styles.title2}>{title}</Text>
    </TouchableOpacity>
  );
};

const Boxx = ({number, title}) => {
  return (
    <View style={styles.Box1}>
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.text1}>{title}</Text>
    </View>
  );
};

const MyPage = () => {
  const navigation = useNavigation();
  const handleMyLikesPress = () => {
    navigation.navigate('MyLikes');
  };
  const handleMyBusinessPress = () => {
    navigation.navigate('MyBusiness');
  };
  const handleMyPostsPress = () => {
    navigation.navigate('MyPosts');
  };
  const handleReviewCommentPress = () => {
    navigation.navigate('ReviewComment');
  };
  const [profile, setProfile] = useState(null);

  const userId = '683cff894e29c4d01920a301';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://172.28.2.114:5000/profile/${userId}`,
        );
        setProfile(response.data);
      } catch (error) {
        console.error('프로필 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.background}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>내 정보</Text>
      </View>

      <View style={styles.contentBox}>
        <Image style={styles.photoBox} source={{uri: profile.profileImg}} />
        <Text style={styles.name}>{profile.username}</Text>
        <Text style={styles.intro}>{profile.intro}</Text>
      </View>

      <View style={styles.numberBox}>
        <Boxx number={profile.reviewsCnt} title={'내 추천'} />
        <Boxx number={profile.boardsCnt} title={'내 게시글'} />
        <Boxx number={profile.friendsCnt} title={'친구'} />
      </View>

      <View style={styles.separator} />

      <View style={styles.container2}>
        <MyPageItem
          image={require('../../assets/images/bill.png')}
          title="거래 내역"
          onPress={handleMyBusinessPress}
        />
        <MyPageItem
          image={require('../../assets/images/clipboard.png')}
          title="게시글 목록"
          onPress={handleMyPostsPress}
        />
        <MyPageItem
          image={require('../../assets/images/heart.png')}
          title="좋아요 목록"
          onPress={handleMyLikesPress}
        />
        <MyPageItem
          image={require('../../assets/images/chat.png')}
          title="내 후기 및 댓글"
          onPress={handleReviewCommentPress}
        />
      </View>
    </ScrollView>
  );
};

export default MyPage;
