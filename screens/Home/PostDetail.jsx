import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://ilson-924833727346.asia-northeast3.run.app';

// 이미지 경로가 상대경로면 API_URL을 붙여 절대경로로 변환
const getFullImageUrl = imgPath => {
  if (!imgPath) return null;
  if (imgPath.startsWith('data:image/')) {
    // base64 이미지면 그대로 반환
    console.log(
      '[getFullImageUrl] base64 image detected:',
      imgPath.slice(0, 30) + '...',
    );
    return imgPath;
  }
  if (imgPath.startsWith('http')) {
    console.log('[getFullImageUrl] http image detected:', imgPath);
    return imgPath;
  }
  const fullUrl = `${API_URL}/${imgPath.replace(/^\/+/, '')}`;
  console.log('[getFullImageUrl] server image detected:', fullUrl);
  return fullUrl;
};

const PostDetail = ({route, navigation}) => {
  const boardId = route?.params?.boardId;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!boardId) {
      console.warn('boardId가 없습니다.');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const userId = await AsyncStorage.getItem('userId');
        setCurrentUserId(userId);

        const res = await axios.get(`${API_URL}/boards/board/${boardId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // 로그 추가: 서버에서 받아온 게시글 데이터
        console.log('[PostDetail] 서버에서 받아온 게시글 데이터:', res.data);
        setPost(res.data);
        setIsCompleted(res.data.isCompleted || res.data.isSelected || false);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [boardId]);

  // 현재 사용자가 게시글 작성자인지 확인
  const isMine = currentUserId && post?.author && currentUserId === post.author;

  // 구인완료(채택) 처리 함수
  const handleCompleteRecruit = async () => {
    if (!boardId) {
      console.warn('[구인완료] boardId 없음');
      return;
    }
    Alert.alert(
      '게시글 채택',
      '게시글을 채택할까요?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              const accessToken = await AsyncStorage.getItem('accessToken');
              console.log('[구인완료] accessToken:', accessToken);
              console.log(
                '[구인완료] 삭제 요청 시작:',
                `${API_URL}/boards/${boardId}`,
              );
              // author(작성자)도 body에 포함해서 DELETE 요청
              const res = await axios.delete(`${API_URL}/boards/${boardId}`, {
                headers: {Authorization: `Bearer ${accessToken}`},
                data: {author: post?.author},
              });
              console.log('[구인완료] 삭제 성공:', res.data);
              alert('게시글이 채택되었습니다.');
              navigation.navigate('HomeMain', {refresh: true});
            } catch (err) {
              if (err.response) {
                console.error('[구인완료] 서버 응답 에러:', err.response.data);
                console.error('[구인완료] status:', err.response.status);
                console.error('[구인완료] headers:', err.response.headers);
              } else if (err.request) {
                console.error(
                  '[구인완료] 요청은 됐으나 응답 없음:',
                  err.request,
                );
              } else {
                console.error(
                  '[구인완료] 요청 자체가 생성되지 않음:',
                  err.message,
                );
              }
              console.error('[구인완료] 전체 에러 객체:', err);
              alert('구인완료(삭제)에 실패했습니다.');
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  // 게시글 삭제 함수
  const handleDeletePost = async () => {
    if (!boardId) return;
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await axios.delete(`${API_URL}/boards/${boardId}`, {
        headers: {Authorization: `Bearer ${accessToken}`},
      });
      alert('게시글이 삭제되었습니다.');
      navigation.navigate('HomeMain', {refresh: true});
    } catch (err) {
      if (err.response) {
        console.error('게시글 삭제 실패: 서버 응답 에러');
        console.error('status:', err.response.status);
        console.error('headers:', err.response.headers);
        console.error('data:', err.response.data);
      } else if (err.request) {
        console.error('게시글 삭제 실패: 요청은 됐으나 응답 없음');
        console.error('request:', err.request);
      } else {
        console.error('게시글 삭제 실패: 요청 자체가 생성되지 않음');
        console.error('Error', err.message);
      }
      console.error('전체 에러 객체:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.background, styles.center]}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.background, styles.center]}>
        <Text>게시글을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const isFarmer = post.role === 'farmer';

  // 이미지 디버깅을 위한 로그
  console.log('post.image:', post.image);
  console.log('post.images:', post.images);
  console.log('post.image type:', typeof post.image);
  console.log('post.image isArray:', Array.isArray(post.image));
  console.log('post.images type:', typeof post.images);
  console.log('post.images isArray:', Array.isArray(post.images));

  // image, images 둘 다 확인해서 표시
  const displayImage = (() => {
    if (Array.isArray(post.image) && post.image.length > 0)
      return post.image[0];
    if (typeof post.image === 'string' && post.image) return post.image;
    if (Array.isArray(post.images) && post.images.length > 0)
      return post.images[0];
    if (typeof post.images === 'string' && post.images) return post.images;
    return null;
  })();

  // 디버깅: 이미지 타입과 값 확인
  console.log('[PostDetail] post.image:', post.image);
  console.log('[PostDetail] post.images:', post.images);
  console.log('[PostDetail] displayImage:', displayImage);
  if (displayImage) {
    console.log('[PostDetail] displayImage type:', typeof displayImage);
    console.log(
      '[PostDetail] displayImage is base64:',
      typeof displayImage === 'string' &&
        displayImage.startsWith('data:image/'),
    );
    const finalUri = getFullImageUrl(displayImage);
    console.log('[PostDetail] 최종 Image uri:', finalUri);
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView style={[styles.background, {flex: 1}]}>
        <View style={styles.Container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assets/images/back.png')}
              style={styles.backButton}
            />
          </TouchableOpacity>

          {isMine && (
            <View style={[styles.Con, {marginLeft: 'auto'}]}>
              <TouchableOpacity
                style={[styles.Con, {marginRight: 10}]}
                onPress={() => alert('수정 기능 준비 중')}>
                <Image
                  style={styles.smallImg}
                  source={require('../../assets/images/write.png')}
                />
                <Text style={[styles.smallText, {color: '#797979'}]}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Con} onPress={handleDeletePost}>
                <Image
                  style={styles.smallImg}
                  source={require('../../assets/images/trash.png')}
                />
                <Text style={[styles.smallText, {color: '#797979'}]}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.profileCon}>
          <View style={styles.profileImg} />
          <Text style={styles.userName}>
            {post.authorName || '작성자 정보 없음'}
          </Text>
        </View>

        <View style={[styles.stateCon, {marginBottom: 20}]}>
          <View style={styles.Con}>
            <Image
              style={styles.smallImg}
              source={require('../../assets/images/clock.png')}
            />
            <Text style={styles.smallText}>
              {post.createdAt
                ? Math.floor(
                    (new Date() - new Date(post.createdAt)) / (1000 * 60),
                  )
                : '?'}
              분 전
            </Text>
            <Text style={styles.smallText}> - 조회 </Text>
            <Text style={styles.smallNumber}>{post.viewCnt ?? 0}</Text>
          </View>
        </View>

        {isFarmer && (
          <View style={styles.infCon}>
            <View style={styles.Con}>
              <Image
                style={styles.img}
                source={require('../../assets/images/money.png')}
              />
              <Text style={styles.text}>시급 </Text>
              <Text style={styles.number}>
                {post.charge ? post.charge.toLocaleString() : '정보 없음'}
              </Text>
              <Text style={styles.text}>원</Text>
            </View>
            <View style={styles.Con}>
              <Image
                style={styles.img}
                source={require('../../assets/images/calender.png')}
              />
              <Text style={styles.number}>
                {post.date
                  ? new Date(post.date).toLocaleDateString('ko-KR')
                  : '정보 없음'}
              </Text>
            </View>
            <View style={styles.Con}>
              <Image
                style={styles.img}
                source={require('../../assets/images/clock.png')}
              />
              <Text style={styles.number}>
                {post.date
                  ? new Date(post.date).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '정보 없음'}
              </Text>
            </View>
            <View style={styles.Con}>
              <Image
                style={styles.img}
                source={require('../../assets/images/location.png')}
              />
              <Text style={styles.text}>{post.location || '정보 없음'}</Text>
            </View>
          </View>
        )}

        <View style={[styles.line, {marginTop: 10, marginBottom: 20}]} />

        <View style={styles.contentCon}>
          <Text style={styles.conText}>{post.content}</Text>
          {displayImage && (
            <Image
              style={styles.conImg}
              source={{uri: getFullImageUrl(displayImage)}}
            />
          )}
        </View>
      </ScrollView>

      {isMine ? (
        <TouchableOpacity
          style={[styles.fixedButton, isCompleted && {backgroundColor: '#aaa'}]}
          onPress={isCompleted ? undefined : handleCompleteRecruit}
          disabled={isCompleted}>
          <View style={styles.Con}>
            <Image
              style={[styles.img, {marginRight: 0}]}
              source={require('../../assets/images/check.png')}
            />
            <Text style={[styles.text, {color: 'white', fontWeight: '500'}]}>
              {isCompleted ? '구인완료' : '구인완료'}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.fixedButton, isCompleted && {backgroundColor: '#aaa'}]}
          onPress={
            isCompleted
              ? undefined
              : () =>
                  navigation.navigate('ChatPage', {
                    receiverId: post.author,
                    name: post.authorName || '작성자',
                  })
          }
          disabled={isCompleted}>
          <View style={styles.Con}>
            <Image
              style={[styles.img, {marginRight: 0}]}
              source={require('../../assets/images/whitechat.png')}
            />
            <Text style={[styles.text, {color: 'white', fontWeight: '500'}]}>
              {isCompleted ? '구인완료' : '채팅하기'}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'transparent',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Container: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    marginBottom: 10,
  },
  backButton: {
    width: 25,
    height: 25,
    marginTop: 5,
    marginRight: 'auto',
  },
  profileCon: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImg: {
    width: 45,
    height: 45,
    backgroundColor: 'silver',
    borderRadius: 60,
    marginRight: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 5,
  },
  stateCon: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Con: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallImg: {
    width: 17,
    height: 17,
    opacity: 0.9,
  },
  smallText: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
    opacity: 0.9,
  },
  smallNumber: {
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 5,
    opacity: 0.9,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    opacity: 0.2,
  },
  infCon: {
    height: 160,
    justifyContent: 'center',
    gap: 20,
  },
  img: {
    width: 23,
    height: 23,
    marginRight: 10,
    opacity: 0.9,
  },
  text: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 5,
    opacity: 0.9,
  },
  number: {
    fontSize: 15,
    marginBottom: 2,
    marginLeft: 5,
    opacity: 0.9,
  },
  contentCon: {
    width: '100%',
  },
  conText: {
    fontSize: 17,
    opacity: 0.9,
    lineHeight: 30,
    marginBottom: 20,
  },
  conImg: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  fixedButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 110,
    height: 45,
    backgroundColor: '#7DCA79',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    zIndex: 10,
  },
});

export default PostDetail;
