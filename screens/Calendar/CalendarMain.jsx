import React from 'react';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  TouchablOpacity,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';

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
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const customHeaderStyles = {};

  for (let i = 0; i < 7; i++) {
    if (i === 0) {
      customHeaderStyles[`dayTextAtIndex${i}`] = {
        color: '#FF0000',
      };
    } else if (i === 6) {
      customHeaderStyles[`dayTextAtIndex${i}`] = {
        color: '#007BA4',
      };
    } else {
      customHeaderStyles[`dayTextAtIndex${i}`] = {color: 'black'};
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <View style={styles.verticalText}>
          <Text style={styles.dayLeftText}>3일</Text>
          <Text style={styles.dayLeftMiniText}>남음</Text>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            최다예나, 옹우현, 심하오씨와 함께{'\n'}
            사과 농장{'\n'}
            <Text style={styles.highlightText}>
              봉양면 봉호로 14 과일농장 12호
            </Text>
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
          renderHeader={date => {
            const header = dayjs(date).format('YYYY.MM');
            return (
              <View style={styles.headercontainer}>
                <Text style={styles.headerText}>{header}</Text>
              </View>
            );
          }}
          dayComponent={({date, state}) => {
            const isToday = date.dateString === today;
            const isOtherMonth = state === 'disabled';

            return (
              <View
                style={[
                  styles.dayContainer,
                  isToday && styles.todayContainer,
                  isOtherMonth && styles.otherMonthContainer,
                ]}>
                <Text
                  style={[
                    styles.dayText,
                    state === 'disabled' && styles.disabledText,
                    isToday && styles.todayText,
                    isOtherMonth && styles.otherMonthText,
                  ]}>
                  {date.day}
                </Text>
              </View>
            );
          }}
          theme={{
            'stylesheet.calendar.header': {
              ...customHeaderStyles,
            },
            textDayHeaderFontSize: 20,
            arrowColor: '#000',
            textMonthFontSize: 20,
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
          }}
        />
      </View>
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
    flexDirection: 'column',

    justifyContent: 'center',
  },
  dayLeftText: {
    fontSize: 25,

    lineHeight: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  detailContainer: {
    flex: 1,
    marginLeft: 15,
  },
  dayLeftMiniText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
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
    fontSize: 20,
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
    // borderBottomColor: '#8E8E8E',
    // borderBottomWidth: 1,
  },
  otherMonthText: {
    color: '#8E8E8E',
  },
});

export default CalendarMain;
