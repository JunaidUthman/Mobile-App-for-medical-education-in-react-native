import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function DoctorCalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [currentView, setCurrentView] = useState('calendar'); // 'calendar' or 'calls'
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [user, setUser] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(null);
  const [savedSchedules, setSavedSchedules] = useState([]);
  const [currentDateSchedules, setCurrentDateSchedules] = useState([]);
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');
  const [callPrice, setCallPrice] = useState('');

  // Mock scheduled calls data
  const scheduledCalls = [
    {
      id: 1,
      patientName: 'أحمد محمد',
      date: '2025-10-30',
      time: '15:00',
      status: 'upcoming',
      avatar: 'https://i.pravatar.cc/150?img=12',
      isCurrent: true, // This is the current/next call
    },
    {
      id: 2,
      patientName: 'فاطمة علي',
      date: '2025-10-29',
      time: '14:30',
      status: 'completed',
      avatar: 'https://i.pravatar.cc/150?img=9',
      isCurrent: false,
    },
  ];

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

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, []);

  const handleDateSelect = (date) => {
    if (isCurrentMonth(date)) {
      setSelectedCalendarDate(date);
      // Load existing schedules for this date
      const dateString = date.toISOString().split('T')[0];
      const existingSchedules = savedSchedules.filter(schedule => schedule.date === dateString);
      setCurrentDateSchedules(existingSchedules);
    }
  };

  const addTimeSlot = () => {
    if (timeSlots.length < 5) { // Limit to 5 slots per day
      setTimeSlots(prev => [...prev, new Date()]);
    }
  };

  const showTimePickerForIndex = (index) => {
    setCurrentTimeIndex(index);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: timeSlots[index] || new Date(),
        onChange: (event, selectedTime) => {
          if (selectedTime && currentTimeIndex !== null) {
            const newSlots = [...timeSlots];
            newSlots[currentTimeIndex] = selectedTime;
            setTimeSlots(newSlots);
          }
          setCurrentTimeIndex(null);
        },
        mode: 'time',
        is24Hour: true,
      });
    } else if (Platform.OS === 'ios') {
      setShowTimePicker(true);
    } else {
      // For web/PC, just set a default time
      const defaultTime = new Date();
      defaultTime.setHours(14, 0, 0, 0); // Default to 14:00
      const newSlots = [...timeSlots];
      newSlots[index] = defaultTime;
      setTimeSlots(newSlots);
      Alert.alert('وقت محدد', `تم تعيين الوقت إلى ${defaultTime.toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' })}`);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime && currentTimeIndex !== null) {
      const newSlots = [...timeSlots];
      newSlots[currentTimeIndex] = selectedTime;
      setTimeSlots(newSlots);
    }
    setCurrentTimeIndex(null);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const saveTimeSlots = () => {
    if (selectedCalendarDate && startHour && startMinute && endHour && endMinute && callPrice) {
      const scheduleData = {
        id: Date.now().toString(),
        date: selectedCalendarDate.toISOString().split('T')[0],
        startTime: `${startHour}:${startMinute}`,
        endTime: `${endHour}:${endMinute}`,
        price: callPrice,
        createdAt: new Date().toISOString(),
      };

      setSavedSchedules(prev => [...prev, scheduleData]);
      setCurrentDateSchedules(prev => [...prev, scheduleData]);
      Alert.alert('تم الحفظ', 'تم حفظ جدولة الاستشارة بنجاح');

      // Reset form but keep date selected
      setStartHour('');
      setStartMinute('');
      setEndHour('');
      setEndMinute('');
      setCallPrice('');
    } else {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
    }
  };

  const handleStartCall = (call) => {
    // Navigate to doctor video call page
    router.push('/video-call-doctor');
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
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.username || 'الطبيب'}</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={28} color="#14b8a6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* VIEW TOGGLE */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, currentView === 'calendar' && styles.toggleButtonActive]}
          onPress={() => setCurrentView('calendar')}
        >
          <Ionicons name="calendar" size={20} color={currentView === 'calendar' ? '#fff' : '#6b7280'} />
          <Text style={[styles.toggleText, currentView === 'calendar' && styles.toggleTextActive]}>
            التقويم
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, currentView === 'calls' && styles.toggleButtonActive]}
          onPress={() => setCurrentView('calls')}
        >
          <Ionicons name="videocam" size={20} color={currentView === 'calls' ? '#fff' : '#6b7280'} />
          <Text style={[styles.toggleText, currentView === 'calls' && styles.toggleTextActive]}>
            المكالمات
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentView === 'calendar' ? (
          <>
            {/* CALENDAR HEADER */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.monthButton}
                onPress={() => changeMonth(-1)}
              >
                <Ionicons name="chevron-back" size={24} color="#14b8a6" />
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
                <Ionicons name="chevron-forward" size={24} color="#14b8a6" />
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
              {getCalendarDates().map(date => {
                const available = isDateAvailable(date);
                const currentMonth = isCurrentMonth(date);
                const today = isToday(date);
                const selected = selectedCalendarDate && date.toDateString() === selectedCalendarDate.toDateString();

                return (
                  <TouchableOpacity
                    key={date.toISOString()}
                    style={[
                      styles.dateCell,
                      !currentMonth && styles.dateCellInactive,
                      available && styles.dateCellAvailable,
                      today && styles.dateCellToday,
                      selected && styles.dateCellSelected,
                    ]}
                    onPress={() => currentMonth && handleDateSelect(date)}
                    disabled={!currentMonth}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        !currentMonth && styles.dateTextInactive,
                        available && styles.dateTextAvailable,
                        today && styles.dateTextToday,
                        selected && styles.dateTextSelected,
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
              })}
            </View>

            {/* TIME SLOTS SECTION */}
            {selectedCalendarDate && (
              <View style={styles.timeSlotsSection}>
                <Text style={styles.timeSlotsTitle}>
                  جدولة الاستشارة ليوم {selectedCalendarDate.toLocaleDateString('ar-MA')}
                </Text>

                {/* Current Date Schedules */}
                {currentDateSchedules.length > 0 && (
                  <View style={styles.currentSchedules}>
                    <Text style={styles.currentSchedulesTitle}>الجدولة الحالية:</Text>
                    {currentDateSchedules.map((schedule) => (
                      <View key={schedule.id} style={styles.currentScheduleItem}>
                        <Text style={styles.currentScheduleTime}>
                          من {schedule.startTime} إلى {schedule.endTime}
                        </Text>
                        <Text style={styles.currentSchedulePrice}>
                          {schedule.price} درهم
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Start Time */}
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>وقت البداية:</Text>
                  <View style={styles.timeInputs}>
                    <TextInput
                      style={styles.hourInput}
                      value={startHour}
                      onChangeText={setStartHour}
                      placeholder="ساعة"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text style={styles.colon}>:</Text>
                    <TextInput
                      style={styles.minuteInput}
                      value={startMinute}
                      onChangeText={setStartMinute}
                      placeholder="دقيقة"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>

                {/* End Time */}
                <View style={styles.timeRow}>
                  <Text style={styles.timeLabel}>وقت النهاية:</Text>
                  <View style={styles.timeInputs}>
                    <TextInput
                      style={styles.hourInput}
                      value={endHour}
                      onChangeText={setEndHour}
                      placeholder="ساعة"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text style={styles.colon}>:</Text>
                    <TextInput
                      style={styles.minuteInput}
                      value={endMinute}
                      onChangeText={setEndMinute}
                      placeholder="دقيقة"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>

                {/* Price */}
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>سعر الاستشارة (درهم):</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={callPrice}
                    onChangeText={setCallPrice}
                    placeholder="مثال: 150"
                    keyboardType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveTimeButton}
                  onPress={saveTimeSlots}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.saveTimeText}>حفظ الجدولة</Text>
                </TouchableOpacity>
              </View>
            )}

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
          </>
        ) : (
          /* SCHEDULED CALLS VIEW */
          <View style={styles.callsSection}>
            <Text style={styles.callsTitle}>المكالمات المجدولة</Text>

            {/* Current Call (Next upcoming) */}
            {(() => {
              const currentCall = scheduledCalls.find(call => call.isCurrent);
              if (currentCall) {
                return (
                  <View style={styles.currentCallSection}>
                    <Text style={styles.sectionSubtitle}>المكالمة التالية</Text>
                    <View style={[styles.callCard, styles.currentCallCard]}>
                      <View style={styles.callHeader}>
                        <View style={styles.patientInfo}>
                          <Text style={styles.patientName}>{currentCall.patientName}</Text>
                          <Text style={styles.callDateTime}>
                            {currentCall.date} - {currentCall.time}
                          </Text>
                        </View>
                        <View style={[styles.callStatus, getCallStatusStyle(currentCall.status)]}>
                          <Text style={styles.callStatusText}>{getCallStatusText(currentCall.status)}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.startCallButton}
                        onPress={() => handleStartCall(currentCall)}
                      >
                        <Ionicons name="videocam" size={20} color="#fff" />
                        <Text style={styles.startCallButtonText}>بدء المكالمة</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }
              return null;
            })()}

            {/* Upcoming Calls */}
            {(() => {
              const upcomingCalls = scheduledCalls.filter(call => call.status === 'upcoming' && !call.isCurrent);
              if (upcomingCalls.length > 0) {
                return (
                  <View style={styles.upcomingCallsSection}>
                    <Text style={styles.sectionSubtitle}>المكالمات القادمة</Text>
                    {upcomingCalls.map((call) => (
                      <View key={call.id} style={styles.callCard}>
                        <View style={styles.callHeader}>
                          <View style={styles.patientInfo}>
                            <Text style={styles.patientName}>{call.patientName}</Text>
                            <Text style={styles.callDateTime}>
                              {call.date} - {call.time}
                            </Text>
                          </View>
                          <View style={[styles.callStatus, getCallStatusStyle(call.status)]}>
                            <Text style={styles.callStatusText}>{getCallStatusText(call.status)}</Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.startCallButton}
                          onPress={() => handleStartCall(call)}
                        >
                          <Ionicons name="videocam" size={20} color="#fff" />
                          <Text style={styles.startCallButtonText}>بدء المكالمة</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                );
              }
              return null;
            })()}

            {/* Saved Schedules */}
            {savedSchedules.length > 0 && (
              <View style={styles.savedSchedulesSection}>
                <Text style={styles.savedSchedulesTitle}>الجداول المحفوظة</Text>
                {savedSchedules.map((schedule) => (
                  <View key={schedule.id} style={styles.scheduleCard}>
                    <Text style={styles.scheduleDate}>{schedule.date}</Text>
                    <View style={styles.scheduleDetails}>
                      <Text style={styles.scheduleTimeRange}>
                        من {schedule.startTime} إلى {schedule.endTime}
                      </Text>
                      <Text style={styles.schedulePrice}>{schedule.price} درهم</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Completed Calls */}
            {(() => {
              const completedCalls = scheduledCalls.filter(call => call.status === 'completed');
              if (completedCalls.length > 0) {
                return (
                  <View style={styles.completedCallsSection}>
                    <Text style={styles.sectionSubtitle}>المكالمات المكتملة</Text>
                    {completedCalls.map((call) => (
                      <View key={call.id} style={styles.callCard}>
                        <View style={styles.callHeader}>
                          <View style={styles.patientInfo}>
                            <Text style={styles.patientName}>{call.patientName}</Text>
                            <Text style={styles.callDateTime}>
                              {call.date} - {call.time}
                            </Text>
                          </View>
                          <View style={[styles.callStatus, getCallStatusStyle(call.status)]}>
                            <Text style={styles.callStatusText}>{getCallStatusText(call.status)}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                );
              }
              return null;
            })()}
          </View>
        )}
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
  },
  profileButton: {
    padding: 4,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#14b8a6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  toggleTextActive: {
    color: '#fff',
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
  dateCellSelected: {
    backgroundColor: '#dbeafe',
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 8,
  },
  dateTextSelected: {
    color: '#3b82f6',
    fontWeight: 'bold',
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
  timeSlotsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timeSlotsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 16,
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'right',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'right',
  },
  removeTimeButton: {
    padding: 8,
  },
  timeSlotActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  addTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#14b8a6',
    borderRadius: 8,
    backgroundColor: '#f0fdfa',
  },
  addTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14b8a6',
  },
  saveTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#14b8a6',
    borderRadius: 8,
  },
  saveTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  callsSection: {
    paddingVertical: 20,
  },
  callsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 16,
  },
  callCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  callDateTime: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  callStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  callStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  startCallButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startCallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  savedSchedulesSection: {
    marginBottom: 24,
  },
  savedSchedulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 12,
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  scheduleDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 8,
  },
  scheduleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleTimeRange: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
  schedulePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14b8a6',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hourInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
    width: 60,
    backgroundColor: '#fff',
  },
  minuteInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
    width: 60,
    backgroundColor: '#fff',
  },
  colon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'right',
    width: 100,
    backgroundColor: '#fff',
  },
  currentSchedules: {
    backgroundColor: '#f0fdfa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  currentSchedulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 8,
  },
  currentScheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  currentScheduleTime: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'right',
  },
  currentSchedulePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#14b8a6',
  },
  currentCallSection: {
    marginBottom: 24,
  },
  currentCallCard: {
    borderWidth: 2,
    borderColor: '#14b8a6',
    backgroundColor: '#f0fdfa',
  },
  upcomingCallsSection: {
    marginBottom: 24,
  },
  completedCallsSection: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 12,
    marginRight: 8,
    paddingRight: 12,
    borderRightWidth: 3,
    borderRightColor: '#14b8a6',
  },
});

const getCallStatusStyle = (status) => {
  switch (status) {
    case 'upcoming':
      return { backgroundColor: '#f59e0b' };
    case 'completed':
      return { backgroundColor: '#10b981' };
    case 'missed':
      return { backgroundColor: '#ef4444' };
    default:
      return { backgroundColor: '#6b7280' };
  }
};

const getCallStatusText = (status) => {
  switch (status) {
    case 'upcoming':
      return 'قادمة';
    case 'completed':
      return 'مكتملة';
    case 'missed':
      return 'فائتة';
    default:
      return 'غير محدد';
  }
};