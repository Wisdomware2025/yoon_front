import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import TabPost from '../../components/TabPost';
import HeaderWithBack from '../../components/HeaderWithBack';
const MyPosts = () => {
  const [selectedTab, setSelectedTab] = useState('농부');
  const tabs = ['농부', '근로자'];

  const handleTabPress = tab => {
    setSelectedTab(tab);
  };
  return (
    <View>
      <HeaderWithBack title="내 게시글 목록" />
      <TabPost
        tabs={tabs}
        selectedTab={selectedTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
};
const styles = StyleSheet.create({});
export default MyPosts;
