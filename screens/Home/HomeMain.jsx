import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppBar from '../../components/AppBar';
import PostCard from '../../components/PostCard';
const HomeMain = () => {
  const [selectedTab, setSelectedTab] = useState('농부');
  const [selectedFilter, setSelectedFilter] = useState('최신순');
  const rankingImages = [
    require('../../assets/img/ranking1.png'),
    require('../../assets/img/ranking2.png'),
    require('../../assets/img/ranking3.png'),
  ];
  return (
    <View style={styles.container}>
      <AppBar />
      <View style={styles.tabContainer}>
        {['농부', '근로자'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
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

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="도움을 줄 일꾼을 찾아보세요!"
          placeholderTextColor="gray"
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>이번 달 인기 알바생</Text>
          <View style={styles.rankingList}>
            {['김나혜', '이현석', '최윤정'].map((name, idx) => (
              <View key={idx} style={styles.rankingItem}>
                <Image
                  source={rankingImages[idx]}
                  style={styles.rankingImage}
                />
                <Text style={styles.rankingName}>{name}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.filterContainer}>
          {['최신순', '인기순', '추천순'].map(filter => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilterButton,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.activeFilterText,
                ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {[1, 2, 3].map((_, index) => (
          <PostCard key={index} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.writeButton}>
        <Image
          source={require('../../assets/icons/Pen.png')}
          style={styles.writeButtonImg}
        />

        <Text style={styles.writeButtonText}>글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white', paddingHorizontal: 16},
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
  searchBarContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 30,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  rankingSection: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  rankingList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rankingItem: {
    alignItems: 'center',
    flex: 1,
  },
  rankingImage: {
    width: 70,
    height: 70,
    borderRadius: 50,

    marginBottom: 6,
  },
  rankingName: {
    fontSize: 12,
    marginBottom: 13,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderColor: '#D0D0D0',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    width: 100,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#7DCA79',
    borderColor: '#7DCA79',
  },
  filterText: {
    fontSize: 13,
  },
  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },

  writeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#7DCA79',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  writeButtonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: 'bold',
  },

  writeButtonImg: {
    width: 20,
    height: 20,
  },
});

export default HomeMain;
