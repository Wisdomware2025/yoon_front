import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import i18n from '../src/i18n';
const TabContainer = ({tabs = [], selectedTab, onTabPress}) => {
  // const [selectedTab, setSelectedTab] = useState(tabs[0] || '');
  const {t} = useTranslation();

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
              {t(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
});
export default TabContainer;
