import React from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import styles from '../style';

const PostDetailFarmer = ({isMine = false, _Id}) => {
  const mockData = {
    title: '사과 따실 분 구합니다.',
    content:
      '어 그래 현석이형이야 내일 사과따러갈 사람 구한다. 돈은 시급 10,000원이고 최저시급보다 30원 모자라지만 형이 요즘 돈이 딸려서 너그러운 마음으로 이해해주길 바란다.',
    image: require('../../../../assets/images/ddabonghs.jpeg'),
    author: 'user1234',
    authorName: '이현석',
    role: 'worker',
    location: '경상북도 영천시 화산면',
    work: '사과 따기',
    date: new Date('2025-06-06T13:05:00'),
    charge: 10000,
    createdAt: new Date('2025-06-05T12:32:00'),
    likesCnt: 6,
    viewCnt: 79,
    comments: '3',
  };

  return (
    <>
      <ScrollView style={styles.background}>
        <View style={styles.Container}>
          <TouchableOpacity>
            <Image
              source={require('../../../../assets/icons/Back.png')}
              style={styles.backButton}
            />
          </TouchableOpacity>

          {isMine && (
            <View style={[styles.Con, {marginLeft: 'auto'}]}>
              <TouchableOpacity style={[styles.Con, {marginRight: 10}]}>
                <Image
                  style={styles.smallImg}
                  source={require('../../../../assets/images/write.png')}
                />
                <Text style={[styles.samllText, {color: '#797979'}]}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Con}>
                <Image
                  style={styles.smallImg}
                  source={require('../../../../assets/images/trash.png')}
                />
                <Text style={[styles.samllText, {color: '#797979'}]}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View>
          <Text style={styles.title}>{mockData.title}</Text>
        </View>

        <View style={styles.profileCon}>
          <View style={styles.profileImg} />
          <Text style={styles.userName}>{mockData.authorName}</Text>
        </View>

        <View style={[styles.line, {marginTop: 5, marginBottom: 15}]} />

        <View style={styles.contentCon}>
          <Text style={styles.conText}>{mockData.content}</Text>
          <Image style={styles.conImg} source={mockData.image} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button}>
        <View style={styles.Con}>
          <Image
            style={[styles.img, {marginRight: 0}]}
            source={
              isMine
                ? require('../../../../assets/images/check.png')
                : require('../../../../assets/images/whitechat.png')
            }
          />
          <Text style={[styles.text, {color: 'white', fontWeight: '500'}]}>
            {isMine ? '구인완료' : '채팅하기'}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default PostDetailFarmer;
