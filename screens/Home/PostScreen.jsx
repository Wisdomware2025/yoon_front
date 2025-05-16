// screens/PostScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PostScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>게시글 상세 화면</Text>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
  },
});
