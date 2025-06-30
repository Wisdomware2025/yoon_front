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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import i18n from '../../src/i18n';

const languageMap = {
  ko: 'Korean',
  en: 'English',
  jo: 'Arabic',
  th: 'Thai',
  km: 'Khmer',
  vi: 'Vietnamese',
  mn: 'Mongolian',
  wo: 'Wolof',
  si: 'Sinhala',
  id: 'Indonesian',
  my: 'Burmese',
  ne: 'Nepali',
};

const HomeMain = () => {
  const {t} = useTranslation();
  const [popularProfiles, setPopularProfiles] = useState([]);
  const [searchkeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedTab, setSelectedTab] = useState(t('workerFind'));
  const [selectedFilter, setSelectedFilter] = useState('최신순');
  const [accessToken, setAccessToken] = useState('');

  const fetchTranslate = async texts => {
    const languageCode = i18n.language;
    const languageName = languageMap[languageCode] || 'Korean';
    try {
      const response = await axios.post(
        'https://ilson-924833727346.asia-northeast3.run.app/translate',
        {
          originTexts: texts,

          language: languageName,
        },
      );
      console.log('전체 응답 데이터:', response.data);
      console.log('번역 api 응답:', response.data);

      return Array.isArray(response.data.translatedTexts)
        ? response.data.translatedTexts
        : [];
    } catch (error) {
      console.log('보내는 언어:', languageName);
      console.log('보내는 값: ', texts);
      console.error('번역 api 오류: ', error);

      return texts;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      setAccessToken(accessToken);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchPosts = async () => {
      try {
        const endpoint =
          selectedTab === t('workerFind') //'일손 찾기'
            ? 'https://ilson-924833727346.asia-northeast3.run.app/boards/farmer'
            : 'https://ilson-924833727346.asia-northeast3.run.app/boards/worker';

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('전체 응답 데이터:', response.data);

        const rawPosts = response.data?.posts;

        const originalPosts = Array.isArray(response.data) ? response.data : [];

        const titles = originalPosts.map(post => post.title);

        const translatedTitles = await fetchTranslate(titles);

        const translatedPosts = originalPosts.map((post, index) => ({
          ...post,
          title: translatedTitles[index] || post.title,
        }));
        console.log('번역된 게시글:', translatedPosts);
        console.log('받은 posts:', response.data?.posts);
        console.log('originalPosts:', originalPosts);
        console.log('titles:', titles);
        setPosts(translatedPosts);
      } catch (error) {
        console.error('게시글 요청 실패:', error);
      }
    };

    const fetchPopularProfiles = async () => {
      try {
        const role = selectedTab === 'workerFind' ? 'worker' : 'farmer';

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
  }, [selectedTab, accessToken, t]);

  const sortedPosts = Array.isArray(posts)
    ? [...posts].sort((a, b) => {
        if (selectedFilter === t('Latest')) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (selectedFilter === t('Popular')) {
          return b.viewCnt - a.viewCnt;
        } else if (selectedFilter === t('Recommended')) {
          return b.likesCnt - a.likesCnt;
        }
        return 0;
      })
    : [];

  const handleSearch = async keyword => {
    try {
      const response = await axios.get(
        'https://ilson-924833727346.asia-northeast3.run.app/search',

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
          selectedTab === 'workerFind'
            ? 'farmer'
            : selectedTab === 'findingWork'
            ? 'worker'
            : 'user'
        }
        onSearch={handleSearch}
      />
      {searchkeyword.trim() ? (
        <TabContainer
          tabs={['workerFind', 'findingWork', 'personFind']}
          selectedTab={selectedTab}
          onTabPress={setSelectedTab}
        />
      ) : (
        <TabContainer
          tabs={['workerFind', 'findingWork']}
          selectedTab={selectedTab}
          onTabPress={setSelectedTab}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {searchkeyword.trim() ? null : (
          <View style={styles.rankingSection}>
            <Text style={styles.sectionTitle}>
              {selectedTab === 'workerFind'
                ? t('popularMonthWorker')
                : t('popularMonthFarmer')}
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
            {[t('Latest'), t('Popular'), t('Recommended')].map(filter => (
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
            {selectedTab === t('personFind') ? (
              searchResults.users.length === 0 ? (
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  {t('searchResultNotFound')}
                  {/* 검색 결과가 없습니다. */}
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
                  selectedTab === 'workerFind'
                    ? post.role === 'farmer'
                    : post.role === 'worker',
                );
                return filtered.length === 0 ? (
                  <Text style={{textAlign: 'center', marginTop: 20}}>
                    {t('searchResultNotFound')}
                  </Text>
                ) : (
                  filtered.map(post => (
                    <PostCard
                      key={post._id}
                      _id={post._id}
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
              _id={post._id}
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
    alignItems: 'center',
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

    color: '#7DCA79',
  },
  activeFilterButton: {
    backgroundColor: '#7DCA79',
    borderColor: '#7DCA79',
    alignItems: 'center',
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