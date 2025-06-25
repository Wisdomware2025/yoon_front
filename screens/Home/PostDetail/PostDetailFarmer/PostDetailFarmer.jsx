import React from 'react';
import {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import styles from '../style';
import axios from 'axios';

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

const PostDetailFarmer = () => {
  const isMine = true; //임시 설정
  const {_Id} = useRoute();
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://capstone2025-server-712956423773.europe-west1.run.app/boards/${_Id}`,
        );
        setPostData(response.data);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
        setPostData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [_Id]);
  if (loading || !postData) {
    return (
      <View>
        <Text>게시글 불러오는 중..</Text>
      </View>
    );
  }

  const {
    title,
    content,
    image,
    authorName,
    createdAt,
    likesCnt,
    viewCnt,
    comments,
    charge,
    date,
    location,
  } = postData;

  // Parse dates safely
  const created = createdAt ? new Date(createdAt) : new Date();
  const workDate = date ? new Date(date) : new Date();

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
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.profileCon}>
          <View style={styles.profileImg} />
          <Text style={styles.userName}>{authorName}</Text>
          <View style={styles.Con}>
            <Image
              style={styles.smallImg}
              source={require('../../../../assets/images/clock.png')}
            />
            <Text style={styles.samllText}>
              {Math.floor((new Date() - created) / (1000 * 60))}분 전
            </Text>
            <Text style={styles.samllText}>-</Text>
            <Text style={styles.samllText}>조회</Text>
            <Text style={styles.smallNumber}>{viewCnt}</Text>
          </View>
          <Text style={styles.samllText}>조회</Text>
          <Text style={styles.smallNumber}>{postData.viewCnt}</Text>
        </View>

        <View style={[styles.Con, {marginLeft: 'auto'}]}>
          <View style={[styles.Con, {marginRight: 15}]}>
            <Image
              style={styles.smallImg}
              source={require('../../../../assets/images/heart.png')}
            />
            <Text style={styles.smallNumber}>{likesCnt}</Text>
          </View>
          <View style={styles.Con}>
            <Image
              style={styles.smallImg}
              source={require('../../../../assets/images/chat.png')}
            />
            <Text style={styles.smallNumber}>{comments}</Text>
          </View>
        </View>

        <View style={styles.Con}>
          <Image
            style={styles.img}
            source={require('../../../../assets/images/money.png')}
          />
          <Text style={styles.text}>시급 </Text>
          <Text style={styles.number}>{charge?.toLocaleString('ko-KR')}</Text>
          <Text style={styles.text}>원</Text>
        </View>

        <View style={styles.Con}>
          <Image
            style={styles.img}
            source={require('../../../../assets/images/calender.png')}
          />
          <Text style={styles.number}>
            {date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}
          </Text>
        </View>
        <View style={styles.Con}>
          <Image
            style={styles.img}
            source={require('../../../../assets/images/clock.png')}
          />
          <Text style={styles.number}>
            {date.toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={styles.Con}>
          <Image
            style={styles.img}
            source={require('../../../../assets/images/location.png')}
          />
          <Text style={styles.text}>{location}</Text>
        </View>

        <View style={[styles.line, {marginTop: 10, marginBottom: 15}]} />

        <View style={styles.contentCon}>
          <Text style={styles.conText}>{content}</Text>
          <Image
            style={styles.conImg}
            source={typeof image === 'string' ? {uri: image} : image}
          />
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
