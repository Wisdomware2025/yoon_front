import {View, Text, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.locale('ko');
dayjs.extend(relativeTime);

const SchedulBox = ({schedule}) => {
  if (!schedule || !schedule.date) return null;

  return (
    <View style={styles.infoBox}>
      <View style={styles.verticalText}>
        <Text style={styles.dayLeftText}>{dayjs(schedule.date).fromNow()}</Text>
        <Text style={styles.dayLeftMiniText}>남음</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>
          {schedule.workers}와 함께{' '}
          <Text style={styles.highlightText}>{schedule.work} </Text>
          {'\n'}
          <Text style={styles.highlightText}>{schedule.location}</Text>
          에서
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 3,
    height: 90,
  },
  verticalText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLeftText: {
    fontSize: 16,
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
    backgroundColor: 'rgba(255, 246, 0, 0.3)',
  },
});
export default SchedulBox;
