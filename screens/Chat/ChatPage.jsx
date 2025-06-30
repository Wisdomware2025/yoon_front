import React, { useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
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

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours < 12 ? '오전' : '오후';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${ampm} ${hour12}:${minStr}`;
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

      const res = await axios.post(
        `${API_URL}/chats/send-message/${receiverId}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const newMessage = {
        id: Date.now().toString(),
        fromSelf: true,
        text: messageData.message,
        image: messageData.img,
        sentAt: new Date(),
      };

      setChatMessages((prev) => [...prev, newMessage]);
      setTextMessage('');
      setSelectedImage(null);
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
      {item.text && <Text style={styles.messageText}>{item.text}</Text>}
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.messageImage} />
      )}
      <Text style={styles.messageTime}>{formatTime(new Date(item.sentAt))}</Text>
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
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
    alignSelf: 'flex-end',
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
