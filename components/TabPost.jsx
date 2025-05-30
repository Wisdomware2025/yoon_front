import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import PostList from './PostList';

const TabPost = ({tabs = [], selectedTab, onTabPress}) => {
  return (
    <View>
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => onTabPress(tab)}
            style={[
              styles.tabItem,
              selectedTab === tab && styles.activeTabItem,
            ]}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <PostList selectedTab={selectedTab} />
    </View>
  );
};
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#1DB954',
  },
  tabText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
});
export default TabPost;
