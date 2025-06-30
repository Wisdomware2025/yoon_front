import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import Modal from 'react-native-modal';
import Postcode from '@actbase/react-daum-postcode';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './style';

const wageTypeOptions = [
  { label: '시급', value: '시급' },
  { label: '일당', value: '일당' },
  { label: '일급', value: '일급' },
  { label: '월급', value: '월급' },
];

const getFormattedDateWithDay = dateString => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[date.getDay()];
  return `${month}월 ${day}일 (${dayName})`;
};

const formatTime = date => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const NewSchedule = () => {
  const route = useRoute();
  const passedDate = route.params?.selectedDate?.dateString;
  const today = passedDate ? new Date(passedDate) : new Date();
  const todayString = today.toISOString().split('T')[0];

  const [date1, setDate1] = useState(getFormattedDateWithDay(todayString));
  const [date2, setDate2] = useState(getFormattedDateWithDay(todayString));
  const [date1Time, setDate1Time] = useState(new Date(today.setHours(8, 0, 0, 0)));
  const [date2Time, setDate2Time] = useState(new Date(today.setHours(9, 0, 0, 0)));

  const [activeDateField, setActiveDateField] = useState(null);
  const [activeTimeField, setActiveTimeField] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  const [value, setValue] = useState(null);
  const [charge, setCharge] = useState('');
  const [work, setWork] = useState('');
  const [workers, setWorkers] = useState('');

  const handleDateSelect = day => {
    const formatted = getFormattedDateWithDay(day.dateString);
    if (activeDateField === 'date1') setDate1(formatted);
    else if (activeDateField === 'date2') setDate2(formatted);
    setShowCalendar(false);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      if (activeTimeField === 'date1Time') setDate1Time(selectedTime);
      else if (activeTimeField === 'date2Time') setDate2Time(selectedTime);
    }
    setShowTimePicker(false);
  };

  const parseToISODate = dateStr => {
    const match = dateStr.match(/(\d+)월 (\d+)일/);
    if (!match) return null;
    const month = match[1].padStart(2, '0');
    const day = match[2].padStart(2, '0');
    const year = new Date().getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    if (!date1 || !date2 || !address || !charge || !work || !workers || !value) {
      Alert.alert('모든 필드를 입력해주세요.');
      return;
    }

    const date1ISO = parseToISODate(date1);
    const date2ISO = parseToISODate(date2);
    const accessToken = await AsyncStorage.getItem('accessToken');
    const author = await AsyncStorage.getItem('userId');

    try {
      await axios.post(
        `https://ilson-924833727346.asia-northeast3.run.app/schedules`,
        {
          startDate: date1ISO,
          endDate: date2ISO,
          startTime: date1Time.toTimeString().slice(0, 5),
          endTime: date2Time.toTimeString().slice(0, 5),
          workers,
          work,
          location: address,
          charge,
          chargeType: value,
          author,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Alert.alert('일정이 성공적으로 저장되었습니다!');
      setDate1(getFormattedDateWithDay(todayString));
      setDate2(getFormattedDateWithDay(todayString));
      setDate1Time(new Date(today.setHours(8, 0, 0, 0)));
      setDate2Time(new Date(today.setHours(9, 0, 0, 0)));
      setAddress('');
      setValue(null);
      setCharge('');
      setWork('');
      setWorkers('');
    } catch (error) {
      console.error('스케줄 저장 실패:', error.response?.data || error.message);
      Alert.alert('스케줄 저장 실패', error.response?.data?.message || error.message);
    }
  };

  return (
    <ScrollView style={styles.background}>
      <View style={styles.Container}>
        <TouchableOpacity>
          <Image source={require('../../assets/icons/Back.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.title}>일정을 추가해보세요!</Text>
      </View>

      <View style={styles.box1}>
        <View style={styles.box2}>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => {
              setActiveDateField('date1');
              setShowCalendar(true);
            }}>
            <Text style={styles.text1}>{date1}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => {
              setActiveTimeField('date1Time');
              setShowTimePicker(true);
            }}>
            <Text style={styles.text1}>{formatTime(date1Time)}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.box3}>
          <Image source={require('../../assets/images/right.png')} style={styles.rightimg} />
        </View>

        <View style={styles.box2}>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => {
              setActiveDateField('date2');
              setShowCalendar(true);
            }}>
            <Text style={styles.text1}>{date2}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touch}
            onPress={() => {
              setActiveTimeField('date2Time');
              setShowTimePicker(true);
            }}>
            <Text style={styles.text1}>{formatTime(date2Time)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal isVisible={showCalendar} onBackdropPress={() => setShowCalendar(false)}>
        <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
          <Calendar onDayPress={handleDateSelect} />
          <TouchableOpacity
            onPress={() => setShowCalendar(false)}
            style={{ marginTop: 10, alignItems: 'center', padding: 10 }}>
            <Text style={{ color: '#285EFF', fontWeight: 'bold' }}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {showTimePicker && (
        <DateTimePicker
          value={activeTimeField === 'date1Time' ? date1Time : date2Time}
          mode="time"
          display="spinner"
          locale="ko-KR"
          onChange={handleTimeChange}
        />
      )}

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>제목</Text>
        <TextInput
          style={styles.textInput}
          placeholder="농장이나 농밭명을 입력해주세요!"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
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
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            value={address}
            editable={false}
          />
          <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
            <Image source={require('../../assets/images/search.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal isVisible={modalVisible}>
        <View style={{ flex: 1, backgroundColor: 'white', borderRadius: 10 }}>
          <Postcode
            style={{ flex: 1 }}
            jsOptions={{ animation: false }}
            onSelected={data => {
              const fullAddress = `${data.address} ${data.buildingName || ''}`.trim();
              setAddress(fullAddress);
              setModalVisible(false);
            }}
            onError={() => setModalVisible(false)}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ alignItems: 'center', padding: 10 }}>
            <Text style={{ color: '#285EFF' }}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>임금</Text>
        <View style={styles.inputContainer}>
          <Dropdown
            style={styles.dropdown}
            data={wageTypeOptions}
            labelField="label"
            valueField="value"
            placeholder="선택"
            value={value}
            selectedTextStyle={styles.selectedTextStyle}
            placeholderStyle={styles.placeholderStyle}
            onChange={item => setValue(item.value)}
          />
          <TextInput
            style={styles.textInput1}
            placeholder={value === '시급' ? '현재 최저시급 10,030원' : '0'}
            placeholderTextColor="rgba(0, 0, 0, 0.5)"
            keyboardType="numeric"
            value={charge}
            onChangeText={setCharge}
          />
          <View style={styles.iconButton}>
            <Text>원</Text>
          </View>
        </View>
      </View>

      <View style={styles.inputForm}>
        <Text style={styles.inputTitle}>함께 일하는 사람들</Text>
        <TextInput
          style={styles.textInput}
          placeholder="농부 또는 근로자들 이름을 입력해주세요!"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={workers}
          onChangeText={setWorkers}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>일정 저장</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default NewSchedule;
