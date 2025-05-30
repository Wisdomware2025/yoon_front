import {View, TextInput, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const SearchBar = ({userType}) => {
  const getPlaceholder = () => {
    if (userType === 'farmer') {
      return '도움을 줄 일꾼을 찾아보세요!';
    } else if (userType === 'worker') {
      return '원하는 일자리를 검색해보세요!';
    }
  };
  return (
    <View style={styles.searchBarContainer}>
      <Ionicons name="search" size={20} color="gray" />
      <TextInput
        placeholder={getPlaceholder()}
        placeholderTextColor="gray"
        style={styles.searchInput}
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
  },
});
export default SearchBar;
