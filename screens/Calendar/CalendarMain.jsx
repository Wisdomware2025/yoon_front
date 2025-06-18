import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {View, Text, StyleSheet, Modal, Pressable} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import axios from 'axios';
import 'dayjs/locale/ko';

LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
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
LocaleConfig.defaultLocale = 'ko';

const today = dayjs().format('YYYY-MM-DD');

const CalendarMain = () => {
  const navigation = useNavigation();
  const [recentSchedules, setRecentSchedules] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchSchedules = async () => {
    try {
      const endpoint = 'http://172.28.2.114:5000/schedules/recent';
      const response = await axios.get(endpoint);
      setRecentSchedules(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const onPressModalOpen = date => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const onPressModalClose = () => {
    setIsModalVisible(false);
  };

  const onPressNewSchedule = () => {
    setIsModalVisible(false);
    navigation.navigate('NewSchedule', {selectedDate});
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

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <View style={styles.verticalText}>
          <Text style={styles.dayLeftText}>{recentSchedules.date}</Text>
          <Text style={styles.dayLeftMiniText}>남음</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            {recentSchedules.workers}와 함께{'\n'}
            {recentSchedules.worker}
            {'\n'}
            <Text style={styles.highlightText}>{recentSchedules.location}</Text>
            에서
          </Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          markingType="custom"
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

            return (
              <Pressable onPress={() => onPressModalOpen(date)}>
                <View
                  style={[
                    styles.dayContainer,
                    isToday && styles.todayContainer,
                    isOtherMonth && styles.otherMonthContainer,
                  ]}>
                  <Text
                    style={[
                      styles.dayText,
                      isOtherMonth && styles.otherMonthText,
                      isToday && styles.todayText,
                    ]}>
                    {date.day}
                  </Text>
                </View>
              </Pressable>
            );
          }}
          theme={{
            'stylesheet.calendar.header': customHeaderStyles,
            textDayHeaderFontSize: 20,
            arrowColor: '#000',
            textMonthFontSize: 20,
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
          }}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={onPressModalClose}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>
                {selectedDate
                  ? dayjs(selectedDate.dateString).format('YYYY.MM.DD.ddd')
                  : ''}
              </Text>
            </View>
            <View style={styles.modalMain}>
              <Text style={styles.modalMainText}>일정이 없습니다.</Text>
            </View>
            <View style={styles.modalFooter}>
              <Pressable onPress={onPressModalClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </Pressable>
              <Pressable onPress={onPressNewSchedule} style={styles.plusButton}>
                <Text style={styles.plusButtonText}>추가하기</Text>
              </Pressable>
            </View>
          </View>
        </View>
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
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verticalText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLeftText: {
    fontSize: 25,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dayLeftMiniText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  detailContainer: {
    flex: 1,
    marginLeft: 15,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  highlightText: {
    color: '#7C8B00',
    fontWeight: 'bold',
  },
  calendarContainer: {
    marginBottom: 20,
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
  },
  todayContainer: {
    backgroundColor: '#7DCA79',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    alignSelf: 'center',
  },
  dayContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherMonthText: {
    color: '#8E8E8E',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#EDFFEC',
    borderRadius: 10,
    width: 330,
    height: 330,
  },
  modalHeader: {
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
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  plusButton: {
    backgroundColor: '#7DCA79',
    borderRadius: 30,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  closeButtonText: {
    color: '#000',
    fontSize: 15,
  },
});

export default CalendarMain;
