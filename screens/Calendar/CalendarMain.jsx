import React from 'react';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  TouchablOpacity,
} from 'react-native';
import {Calendar} from 'react-native-calendars';

const CalendarMain = () => {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // const today = new Date();
  // const todayString = today.toISOString().split('T')[0];
  // const [selectedDay, setSelectedDay] = useState(todayString);

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
          theme={{
            todayTextColor: '#000',
            arrowColor: '#000',
            textDayFontWeight: '400',
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
    marginBottom: 20,
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
});

export default CalendarMain;
