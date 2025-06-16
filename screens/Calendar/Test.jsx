import React from 'react';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchablOpacity,
  Image,
  Pressable,
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
const Test = () => {
  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const newSchedulonPress = () => {
    setIsModalVisible(false);
    navigation.navigate('NewSchedule');
  };
  useEffect(() => {}, []);
  const onPressModalOpen = () => {
    setIsModalVisible(true);
  };
  const onPressModalClose = () => {
    setIsModalVisible(false);
  };

  const [selectedDate, setSelectedDate] = useState(null);

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
              <Pressable onPress={onPressModalOpen}>
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
              </Pressable>
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

      <Modal
        animationType={newSchedulonPress == null ? 'slide' : 'none'}
        // animationType="slide"
        transparent={true}
        visible={isModalVisible}
        setIsModalVisible={setIsModalVisible}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>2025.04.08.화</Text>
            </View>
            <View style={styles.modalMain}>
              <View style={styles.modalMainContent}>
                <Image
                  resource={require('../../assets/Date.png')}
                  style={styles.modalMaincontentIcon}
                />
                <Text style={styles.modalMainContentText}>
                  4월 8일 ~ 4월 11일
                </Text>
              </View>
              <View style={styles.modalMainContent}>
                <Image
                  resource={require('../../assets/Time.png')}
                  style={styles.modalMaincontentIcon}
                />
                <Text style={styles.modalMainContentText}>
                  오전 8시 ~ 오전 11시
                </Text>
              </View>
              <View style={styles.modalMainContent}>
                <Image
                  resource={require('../../assets/Witch.png')}
                  style={styles.modalMaincontentIcon}
                />
                <Text style={styles.modalMainContentText}>
                  봉양면 봉호로 14 사과 농장 13호
                </Text>
              </View>
              <View style={styles.modalMainContent}>
                <Image
                  resource={require('../../assets/User.png')}
                  style={styles.modalMaincontentIcon}
                />
                <Text style={styles.modalMainContentText}>
                  최다이애나, 응우옌, 싱하오
                </Text>
              </View>
              <View style={styles.modalMainContent}>
                <Image
                  resource={require('../../assets/Money.png')}
                  style={styles.modalMaincontentIcon}
                />
                <Text style={styles.modalMainContentText}>시급 10,000원</Text>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <Pressable onPress={onPressModalClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </Pressable>
              <Pressable onPress={newSchedulonPress} style={styles.plusButton}>
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
    // fontWeight: 'bold',
    // margin: 10,
    // marginLeft: 10,
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

  modalFooter: {
    flexDirection: 'row',
  },
  plusButton: {
    marginLeft: 10,
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
    marginLeft: 105,
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

export default Test;
