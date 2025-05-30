import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import styles from './style';

const NewPostFarmer = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      selectionLimit: 5,
      multiple: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets) {
        const newImages = response.assets.map(asset => asset.uri);
        setSelectedImages([...selectedImages, ...newImages]);
      }
    });
  };

  const renderImageItem = ({item}) => (
    <View style={styles.imageItemContainer}>
      <Image source={{uri: item}} style={styles.selectedImage} />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={() => {
          setSelectedImages(selectedImages.filter(uri => uri !== item));
        }}>
        <Text style={styles.removeImageText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.background}>
      <View style={styles.Container}>
        <Image
          source={require('../../../assets/icons/Back.png')}
          style={styles.backButton}
        />
        <Text style={styles.title}>게시글 작성</Text>
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>무슨 업무인가요?</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex) 사과 농장"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
        />
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>위치가 어디인가요?</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex) 봉양면 봉호로 14"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
        />
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>날짜를 알려주세요</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex) 2025-05-01"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
        />
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>시간을 알려주세요</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex) 오전 9시 ~ 오후 5시"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
        />
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>급여를 알려주세요</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ex) 일급 10만원"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
        />
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>제목을 작성해주세요</Text>
        <TextInput
          style={styles.textArea}
          placeholder="예시) 사과 수확 도와드립니다!"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          multiline
          numberOfLines={10}
        />
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>게시글 내용을 입력하세요</Text>
        <TextInput
          style={styles.textArea2}
          placeholder="당신의 열정을 보여주세요! 어떤 일을 잘하시나요?"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          multiline
          numberOfLines={10}
        />
      </View>

      <TouchableOpacity
        style={styles.imageUploadButton}
        onPress={handleImagePicker}>
        <Image
          source={require('../../../assets/images/photo.png')}
          style={styles.imageIcon}
        />
        <Text style={styles.imageUploadText}>사진 첨부</Text>
      </TouchableOpacity>

      <FlatList
        data={selectedImages}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageListContainer}
      />

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>게시물 올리기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewPostFarmer;
