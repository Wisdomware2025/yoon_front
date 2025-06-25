import {useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const SearchBar = ({userType, onSearch}) => {
  const [keyword, setKeyword] = useState('');
  const handleSearch = () => {
    if (keyword.trim()) {
      onSearch(keyword);
    }
  };
  const getPlaceholder = () => {
    if (userType === 'farmer') {
      return '도움을 줄 일꾼을 찾아보세요!';
    } else if (userType === 'worker') {
      return '원하는 일자리를 검색해보세요!';
    } else if (userType === 'user') {
      return '함께할 사람을 찾아보세요!';
    }
  };
  return (
    <View style={styles.searchBarContainer}>
      <TouchableOpacity onPress={handleSearch}>
        <Ionicons name="search" size={20} color="gray" />
      </TouchableOpacity>

      <TextInput
        placeholder={getPlaceholder()}
        placeholderTextColor="gray"
        style={styles.searchInput}
        multiline={true}
        numberOfLines={1}
        scrollEnabled={false}
        onChangeText={text => setKeyword(text)}
        onSubmitEditing={handleSearch}
        value={keyword}
      />
    </View>
  );
};
const styles = StyleSheet.create({
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
    height: '100%',
    // textAlignVertical: 'center',
  },
});
export default SearchBar;
