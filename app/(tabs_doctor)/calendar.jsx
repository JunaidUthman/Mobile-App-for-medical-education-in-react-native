import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DoctorCalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);

  // Generate calendar dates for current month
  const getCalendarDates = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const dates = [];
    const current = new Date(startDate);

    while (current <= lastDay || dates.length % 7 !== 0) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const toggleDateAvailability = (date) => {
    const dateString = date.toDateString();
    setAvailableDates(prev =>
      prev.includes(dateString)
        ? prev.filter(d => d !== dateString)
        : [...prev, dateString]
    );
  };

  const isDateAvailable = (date) => {
    return availableDates.includes(date.toDateString());
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const renderCalendarDate = (date) => {
    const available = isDateAvailable(date);
    const currentMonth = isCurrentMonth(date);
    const today = isToday(date);

    return (
      <TouchableOpacity
        key={date.toISOString()}
        style={[
          styles.dateCell,
          !currentMonth && styles.dateCellInactive,
          available && styles.dateCellAvailable,
          today && styles.dateCellToday,
        ]}
        onPress={() => currentMonth && toggleDateAvailability(date)}
        disabled={!currentMonth}
      >
        <Text
          style={[
            styles.dateText,
            !currentMonth && styles.dateTextInactive,
            available && styles.dateTextAvailable,
            today && styles.dateTextToday,
          ]}
        >
          {date.getDate()}
        </Text>
        {available && (
          <View style={styles.availableIndicator}>
            <Ionicons name="checkmark" size={12} color="#14b8a6" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const changeMonth = (direction) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={28} color="#14b8a6" />
          <Text style={styles.logoText}>التربية الصحية</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={36} color="#14b8a6" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* CALENDAR HEADER */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => changeMonth(-1)}
          >
            <Ionicons name="chevron-forward" size={24} color="#14b8a6" />
          </TouchableOpacity>

          <View style={styles.monthTitle}>
            <Text style={styles.monthText}>
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => changeMonth(1)}
          >
            <Ionicons name="chevron-back" size={24} color="#14b8a6" />
          </TouchableOpacity>
        </View>

        {/* DAY NAMES */}
        <View style={styles.dayNames}>
          {dayNames.map(day => (
            <Text key={day} style={styles.dayName}>{day}</Text>
          ))}
        </View>

        {/* CALENDAR GRID */}
        <View style={styles.calendarGrid}>
          {getCalendarDates().map(renderCalendarDate)}
        </View>

        {/* LEGEND */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendAvailable]} />
            <Text style={styles.legendText}>متاح</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendUnavailable]} />
            <Text style={styles.legendText}>غير متاح</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, styles.legendToday]} />
            <Text style={styles.legendText}>اليوم</Text>
          </View>
        </View>

        {/* INFO TEXT */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>كيفية العمل:</Text>
          <Text style={styles.infoText}>
            اضغط على التواريخ لتحديد الأيام المتاحة للاستشارات.
            سيتمكن الآباء من رؤية تواريخك المتاحة وطلب المواعيد.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dayNames: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  dateCell: {
    width: `${100/7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    position: 'relative',
  },
  dateCellInactive: {
    opacity: 0.3,
  },
  dateCellAvailable: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
  },
  dateCellToday: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#1f2937',
  },
  dateTextInactive: {
    color: '#9ca3af',
  },
  dateTextAvailable: {
    color: '#14b8a6',
    fontWeight: 'bold',
  },
  dateTextToday: {
    color: '#f59e0b',
    fontWeight: 'bold',
  },
  availableIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 32,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendAvailable: {
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#14b8a6',
  },
  legendUnavailable: {
    backgroundColor: '#f3f4f6',
  },
  legendToday: {
    backgroundColor: '#fef3c7',
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    lineHeight: 20,
  },
});