import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

import AppBar from '../../components/AppBar';
import PostCard from '../../components/PostCard';
import WriteButton from '../../components/WriteButton';
import TabContainer from '../../components/TabContainer';
import SearchBar from '../../components/SearchBar';
import axios from 'axios';

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODRiNWU5ZGIyNGMwZDMwNzE3MDRhMmUiLCJ1c2VybmFtZSI6IuydtO2YhOyEnSIsInBob25lTnVtIjoiMDEwOTY2NzM4OTQiLCJpYXQiOjE3NTA4MzU0MzIsImV4cCI6MTc1MDkyMTgzMn0.WS3zf0wrGBOi3LVPOZx4DfKk_M6tih6EG1RvXFBVS5k';

const dummyFarmerPosts = [
  {
    _id: 1,
    title: '감자 캐실 분 도와드립니다!',
    authorName: '김나혜',
    createdAt: '2025-05-20T12:34:56',
    viewCnt: 120,
    likesCnt: 34,
    comments: 3,
    image: require('../../assets/images/ranking1.png'),
    role: 'worker',
  },
  {
    _id: 2,
    title: '고구마 캐실 분 도와드립니다!',
    authorName: '이현석',
    createdAt: '2025-05-20T12:50:21',
    viewCnt: 13,
    likesCnt: 30,
    comments: 5,
    image: require('../../assets/images/ranking2.png'),
    role: 'worker',
  },
  {
    _id: 3,
    title: '옥수수 캐실 분 도와드립니다!',
    authorName: '최윤정정',
    createdAt: '2025-05-19T12:22:30',
    viewCnt: 19,
    likesCnt: 100,
    comments: 8,
    image: require('../../assets/images/ranking3.png'),
    role: 'worker',
  },
];
const dummyWorkerPosts = [
  {
    _id: 1,
    title: '감자 캐실 분 구해요!',
    authorName: '김나혜',
    createdAt: '2025-05-20T12:34:56',
    viewCnt: 120,
    likesCnt: 34,
    comments: 3,
    image: require('../../assets/images/ranking1.png'),
    role: 'farmer',
  },
  {
    _id: 2,
    title: '고구마 캐실 분 구해요!',
    authorName: '이현석',
    createdAt: '2025-05-20T12:50:21',
    viewCnt: 13,
    likesCnt: 30,
    comments: 5,
    image: require('../../assets/images/ranking2.png'),
    role: 'farmer',
  },
  {
    _id: 3,
    title: '옥수수 캐실 분 구해요!',
    authorName: '최윤정',
    createdAt: '2025-05-19T12:22:30',
    viewCnt: 19,
    likesCnt: 100,
    comments: 8,
    image: require('../../assets/images/ranking3.png'),
    role: 'farmer',
  },
];

const HomeMain = () => {
  const [popularProfiles, setPopularProfiles] = useState([]);
  const [searchkeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('일손 찾기');
  const [selectedFilter, setSelectedFilter] = useState('최신순');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint =
          selectedTab === '일손 찾기'
            ? 'https://ilson-924833727346.asia-northeast3.run.app/boards/farmer'
            : 'https://ilson-924833727346.asia-northeast3.run.app/boards/worker';

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setPosts(response.data);
      } catch (error) {
        setPosts(
          selectedTab === '일손 찾기' ? dummyFarmerPosts : dummyWorkerPosts,
        );
        console.error('게시글 요청 실패:', error);
      }
    };

    const fetchPopularProfiles = async () => {
      try {
        const role = selectedTab === '일손 찾기' ? 'worker' : 'farmer';

        const response = await axios.get(
          `https://ilson-924833727346.asia-northeast3.run.app/profile/popular/${role}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setPopularProfiles(response.data);
      } catch (error) {
        setPopularProfiles([
          {
            username: '김나혜',
            profileImg: require('../../assets/images/ranking1.png'),
          },
          {
            username: '이현석',
            profileImg: require('../../assets/images/ranking2.png'),
          },
          {
            username: '최윤정',
            profileImg: require('../../assets/images/ranking3.png'),
          },
        ]);
        console.error('인기 프로필 요청 실패:', error);
      }
    };

    fetchPosts();
    fetchPopularProfiles();
  }, [selectedTab]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (selectedFilter === '최신순') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (selectedFilter === '인기순') {
      return b.viewCnt - a.viewCnt;
    } else if (selectedFilter === '추천순') {
      return b.likesCnt - a.likesCnt;
    }
    return 0;
  });

  const handleSearch = async keyword => {
    try {
      const response = await axios.get(
        'https://ilson-924833727346.asia-northeast3.run.app/search',
        // 'https://ilson-924833727346.asia-northeast3.run.app/search?query={keyword}',
        {
          params: {query: keyword},
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setSearchResults(response.data);
      setSearchKeyword(keyword);
      console.log('검색 결과:', response.data);
    } catch (error) {
      console.log('키워드 값:', keyword);
      console.error('검색 실패:', error);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar />
      <SearchBar
        userType={
          selectedTab === '일손 찾기'
            ? 'farmer'
            : selectedTab === '일감 찾기'
            ? 'worker'
            : 'user'
        }
        onSearch={handleSearch}
      />
      {searchkeyword.trim() ? (
        <TabContainer
          tabs={['일손 찾기', '일감 찾기', '사람 찾기']}
          selectedTab={selectedTab}
          onTabPress={setSelectedTab}
        />
      ) : (
        <TabContainer
          tabs={['일손 찾기', '일감 찾기']}
          selectedTab={selectedTab}
          onTabPress={setSelectedTab}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {searchkeyword.trim() ? null : (
          <View style={styles.rankingSection}>
            <Text style={styles.sectionTitle}>
              {selectedTab === '일손 찾기'
                ? '이번 달 인기 알바생'
                : '이번 달 인기 농장주'}
            </Text>
            <View style={styles.rankingList}>
              {popularProfiles.slice(0, 3).map((profile, idx) => (
                <View key={idx} style={styles.rankingItem}>
                  <Image
                    source={
                      profile.profileImg &&
                      typeof profile.profileImg === 'string'
                        ? {uri: profile.profileImg}
                        : profile.profileImg
                    }
                    style={styles.rankingImage}
                  />
                  <Text style={styles.rankingName}> {profile.username} </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {searchkeyword.trim() ? null : (
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
        )}

        {searchkeyword.trim() && searchkeyword !== null ? (
          <>
            {selectedTab === '사람 찾기' ? (
              searchResults.users.length === 0 ? (
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  검색 결과가 없습니다.
                </Text>
              ) : (
                searchResults.users.map(user => (
                  <View
                    key={user._id}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderColor: '#eee',
                    }}>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      {user.username}
                    </Text>
                  </View>
                ))
              )
            ) : (
              (() => {
                const filtered = searchResults.titles.filter(post =>
                  selectedTab === '일손 찾기'
                    ? post.role === 'farmer'
                    : post.role === 'worker',
                );
                return filtered.length === 0 ? (
                  <Text style={{textAlign: 'center', marginTop: 20}}>
                    검색 결과가 없습니다.
                  </Text>
                ) : (
                  filtered.map(post => (
                    <PostCard
                      key={post._id}
                      title={post.title}
                      authorName={post.authorName}
                      createdAt={post.createdAt}
                      viewCnt={post.viewCnt}
                      likesCnt={post.likesCnt}
                      comments={post.comments}
                      image={post.image}
                      role={post.role}
                    />
                  ))
                );
              })()
            )}
          </>
        ) : (
          sortedPosts.map(post => (
            <PostCard
              key={post._id}
              title={post.title}
              authorName={post.authorName}
              createdAt={post.createdAt}
              viewCnt={post.viewCnt}
              likesCnt={post.likesCnt}
              comments={post.comments}
              image={post.image}
              role={post.role}
            />
          ))
        )}
      </ScrollView>

      <WriteButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white', paddingHorizontal: 16},
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
});

export default HomeMain;
