import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';
import Postcode from '@actbase/react-daum-postcode';
import styles from './style';

const data = [
  {label: '시급', value: '시급'},
  {label: '일당', value: '일당'},
  {label: '일급', value: '일급'},
  {label: '월급', value: '월급'},
];

const NewSchedule = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [value, setValue] = useState(null);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setDateSelected(true);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      setTimeSelected(true);
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
        <Text style={styles.title}>일정을 추가해보세요!</Text>
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>제목</Text>
        <TextInput
          style={styles.textInput}
          placeholder="농장이나 농밭명을 입력해주세요!"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
        />
      </View>

      {/* //날짜 추가 */}
      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>날짜</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput1}
            placeholder="달력 모양을 클릭하면 날짜를 입력할 수 있어요."
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={
              dateSelected
                ? date.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                : ''
            }
            editable={false}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowDatePicker(true)}>
              <Image
                source={require('../../assets/images/calender.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

      {/* //시간 추가 */}
      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>시간</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput1}
            placeholder="시계 모양을 클릭하면 시간을 입력할 수 있어요."
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={
              timeSelected
                ? time.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''
            }
            editable={false}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setShowTimePicker(true)}>
              <Image
                source={require('../../assets/images/clock.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>
      {/* 
      //주소 입력 */}
      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>위치</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput1}
            placeholder="예시) 봉양면 봉호로 14"
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={address}
            editable={false}
          />
          <View style={styles.buttonContainer}>
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
      {/* 
      //임금 부분 */}
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
            selectedTextStyle={styles.selectedTextStyle}
            placeholderStyle={styles.placeholderStyle}
            onChange={item => {
              setValue(item.value);
            }}
          />
          <TextInput
            style={styles.textInput1}
            placeholder={
              value === '시급' ? '현재 최저시급은 10,030원 입니다.' : '0'
            }
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
          />
          <View style={styles.buttonContainer}>
            <View style={styles.iconButton}>
              <Text>원</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>함께 일하는 사람들</Text>
        <TextInput
          style={styles.textInput}
          placeholder="농부 또는 근로자들 이름을 입력해주세요!"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
        />
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>일정 저장</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewSchedule;
