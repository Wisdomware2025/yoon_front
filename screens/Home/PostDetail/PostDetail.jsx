import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './style';
import axios from 'axios';

const PostDetail = () => {
  return (
    <View style={styles.background}>
      <TouchableOpacity style={styles.backContainer}>
        <Image
          source={require('../../../assets/icons/Back.png')}
          style={styles.backButton}
        />
      </TouchableOpacity>
      <Text style={styles.title}>불러오기</Text>
      <View style={styles.profileContainer}>
        <View style={styles.profile} />
        <Text style={styles.name}>불러오기</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.contentContainer}>
        <Text style={styles.content}>불러오기</Text>
      </View>
      <View style={styles.imgContainer}>
        <Image />
      </View>
    </View>
  );
};

export default PostDetail;
