import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';

const API_URL = 'https://ilson-924833727346.asia-northeast3.run.app';

const ChatPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {receiverId, name} = route.params;

  const [textMessage, setTextMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isTranslated, setIsTranslated] = useState(false);
  const [originalMessages, setOriginalMessages] = useState([]);
  const [appLanguage, setAppLanguage] = useState('ko');

  const fetchMessages = async () => {
    const currentUserId = await AsyncStorage.getItem('userId');
    setUserId(currentUserId);

    if (!receiverId) {
      console.log('receiverId가 없습니다.');
      return;
    }
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        `${API_URL}/chats/history/${receiverId}`,
        {
          headers: {Authorization: `Bearer ${accessToken}`},
        },
      );
      let messages;
      try {
        const userResponse = await axios.get(
          `${API_URL}/profile/${currentUserId}`,
          {
            headers: {Authorization: `Bearer ${accessToken}`},
          },
        );
        const currentUserName = userResponse.data.username;
        messages = response.data.map(msg => {
          const fromSelf = msg.sender === currentUserName;
          return {
            ...msg,
            fromSelf: fromSelf,
          };
        });
      } catch (error) {
        messages = response.data.map(msg => ({
          ...msg,
          fromSelf: false,
        }));
      }
      messages = messages.reverse();
      setChatMessages(messages);
      if (isTranslated) {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const untranslated = messages.filter((msg, idx) => {
          return (
            !translatedMessages[idx] ||
            translatedMessages[idx].id !== (msg.id || msg._id)
          );
        });
        if (untranslated.length > 0) {
          const messageWithIndex = untranslated.map((msg, idx) => ({
            text: msg.message,
            idx,
            hasImage: !!msg.img,
          }));
          const originTexts = messageWithIndex
            .filter(
              item => item.text && item.text.trim() !== '' && !item.hasImage,
            )
            .map(item => item.text);
          const languageName = languageMap[appLanguage] || 'Korean';
          if (!originTexts || originTexts.length === 0) {
            setTranslatedMessages(messages);
            return;
          }
          if (!languageName) {
            Alert.alert('번역 오류', '지원하지 않는 언어입니다.');
            setTranslatedMessages(messages);
            return;
          }
          try {
            const translateResponse = await axios.post(
              `${API_URL}/translate/`,
              {originTexts, language: languageName},
              {headers: {Authorization: `Bearer ${accessToken}`}},
            );
            const translatedTexts = translateResponse.data.translatedText || [];
            // 번역된 메시지로 대체
            let translatedIdx = 0;
            const newTranslated = untranslated.map((msg, idx) => {
              if (msg.message && msg.message.trim() !== '' && !msg.img) {
                return {...msg, message: translatedTexts[translatedIdx++]};
              }
              return msg;
            });
            // 기존 번역된 메시지와 새로 번역된 메시지를 합침
            let merged = [];
            let t = 0,
              u = 0;
            for (let i = 0; i < messages.length; i++) {
              if (
                translatedMessages[i] &&
                translatedMessages[i].id === (messages[i].id || messages[i]._id)
              ) {
                merged.push(translatedMessages[i]);
              } else if (
                newTranslated[u] &&
                (newTranslated[u].id || newTranslated[u]._id) ===
                  (messages[i].id || messages[i]._id)
              ) {
                merged.push(newTranslated[u]);
                u++;
              } else {
                merged.push(messages[i]);
              }
            }
            setTranslatedMessages(merged);
          } catch (err) {
            console.error('자동 번역 실패:', err);
            setTranslatedMessages(messages);
          }
        } else {
          setTranslatedMessages(messages);
        }
      }
    } catch (error) {
      console.error('채팅 기록 조회 실패:', error);
    }
  };

  useEffect(() => {
    // 언어 정보 불러오기
    const getLanguage = async () => {
      const lang = await AsyncStorage.getItem('appLanguage');
      setAppLanguage(lang || 'ko');
    };
    getLanguage();
  }, []);

  // 기존 useEffect를 polling용으로 변경
  useEffect(() => {
    let intervalId;
    // 최초 1회 실행
    fetchMessages();
    // 3초마다 메시지 새로고침
    intervalId = setInterval(fetchMessages, 3000);
    // 언마운트 시 인터벌 해제
    return () => clearInterval(intervalId);
  }, [receiverId]);

  const formatTime = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours < 12 ? '오전' : '오후';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${ampm} ${hour12}:${minStr}`;
  };

  // 메시지 읽음 처리 함수
  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.7}, response => {
      if (response.didCancel) return;
      if (response.errorCode)
        console.error('에러 발생: ', response.errorMessage);
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  const handleSend = async () => {
    if (!textMessage.trim() && !selectedImage) return;

    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      Alert.alert('로그인 필요', '로그인이 필요합니다.');
      return;
    }

    try {
      const messageData = {
        message: textMessage.trim(),
        img: selectedImage?.uri || '',
        timeStamp: new Date(),
      };

      await axios.post(
        `${API_URL}/chats/send-message/${receiverId}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const newMessage = {
        ...messageData,
        fromSelf: true,
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sentAt: new Date(),
      };
      setChatMessages(prev => [newMessage, ...prev]);
      setTextMessage('');
      setSelectedImage(null);
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      Alert.alert('전송 실패', '메시지 전송 중 오류가 발생했습니다.');
    }
  };

  // 번역 버튼 핸들러
  const handleTranslate = async () => {
    if (isTranslated) return;
    Alert.alert(
      '언어 확인',
      `현재 선택된 언어: ${appLanguage}\n이 언어로 번역하시겠습니까?`,
      [
        {
          text: '아니오',
          style: 'cancel',
        },
        {
          text: '예',
          onPress: async () => {
            const accessToken = await AsyncStorage.getItem('accessToken');
            // 번역할 메시지와 인덱스 추출 (빈 문자열, 이미지 포함 메시지 제외)
            const messageWithIndex = chatMessages.map((msg, idx) => ({
              text: msg.message,
              idx,
              hasImage: !!msg.img,
            }));
            const originTexts = messageWithIndex
              .filter(
                item => item.text && item.text.trim() !== '' && !item.hasImage,
              )
              .map(item => item.text);
            const languageName = languageMap[appLanguage] || 'Korean';
            if (!originTexts || originTexts.length === 0) {
              setTranslatedMessages(chatMessages);
              Alert.alert('번역할 메시지가 없습니다.');
              return;
            }
            if (!languageName) {
              Alert.alert('번역 오류', '지원하지 않는 언어입니다.');
              setTranslatedMessages(chatMessages);
              return;
            }
            try {
              const response = await axios.post(
                `${API_URL}/translate/`,
                {originTexts, language: languageName},
                {headers: {Authorization: `Bearer ${accessToken}`}},
              );
              const translatedTexts = response.data.translatedText || [];
              let translatedIdx = 0;
              const translated = chatMessages.map((msg, idx) => {
                if (msg.message && msg.message.trim() !== '' && !msg.img) {
                  return {...msg, message: translatedTexts[translatedIdx++]};
                }
                return msg;
              });
              setOriginalMessages(chatMessages.map(msg => msg.message || ''));
              setTranslatedMessages(translated);
              setIsTranslated(true);
            } catch (err) {
              console.error('번역 실패:', err, err?.response?.data);
              Alert.alert('번역 실패', '메시지 번역 중 오류가 발생했습니다.');
            }
          },
        },
      ],
    );
  };

  // 번역 취소 핸들러
  const handleCancelTranslate = async () => {
    if (!isTranslated) return;
    setIsTranslated(false);
  };

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.messageBubble,
        item.fromSelf ? styles.myMessage : styles.theirMessage,
      ]}>
      {item.message && <Text style={styles.messageText}>{item.message}</Text>}
      {item.img && (
        <Image source={{uri: item.img}} style={styles.messageImage} />
      )}
      <View style={styles.messageFooter}>
        <Text style={styles.messageTime}>
          {formatTime(new Date(item.timeStamp || item.sentAt))}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, {marginTop: 20}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.backButton}
            source={require('../../assets/images/back.png')}
          />
        </TouchableOpacity>
        <Image
          style={styles.avatar}
          source={require('../../assets/images/duser.png')}
        />
        <Text style={styles.name}>{name}</Text>
      </View>

      <FlatList
        data={isTranslated ? translatedMessages : chatMessages}
        renderItem={renderMessage}
        keyExtractor={(item, index) =>
          item.id || item._id || `message-${index}`
        }
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      {selectedImage && (
        <View style={styles.previewContainer}>
          <Image
            source={{uri: selectedImage.uri}}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={[styles.inputContainer, {marginBottom: 15}]}>
        <TouchableOpacity
          style={styles.tButton}
          onPress={isTranslated ? handleCancelTranslate : handleTranslate}>
          <Text style={[styles.buttonText, {marginBottom: 3}]}>
            {isTranslated ? '취소' : '번역'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="메시지를 입력해주세요."
          placeholderTextColor="#999"
          value={textMessage}
          onChangeText={setTextMessage}
          multiline
          scrollEnabled
          numberOfLines={1}
          textAlignVertical="top"
        />
        <TouchableOpacity
          style={styles.imageButton}
          onPress={handleSelectImage}>
          <Image
            style={styles.buttonImage}
            source={require('../../assets/images/photo.png')}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Image
            style={[styles.buttonImage, {marginRight: 2}]}
            source={require('../../assets/images/send.png')}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// 언어 코드 → 영어 이름 매핑 (HomeMain과 동일하게)
const languageMap = {
  ko: 'Korean',
  en: 'English',
  jh: 'Chinese',
  th: 'Thai',
  km: 'Khmer',
  vi: 'Vietnamese',
  mn: 'Mongolian',
  uz: 'Uzbek',
  si: 'Sinhala',
  id: 'Indonesian',
  my: 'Burmese',
  ne: 'Nepali',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'black',
  },
  name: {
    fontSize: 23,
    fontWeight: '500',
    marginBottom: 5,
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 15,
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 25,
  },
  theirMessage: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 20,
  },
  messageText: {
    fontSize: 20,
  },
  messageImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    alignItems: 'center',
  },
  imageButton: {
    marginLeft: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  buttonImage: {
    width: 22,
    height: 22,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#7DCA79',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tButton: {
    marginRight: 8,
    backgroundColor: '#7DCA79',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'white',
  },
  previewContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  backButton: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
});

export default ChatPage;
