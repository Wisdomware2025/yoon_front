import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Dropdown} from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import Postcode from '@actbase/react-daum-postcode';
import axios from 'axios';
import styles from './styles';

const data = [
  {label: '시급', value: '시급'},
  {label: '일당', value: '일당'},
  {label: '일급', value: '일급'},
  {label: '월급', value: '월급'},
];

const data2 = [
  {label: '농부', value: 'farmer'},
  {label: '근로자', value: 'worker'},
];

const NewPost = () => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [jobValue, setJobValue] = useState(null);
  const [address, setAddress] = useState('');
  const [value, setValue] = useState(null);
  const [charge, setCharge] = useState('');
  const [work, setWork] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      {mediaType: 'photo', includeBase64: true, selectionLimit: 0},
      response => {
        if (response.didCancel) return;
        if (response.error)
          return console.log('ImagePicker Error: ', response.error);

        if (response.assets) {
          const newImages = response.assets.map(
            asset => `data:${asset.type};base64,${asset.base64}`,
          );
          setSelectedImages(prev => [...prev, ...newImages]);
        }
      },
    );
  };

  const renderImageItem = ({item, index}) => (
    <View style={styles.imageItemContainer}>
      <Image source={{uri: item}} style={styles.selectedImage} />
      <TouchableOpacity
        style={styles.removeImageButton}
        onPress={() => {
          const updated = selectedImages.filter((_, i) => i !== index);
          setSelectedImages(updated);
        }}>
        <Text style={styles.removeImageText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const handleSubmit = async () => {
    if (!title || !content || !jobValue) {
      Alert.alert('입력 누락', '역할, 제목, 내용을 입력해주세요.');
      return;
    }

    const basePayload = {
      title,
      content,
      images: selectedImages,
      author: 'user123',
      authorName: '홍길동',
      role: jobValue.toUpperCase(),
    };

    let payload = {};
    let url = '';

    if (jobValue === 'farmer') {
      if (!work || !date || !time || !address || !charge || !value) {
        Alert.alert('입력 누락', '농부 게시글의 모든 필드를 입력해주세요.');
        return;
      }

      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(time.getHours());
      combinedDateTime.setMinutes(time.getMinutes());

      payload = {
        ...basePayload,
        location: address,
        work,
        date: combinedDateTime.toISOString(),
        wageType: value,
        charge: Number(charge),
      };

      url = 'http://172.28.2.114:5000/boards/farmer';
    } else if (jobValue === 'worker') {
      payload = {...basePayload};
      url = 'http://172.28.2.114:5000/boards/worker';
    } else {
      Alert.alert('에러', '잘못된 역할입니다.');
      return;
    }

    try {
      const res = await axios.post(url, payload);
      Alert.alert('성공', '게시글이 등록되었습니다.');
    } catch (error) {
      console.error('에러 상세:', error);
      let errorMessage = '게시글 등록에 실패했습니다.';

      if (error.response) {
        errorMessage =
          error.response.data?.message || `서버 오류: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = '서버 응답이 없습니다. 네트워크를 확인하세요.';
      } else {
        errorMessage = error.message;
      }

      Alert.alert('에러', errorMessage);
    }
  };

  return (
    <ScrollView style={styles.background}>
      <View style={styles.Container}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/icons/Back.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.title}>게시글 작성</Text>
      </View>

      <View style={[styles.Con, {marginBottom: 20}]}>
        <Dropdown
          style={styles.dropdown1}
          data={data2}
          labelField="label"
          valueField="value"
          placeholder="선택"
          value={jobValue}
          selectedTextStyle={styles.selectedTextStyle1}
          placeholderStyle={styles.placeholderStyle1}
          onChange={item => setJobValue(item.value)}
        />
        <Text style={[styles.text, {marginLeft: 10}]}>로 작성하기</Text>
      </View>

      {jobValue === 'farmer' && (
        <>
          <View style={styles.inputForm}>
            <Text style={styles.inputTitle}>무슨 업무인가요?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="ex) 사과 농장"
              value={work}
              onChangeText={setWork}
            />
          </View>

          <View style={styles.inputForm}>
            <Text style={styles.inputTitle}>위치</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput1}
                placeholder="예시) 봉양면 봉호로 14"
                value={address}
                editable={false}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setModalVisible(true)}>
                <Image
                  source={require('../../assets/images/search.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Modal isVisible={modalVisible}>
            <View style={{flex: 1, backgroundColor: 'white', borderRadius: 10}}>
              <Postcode
                style={{flex: 1}}
                jsOptions={{animation: false}}
                onSelected={data => {
                  const fullAddress = `${data.address} ${
                    data.buildingName || ''
                  }`.trim();
                  setAddress(fullAddress);
                  setModalVisible(false);
                }}
                onError={() => setModalVisible(false)}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{alignItems: 'center', padding: 10}}>
                <Text style={{color: '#285EFF'}}>닫기</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <View style={styles.inputForm}>
            <Text style={styles.inputTitle}>날짜를 알려주세요</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput1}
                placeholder="날짜를 선택해주세요."
                value={date ? date.toLocaleDateString('ko-KR') : ''}
                editable={false}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowDatePicker(true)}>
                <Image
                  source={require('../../assets/images/calender.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>

          <View style={styles.inputForm}>
            <Text style={styles.inputTitle}>시간을 알려주세요</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput1}
                placeholder="시간을 선택해주세요."
                value={
                  time
                    ? time.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''
                }
                editable={false}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowTimePicker(true)}>
                <Image
                  source={require('../../assets/images/clock.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            {showTimePicker && (
              <DateTimePicker
                value={time || new Date()}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}
          </View>

          <View style={styles.inputForm}>
            <Text style={styles.inputTitle}>임금</Text>
            <View style={styles.inputContainer}>
              <Dropdown
                style={styles.dropdown}
                data={data}
                labelField="label"
                valueField="value"
                placeholder="선택"
                value={value}
                onChange={item => setValue(item.value)}
              />
              <TextInput
                style={styles.textInput1}
                placeholder={value === '시급' ? '현재 최저시급 10,030원' : '0'}
                keyboardType="numeric"
                value={charge}
                onChangeText={setCharge}
              />
              <View style={styles.iconButton}>
                <Text>원</Text>
              </View>
            </View>
          </View>
        </>
      )}

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>제목을 작성해주세요</Text>
        <TextInput
          style={styles.textArea}
          placeholder="예시) 사과 수확 도와드립니다!"
          multiline
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>게시글 내용을 입력하세요</Text>
        <TextInput
          style={styles.textArea2}
          placeholder="당신의 열정을 보여주세요! 어떤 일을 잘하시나요?"
          multiline
          value={content}
          onChangeText={setContent}
        />
      </View>

      <TouchableOpacity
        style={styles.imageUploadButton}
        onPress={handleImagePicker}>
        <Image
          source={require('../../assets/images/photo.png')}
          style={styles.imageIcon}
        />
        <Text style={styles.imageUploadText}>사진 첨부</Text>
      </TouchableOpacity>

      <FlatList
        data={selectedImages}
        renderItem={renderImageItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imageListContainer}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>게시물 올리기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewPost;
