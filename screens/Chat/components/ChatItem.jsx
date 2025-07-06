import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatItem = ({ profileImage, name, message, time, receiverId }) => {
  const navigation = useNavigation();
  
  console.log('ChatItem - 받은 props:', { name, message, time, receiverId });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        console.log('ChatItem - 네비게이션 시도:', { name, receiverId });
        navigation.navigate('ChatPage', { name, receiverId });
      }}
    >
      <View style={styles.profile}>
        <Image style={styles.profileimg} />
      </View>

      <View style={[styles.box, { marginLeft: 10 }]}> 
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <View style={[styles.box, { marginLeft: 'auto' }]}> 
        <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  profileimg: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  box: {
    height: 60,
    justifyContent: 'center',
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777777',
  },
  time: {
    fontSize: 15,
    color: '#777777',
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#000000',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginTop: 4,
    alignSelf: 'center',
  },
});

export default ChatItem;
