import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
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
  const hanldeMyPosts = () => {
    navigation.navigate('MyPosts');
  };
  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>내 정보</Text>
      </View>

      <View style={styles.contentBox}>
        <View style={styles.photoBox} />
        <Text style={styles.name}>이름 불러오기</Text>
        <Text style={styles.intro}>소개 불러오기</Text>
      </View>

      <View style={styles.numberBox}>
        <Boxx number={'---'} title={'내 추천'} />
        <Boxx number={'---'} title={'내 게시글'} />
        <Boxx number={'---'} title={'친구'} />
      </View>

      <View style={styles.separator} />

      <View style={styles.container2}>
        <MyPageItem
          image={require('../../assets/images/profile.png')}
          title="내 정보 수정"
        />
        <MyPageItem
          image={require('../../assets/images/bill.png')}
          title="거래 내역"
        />
        <TouchableOpacity onPress={hanldeMyPosts}>
          <MyPageItem
            image={require('../../assets/images/clipboard.png')}
            title="게시글 목록"
          />
        </TouchableOpacity>
        <MyPageItem
          image={require('../../assets/images/heart.png')}
          title="좋아요 목록"
        />
        <MyPageItem
          image={require('../../assets/images/chat.png')}
          title="내 후기 및 댓글"
        />
      </View>
    </>
  );
};

export default MyPage;
