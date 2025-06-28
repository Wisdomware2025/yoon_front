import React, {useState, useEffect, use} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import dayjs from 'dayjs';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import axios from 'axios';
import 'dayjs/locale/ko';
import SchedulBox from '../../components/SchedulBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);
dayjs.locale('ko');

LocaleConfig.locales['ko'] = {
  monthNames: [...Array(12)].map((_, i) => `${i + 1}월`),
  monthNamesShort: [...Array(12)].map((_, i) => `${i + 1}월`),
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
const customHeaderStyles = {};
for (let i = 0; i < 7; i++) {
  customHeaderStyles[`dayTextAtIndex${i}`] =
    i === 0
      ? {color: '#FF0000'}
      : i === 6
      ? {color: '#007BA4'}
      : {color: 'black'};
}
dayjs.extend(relativeTime);
dayjs.locale('ko');
const today = dayjs().format('YYYY-MM-DD');

const CalendarMain = () => {
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [recentSchedule, setRecentSchedule] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchAllSchedules = async () => {
    //모든 스케줄 불러오기
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const endpoint =
        'https://ilson-924833727346.asia-northeast3.run.app/schedules';
      // `https://ilson-924833727346.asia-northeast3.run.app/schedules/${id}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setSchedules(response.data);

      // markedDates = schedules;
      console.log('불러오는 데이터:', response.data);
      console.log('불러오는 데이터2:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error.response) {
        console.error('서버 응답 오류:', error.response.data);
      } else {
        console.error('요청 실패:', error.message);
      }
      console.error('모든 일정있는 스케줄 불러오기 실패:', error);
    }
  };

  const fetchRecentSchedule = async () => {
    //상단 스케줄 불러오기
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const endpoint =
        'https://ilson-924833727346.asia-northeast3.run.app/schedules/recent';
      // `https://ilson-924833727346.asia-northeast3.run.app/schedules/recent/${id}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('불러온 recentSchedule:', response.data);

      setRecentSchedule(response.data);
      console.log('받아온 recentSchedule:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('서버 응답 오류:', error.response.data);
      } else {
        console.error('요청 실패:', error.message);
      }
      console.error(error);
    }
  };

  const fetchScheduleByDate = async date => {
    // 선택된 날짜 스케줄 불러오기
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      // const endpoint = `https://ilson-924833727346.asia-northeast3.run.app/schedules/${date._id}`;
      const endpoint = `https://ilson-924833727346.asia-northeast3.run.app/schedules/${date}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setSelectedSchedule(response.data);
    } catch (error) {
      if (error.response) {
        console.error('서버 응답 오류:', error.response.data);
      } else {
        console.error('요청 실패:', error.message);
      }
      setSelectedSchedule(null);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllSchedules();
    fetchRecentSchedule();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAllSchedules();
      fetchRecentSchedule();
    }, []),
  );

  const onPressModalOpen = async date => {
    setSelectedDate(date);
    await fetchScheduleByDate(date.dateString);
    setIsModalVisible(true);
  };

  const onPressModalClose = () => {
    setIsModalVisible(false);
  };

  const onPressNewSchedule = () => {
    setIsModalVisible(false);
    navigation.navigate('NewSchedule', {selectedDate});
  };

  //선택된 날짜 일정 수정
  const onPressEditSchedule = async () => {
    setIsModalVisible(false);
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const endpoint = `https://ilson-924833727346.asia-northeast3.run.app/schedules/${selectedDate.id}`;

      const updatedData = {
        startDate: selectedSchedule.startDate,
        endDate: selectedSchedule.endDate,
        startTime: selectedSchedule.startTime,
        endTime: selectedSchedule.endTime,
        location: selectedSchedule.location,
        work: selectedSchedule.work,
        workers: selectedSchedule.workers,
        chargeType: selectedSchedule.chargeType,
        charge: selectedSchedule.charge,
      };

      const response = await axios.put(endpoint, updatedData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      setSelectedSchedule(response.data);
      fetchAllSchedules();
      navigation.navigate('NewSchedule', {
        selectedDate: selectedDate,
        schedule: response.data,
      });
      console.log('일정 수정 성공:', response.data);
    } catch (error) {
      console.error('일정 수정 실패:', error);
    }
  };

  const onPressDeleteSchedule = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const endpoint = `https://ilson-924833727346.asia-northeast3.run.app/schedules/${selectedDate.id}`;
      const response = await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      fetchAllSchedules();
      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  // const markedDates = Object.fromEntries(
  //   Object.values(schedules).map(item => {
  //     const formattedDate = dayjs(item.date).format('YYYY-MM-DD');
  //     return [
  //       formattedDate,
  //       {
  //         customStyles: {
  //           container: {backgroundColor: '#FFDCDC'},

  //           borderRadius: 4,
  //           paddingHorizontal: 4,
  //           marginTop: 2,
  //         },
  //       },
  //     ];
  //   }),
  // );
  const markedDates = schedules.reduce((acc, item) => {
    const start = dayjs(item.startDate);
    const end = dayjs(item.endDate);
    let current = start;

    while (current.isSameOrBefore(end, 'day')) {
      const formattedDate = current.format('YYYY-MM-DD');
      acc[formattedDate] = {
        customStyles: {
          container: {backgroundColor: '#FFDCDC'},
          borderRadius: 4,
          paddingHorizontal: 4,
          marginTop: 2,
        },
      };
      current = current.add(1, 'day');
    }

    return acc;
  }, {});

  console.log('markedDates:', markedDates);

  return (
    <View style={styles.container}>
      {recentSchedule?.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentSchedule.map((schedule, index) =>
            schedule ? (
              <View key={index} style={{marginRight: 10}}>
                <SchedulBox schedule={schedule} />
              </View>
            ) : null,
          )}
        </ScrollView>
      )}

      <View style={styles.calendarContainer}>
        <Calendar
          markingType="custom"
          markedDates={markedDates}
          onDayPress={onPressModalOpen}
          renderArrow={direction => (
            <Text style={styles.renderArrow}>
              {direction === 'left' ? '<' : '>'}
            </Text>
          )}
          renderHeader={date => (
            <View style={styles.headercontainer}>
              <Text style={styles.headerText}>
                {dayjs(date).format('YYYY.MM')}
              </Text>
            </View>
          )}
          dayComponent={({date, state}) => {
            const isToday = date.dateString === today;
            const isOtherMonth = state === 'disabled';
            const isMarkedDate = !!markedDates[date.dateString] && !isToday;

            return (
              <Pressable onPress={() => onPressModalOpen(date)}>
                <View style={styles.dayContainer}>
                  {isToday ? (
                    <View style={styles.todayContainer}>
                      <Text style={styles.todayText}>{date.day}</Text>
                    </View>
                  ) : isMarkedDate ? (
                    <View
                      style={
                        markedDates[date.dateString]?.customStyles?.container
                      }>
                      <Text
                        style={
                          markedDates[date.dateString]?.customStyles?.text
                        }>
                        {date.day}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.dayText,
                        isOtherMonth && styles.otherMonthText,
                      ]}>
                      {date.day}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          }}
          theme={{
            'stylesheet.calendar.header': customHeaderStyles,
          }}
        />
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={onPressModalClose}>
        <Pressable style={styles.modalWrapper} onPress={onPressModalClose}>
          <Pressable style={styles.modalContainer} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                {selectedDate
                  ? dayjs(selectedDate.dateString).format('YYYY.MM.DD.ddd')
                  : ''}
              </Text>
              {selectedSchedule && (
                <Pressable
                  onPress={onPressNewSchedule}
                  style={styles.plusButtonmini}>
                  <Text style={styles.plusButtonTextmini}>+</Text>
                </Pressable>
              )}
            </View>

            {selectedSchedule ? (
              <View style={styles.modalMainFull}>
                <View style={styles.modalMainContent}>
                  <View style={styles.iconWrapper}>
                    <Image
                      source={require('../../assets/icons/Date.png')}
                      style={styles.modalMaincontentIcon}
                    />
                  </View>
                  <Text style={styles.modalMainContentText}>
                    {/* 4월 8일 ~ 4월 11일 */}
                    {selectedSchedule.startDate} ~{selectedSchedule.endDate}
                  </Text>
                </View>
                <View style={styles.modalMainContent}>
                  <View style={styles.iconWrapper}>
                    <Image
                      source={require('../../assets/icons/Time.png')}
                      style={styles.modalMaincontentIcon}
                    />
                  </View>
                  <Text style={styles.modalMainContentText}>
                    {/* 오전 8시 ~ 오전 11시 */}
                    {selectedSchedule.startTime} ~ {selectedSchedule.endTime}
                  </Text>
                </View>
                <View style={styles.modalMainContent}>
                  <View style={styles.iconWrapper}>
                    <Image
                      source={require('../../assets/icons/Witch.png')}
                      style={styles.modalMaincontentIcon}
                    />
                  </View>
                  <Text style={styles.modalMainContentText}>
                    {selectedSchedule.location} {selectedSchedule.work}
                  </Text>
                </View>
                <View style={styles.modalMainContent}>
                  <View style={styles.iconWrapper}>
                    <Image
                      source={require('../../assets/icons/User.png')}
                      style={styles.modalMaincontentIcon}
                    />
                  </View>
                  <Text style={styles.modalMainContentText}>
                    {selectedSchedule.workers}
                    {/* 최다이애나, 응우옌, 싱하오 */}
                  </Text>
                </View>
                <View style={styles.modalMainContent}>
                  <View style={styles.iconWrapper}>
                    <Image
                      source={require('../../assets/icons/Money.png')}
                      style={styles.modalMaincontentIcon}
                    />
                  </View>
                  <Text style={styles.modalMainContentText}>
                    {' '}
                    {/* 시급 10,000원*/} {selectedSchedule.chargeType}
                    {selectedSchedule.charge}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.modalMain}>
                <Text style={styles.modalMainText}>일정이 없습니다.</Text>
              </View>
            )}

            {selectedSchedule ? (
              <View style={styles.modalFooter}>
                <Pressable
                  onPress={onPressEditSchedule}
                  style={styles.correctionButton}>
                  <Text style={styles.correctionButtonText}>수정하기</Text>
                </Pressable>
                <Pressable
                  onPress={onPressDeleteSchedule}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>삭제하기</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.modalFooter}>
                <Pressable
                  onPress={onPressModalClose}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>닫기</Text>
                </Pressable>
                <Pressable
                  onPress={onPressNewSchedule}
                  style={styles.plusButton}>
                  <Text style={styles.plusButtonText}>추가하기</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    width: '100%',
  },

  calendarContainer: {
    height: 400,
    marginBottom: 110,
  },
  renderArrow: {
    color: 'black',
    fontSize: 25,
  },
  headerText: {
    fontSize: 25,
  },
  dayText: {
    fontSize: 20,
  },
  todayText: {
    color: '#fff',
    fontSize: 18,
  },

  dayContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  otherMonthText: {
    color: '#8E8E8E',
  },
  todayContainer: {
    backgroundColor: '#7DCA79',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#EDFFEC',
    borderRadius: 10,
    width: 330,
    height: 330,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderBottomColor: '#323232',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
  modalHeaderText: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 10,
    marginLeft: 20,
  },
  plusButtonmini: {
    marginRight: 30,
  },
  plusButtonTextmini: {
    fontSize: 30,
  },
  modalMain: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMainText: {
    fontSize: 30,
  },
  modalFooter: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    paddingHorizontal: 10,
  },

  plusButton: {
    backgroundColor: '#7DCA79',
    borderRadius: 30,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  plusButtonText: {
    color: '#fff',
    fontSize: 15,
  },
  closeButton: {
    backgroundColor: 'rgba(200, 200, 200, 0.5)',
    borderRadius: 30,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 85,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 15,
  },
  modalMainFull: {
    marginTop: 15,
    height: 208,
    alignItems: 'flex-start',
  },

  modalMainContent: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },

  iconWrapper: {
    width: 40,
    alignItems: 'center',
    marginRight: 10,
  },

  modalMaincontentIcon: {
    width: 30,
    height: 30,
  },

  modalMainContentText: {
    fontSize: 16,
  },
});

export default CalendarMain;
