import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import ChatItem from './components/ChatItem';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatList = () => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");

        if (!accessToken) {
          console.log('accessToken 없음');
          Alert.alert('오류', '로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          'https://ilson-924833727346.asia-northeast3.run.app/chats/list',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const list = response.data.chatList || [];

        if (!Array.isArray(list)) {
          console.error('chatList는 배열이 아닙니다:', list);
          setChatList([]);
        } else {
          setChatList(list);
        }
      } catch (error) {
        console.error('채팅방 목록 조회 실패:', error.message);
        setChatList([]);
        Alert.alert('오류', '채팅방 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatList();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const isAM = hours < 12;
    const formattedHours = isAM ? hours : hours - 12;
    const ampm = isAM ? '오전' : '오후';
    return `${ampm} ${formattedHours === 0 ? 12 : formattedHours}:${String(minutes).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={[styles.background, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.background}>
      <View style={[styles.titleContainer, { marginBottom: 20 }]}>
        <Text style={styles.title}>메시지</Text>
      </View>
      <View style={[styles.line, { marginBottom: 5 }]} />

      {chatList.length === 0 ? (
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center', color: 'gray' }}>채팅 내역이 없습니다.</Text>
        </View>
      ) : (
        chatList.map((item) => (
          <ChatItem
            key={item.userId}
            name={item.username}
            message={item.lastMessage}
            time={formatTime(item.timeStamp)}
            profileImage={{ uri: item.img }}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },

  titleContainer: {
    width: '100%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: 500,
  },

  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    opacity: 0.2,
  },
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
  buttonText: {
    fontSize: 15,
    fontWeight: 500,
    color: 'white',
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  imageButtonText: {
    fontSize: 20,
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tButton: {
    marginRight: 8,
    backgroundColor: '#7DCA79',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 40,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
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
  messageTime: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

});

export default ChatList;
