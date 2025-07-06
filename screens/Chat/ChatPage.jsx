import React, { useState, useEffect } from 'react';
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
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const API_URL = 'https://ilson-924833727346.asia-northeast3.run.app';

const ChatPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { receiverId, name } = route.params;

  const [textMessage, setTextMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserIdAndMessages = async () => {
      const currentUserId = await AsyncStorage.getItem('userId');
      setUserId(currentUserId);

      console.log('ChatPage - receiverId:', receiverId);
      console.log('ChatPage - currentUserId:', currentUserId);

      if (!receiverId) {
        console.log('receiverId가 없습니다.');
        return;
      }
      
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        console.log('ChatPage - API 호출:', `${API_URL}/chats/history/${receiverId}`);
        
        const response = await axios.get(`${API_URL}/chats/history/${receiverId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        console.log('ChatPage - 채팅 기록 응답:', response.data);
        // 현재 사용자 정보를 가져와서 이름으로 비교
        try {
          const userResponse = await axios.get(`${API_URL}/profile/${currentUserId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const currentUserName = userResponse.data.username;
          
          console.log('currentUserId:', currentUserId);
          console.log('currentUserName:', currentUserName);
          console.log('Sample message sender:', response.data[0]?.sender);
          
          setChatMessages(response.data.map(msg => {
            const fromSelf = msg.sender === currentUserName;
            console.log(`Message: ${msg.message}, sender: ${msg.sender}, fromSelf: ${fromSelf}`);
            return {
              ...msg,
              fromSelf: fromSelf
            };
          }).reverse());
          
          // 채팅방에 들어왔을 때 읽음 처리
          await markMessagesAsRead(accessToken);
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
          // 사용자 정보 조회 실패 시 기본값으로 처리
          setChatMessages(response.data.map(msg => ({
            ...msg,
            fromSelf: false
          })).reverse());
        }
      } catch (error) {
        console.error('채팅 기록 조회 실패:', error);
      }
    };
    getUserIdAndMessages();
  }, [receiverId]);

  // 화면에 포커스될 때마다 읽음 처리
  useFocusEffect(
    React.useCallback(() => {
      const markAsRead = async () => {
        if (receiverId) {
          const accessToken = await AsyncStorage.getItem('accessToken');
          if (accessToken) {
            await markMessagesAsRead(accessToken);
          }
        }
      };
      markAsRead();
    }, [receiverId])
  );

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours < 12 ? '오전' : '오후';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${ampm} ${hour12}:${minStr}`;
  };

  // 메시지 읽음 처리 함수
  const markMessagesAsRead = async (accessToken) => {
    try {
      await axios.post(`${API_URL}/chats/read/${receiverId}`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log('메시지 읽음 처리 완료');
      
      // 로컬 메시지 상태도 읽음으로 업데이트
      setChatMessages(prev => 
        prev.map(msg => ({
          ...msg,
          isRead: true
        }))
      );
    } catch (error) {
      console.error('메시지 읽음 처리 실패:', error);
    }
  };

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) console.error('에러 발생: ', response.errorMessage);
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
        }
      );

      const newMessage = {
        ...messageData,
        fromSelf: true,
        isRead: true, // 내가 보낸 메시지는 읽음 상태로 표시
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sentAt: new Date()
      };
      setChatMessages((prev) => [newMessage, ...prev]);
      setTextMessage('');
      setSelectedImage(null);
      
      // 메시지 전송 후 읽음 처리 (상대방이 보낸 메시지들을 읽음 처리)
      await markMessagesAsRead(accessToken);
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      Alert.alert('전송 실패', '메시지 전송 중 오류가 발생했습니다.');
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.fromSelf ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {item.message && <Text style={styles.messageText}>{item.message}</Text>}
      {item.img && (
        <Image source={{ uri: item.img }} style={styles.messageImage} />
      )}
      <View style={styles.messageFooter}>
        <Text style={styles.messageTime}>{formatTime(new Date(item.timeStamp || item.sentAt))}</Text>
        {!item.fromSelf && !item.isRead && (
          <View style={styles.readBadge}>
            <Text style={styles.readBadgeText}>1</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { marginTop: 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.backButton}
            source={require('../../assets/images/back.png')}
          />
        </TouchableOpacity>
        <Image style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
      </View>

      <FlatList
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => item.id || item._id || `message-${index}`}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      {selectedImage && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}

      <View style={[styles.inputContainer, { marginBottom: 15 }]}>
        <TouchableOpacity style={styles.tButton} onPress={() => {}}>
          <Text style={[styles.buttonText, { marginBottom: 3 }]}>번역</Text>
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
        <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
          {/* <Image
            style={styles.buttonImage}
            source={require('../../assets/images/photo.png')}
          /> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          {/* <Image
            style={[styles.buttonImage, { marginRight: 2 }]}
            source={require('../../assets/images/send.png')}
          /> */}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
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
  readBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  readBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
