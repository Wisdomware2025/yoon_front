import {View, StyleSheet, TouchableOpacity} from 'react-native';
import HeaderWithBack from '../../components/HeaderWithBack';
import TabContainer from '../../components/TabContainer';
import {useState, useEffect} from 'react';
import {SequencedTransition} from 'react-native-reanimated';
import axios from 'axios';
const ReviewComment = () => {
  const [posts, setPosts] = useState([]);

  const [selectedTab, setSelectedTab] = useState('후기');
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const endpoint =
          selectedTab === '후기'
            ? 'https://172.28.2.114/board/review'
            : 'https://172.28.2.114/board/comment';
        const response = await axios.get(endpoint);
        setPosts(response.data);
      } catch (error) {
        console.error('게시글 가져오기 실패', error);
      }
    };

    fetchPosts();
  }, [selectedTab]);

  return (
    <View>
      <HeaderWithBack title="후기 및 댓글" />
      <TabContainer
        tabs={['후기', '댓글']}
        selectedTab={selectedTab}
        onTabPress={setSelectedTab}></TabContainer>
      <TouchableOpacity>
        <View style={styles.review}></View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({});
export default ReviewComment;
