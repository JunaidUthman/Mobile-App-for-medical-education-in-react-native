import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { addConsultation, getConsultations } from '../../utils/storage';

const { width } = Dimensions.get('window');

export default function ConsultationScreen() {
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [pastConsultations, setPastConsultations] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('offers'); // 'offers' or 'current'

  // Hardcoded doctor offers
  const doctorOffers = [
    {
      id: 1,
      doctorName: 'د. أمينة الحسني',
      specialty: 'طب الأطفال',
      avatar: 'https://i.pravatar.cc/150?img=1',
      date: '2025-10-31',
      time: '14:00',
      price: 150,
      rating: 4.8,
    },
    {
      id: 2,
      doctorName: 'د. كريم بنعلي',
      specialty: 'علم النفس',
      avatar: 'https://i.pravatar.cc/150?img=33',
      date: '2025-11-01',
      time: '16:30',
      price: 200,
      rating: 4.9,
    },
    {
      id: 3,
      doctorName: 'د. سلمى الإدريسي',
      specialty: 'الصحة الجنسية',
      avatar: 'https://i.pravatar.cc/150?img=5',
      date: '2025-11-02',
      time: '10:00',
      price: 180,
      rating: 4.7,
    },
  ];

  // Scheduled video calls
  const scheduledCalls = [
    {
      id: 1,
      doctorName: 'د. أمينة الحسني',
      specialty: 'طب الأطفال',
      avatar: 'https://i.pravatar.cc/150?img=1',
      date: '2025-10-30',
      time: '15:00',
      status: 'upcoming',
    },
    {
      id: 2,
      doctorName: 'د. كريم بنعلي',
      specialty: 'علم النفس',
      avatar: 'https://i.pravatar.cc/150?img=33',
      date: '2025-10-29',
      time: '12:00',
      status: 'completed',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      // Get user from AsyncStorage directly
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const consultations = await getConsultations();
      setPastConsultations(consultations);
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!topic.trim() || !message.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    const consultation = {
      id: Date.now().toString(),
      topic: topic.trim(),
      message: message.trim(),
      userId: user?.id,
      userName: user?.username,
      createdAt: new Date().toISOString(),
      status: 'pending', // pending, answered, closed
    };

    await addConsultation(consultation);
    setPastConsultations(prev => [consultation, ...prev]);

    // Reset form
    setTopic('');
    setMessage('');

    Alert.alert('تم بنجاح', 'تم إرسال استشارتك بنجاح');
  };

  const handleStartCall = (call) => {
    // Navigate to video call page
    router.push('/video-call');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>بيني وبينك</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.username || 'المستخدم'}</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle" size={28} color="#14b8a6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* TAB LINKS */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'offers' && styles.tabButtonActive]}
            onPress={() => setActiveTab('offers')}
          >
            <Text style={[styles.tabText, activeTab === 'offers' && styles.tabTextActive]}>
              عروض الأطباء
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'current' && styles.tabButtonActive]}
            onPress={() => setActiveTab('current')}
          >
            <Text style={[styles.tabText, activeTab === 'current' && styles.tabTextActive]}>
              المكالمات الحالية
            </Text>
          </TouchableOpacity>
        </View>

        {/* DOCTOR OFFERS SECTION */}
        {activeTab === 'offers' && (
          <View style={styles.offersSection}>
            <Text style={styles.sectionTitle}>عروض الأطباء</Text>

            {doctorOffers.map((offer) => (
              <View key={offer.id} style={styles.offerCard}>
                <View style={styles.offerHeader}>
                  <View style={styles.doctorInfo}>
                    <Image source={{ uri: offer.avatar }} style={styles.doctorAvatar} />
                    <View style={styles.doctorDetails}>
                      <Text style={styles.doctorName}>{offer.doctorName}</Text>
                      <Text style={styles.doctorSpecialty}>{offer.specialty}</Text>
                    </View>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#fbbf24" />
                    <Text style={styles.ratingText}>{offer.rating}</Text>
                  </View>
                </View>

                <View style={styles.offerDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{offer.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{offer.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="cash" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{offer.price} درهم</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>حجز الموعد</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* SCHEDULED CALLS SECTION */}
        {activeTab === 'current' && (
          <View style={styles.callsSection}>
            <Text style={styles.sectionTitle}>المكالمات المجدولة</Text>

            {scheduledCalls.map((call) => (
              <View key={call.id} style={styles.callCard}>
                <View style={styles.callHeader}>
                  <View style={styles.doctorInfo}>
                    <Image source={{ uri: call.avatar }} style={styles.doctorAvatar} />
                    <View style={styles.doctorDetails}>
                      <Text style={styles.doctorName}>{call.doctorName}</Text>
                      <Text style={styles.doctorSpecialty}>{call.specialty}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, getCallStatusStyle(call.status)]}>
                    <Text style={styles.statusText}>{getCallStatusText(call.status)}</Text>
                  </View>
                </View>

                <View style={styles.callDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{call.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#6b7280" />
                    <Text style={styles.detailText}>{call.time}</Text>
                  </View>
                </View>

                {call.status === 'upcoming' && (
                  <TouchableOpacity style={styles.startCallButton} onPress={() => handleStartCall(call)}>
                    <Ionicons name="videocam" size={20} color="#fff" />
                    <Text style={styles.startCallButtonText}>بدء المكالمة</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* PAST CONSULTATIONS */}
        {pastConsultations.length > 0 && (
          <View style={styles.consultationsSection}>
            <Text style={styles.sectionTitle}>استشارات سابقة</Text>

            {pastConsultations.map((consultation) => (
              <View key={consultation.id} style={styles.consultationCard}>
                <View style={styles.consultationHeader}>
                  <Text style={styles.consultationTopic}>{consultation.topic}</Text>
                  <View style={[styles.statusBadge, getStatusStyle(consultation.status)]}>
                    <Text style={styles.statusText}>{getStatusText(consultation.status)}</Text>
                  </View>
                </View>
                <Text style={styles.consultationMessage}>{consultation.message}</Text>
                <Text style={styles.consultationDate}>
                  {new Date(consultation.createdAt).toLocaleDateString('ar-MA')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusStyle = (status) => {
  switch (status) {
    case 'pending':
      return { backgroundColor: '#fef3c7' };
    case 'answered':
      return { backgroundColor: '#d1fae5' };
    case 'closed':
      return { backgroundColor: '#e5e7eb' };
    default:
      return { backgroundColor: '#e5e7eb' };
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'في الانتظار';
    case 'answered':
      return 'تم الرد';
    case 'closed':
      return 'مغلقة';
    default:
      return 'غير محدد';
  }
};

const getCallStatusStyle = (status) => {
  switch (status) {
    case 'upcoming':
      return { backgroundColor: '#dbeafe' };
    case 'completed':
      return { backgroundColor: '#d1fae5' };
    case 'missed':
      return { backgroundColor: '#fee2e2' };
    default:
      return { backgroundColor: '#e5e7eb' };
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  // HEADER STYLES (matching home page)
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
  logoImage: {
    width: 24,
    height: 24,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#14b8a6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#fff',
  },
  offersSection: {
    paddingVertical: 20,
  },
  callsSection: {
    paddingVertical: 20,
  },
  formSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlign: 'right',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  consultationsSection: {
    paddingBottom: 20,
  },
  // OFFERS STYLES
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
  },
  doctorDetails: {
    gap: 2,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  doctorSpecialty: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'right',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  offerDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'right',
  },
  bookButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // CALLS STYLES
  callCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  callDetails: {
    marginBottom: 16,
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
  consultationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  consultationTopic: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  consultationMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: 8,
  },
  consultationDate: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
});