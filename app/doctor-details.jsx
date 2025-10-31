import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function DoctorDetailsScreen({ route, navigation }) {
  const [user, setUser] = useState(null);
  const doctor = route.params ? JSON.parse(route.params.doctor) : null;

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, []);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>خطأ في تحميل بيانات الطبيب</Text>
      </SafeAreaView>
    );
  }

  // Mock detailed doctor data
  const doctorDetails = {
    ...doctor,
    description: `د. ${doctor.name.split(' ')[1]} متخصص في ${doctor.specialty} ولديه خبرة واسعة في مجاله. يساعد المرضى في فهم احتياجاتهم النفسية والصحية، ويقدم استشارات متخصصة للأفراد والعائلات.`,
    education: 'دكتوراه في الطب النفسي - جامعة محمد الخامس',
    certifications: ['شهادة في علم النفس السريري', 'شهادة في الاستشارات الأسرية'],
    languages: ['العربية', 'الفرنسية', 'الإنجليزية'],
    consultationStats: {
      total: 245,
      thisMonth: 23,
      averageRating: doctor.rating,
      responseTime: 'ساعة واحدة'
    },
    contentStats: {
      articles: 15,
      videos: 8,
      totalViews: 12500,
      totalLikes: 890
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
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
        {/* DOCTOR PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.doctorHeader}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.avatarText}>
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.doctorBasicInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.ratingText}>{doctor.rating}</Text>
                <Text style={styles.reviewsText}>({doctor.reviews} تقييم)</Text>
              </View>
            </View>
          </View>

          <View style={styles.doctorDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="school" size={16} color="#14b8a6" />
              <Text style={styles.detailText}>{doctor.experience} خبرة</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color="#14b8a6" />
              <Text style={styles.detailText}>{doctor.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={16} color="#14b8a6" />
              <Text style={styles.detailText}>متوسط وقت الرد: {doctorDetails.consultationStats.responseTime}</Text>
            </View>
          </View>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>نبذة عن الطبيب</Text>
          <Text style={styles.descriptionText}>{doctorDetails.description}</Text>
        </View>

        {/* EDUCATION & CERTIFICATIONS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>المؤهلات والشهادات</Text>
          <View style={styles.certificationItem}>
            <Ionicons name="school-outline" size={20} color="#14b8a6" />
            <Text style={styles.certificationText}>{doctorDetails.education}</Text>
          </View>
          {doctorDetails.certifications.map((cert, index) => (
            <View key={index} style={styles.certificationItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>

        {/* LANGUAGES */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>اللغات</Text>
          <View style={styles.languagesContainer}>
            {doctorDetails.languages.map((lang, index) => (
              <View key={index} style={styles.languageTag}>
                <Text style={styles.languageText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CONSULTATION STATISTICS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>إحصائيات الاستشارات</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="chatbubbles" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.statNumber}>{doctorDetails.consultationStats.total}</Text>
              <Text style={styles.statLabel}>إجمالي الاستشارات</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="calendar" size={20} color="#10b981" />
              </View>
              <Text style={styles.statNumber}>{doctorDetails.consultationStats.thisMonth}</Text>
              <Text style={styles.statLabel}>هذا الشهر</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="star" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.statNumber}>{doctorDetails.consultationStats.averageRating}</Text>
              <Text style={styles.statLabel}>متوسط التقييم</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#f3e8ff' }]}>
                <Ionicons name="time" size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.statNumber}>{doctorDetails.consultationStats.responseTime}</Text>
              <Text style={styles.statLabel}>وقت الرد</Text>
            </View>
          </View>
        </View>

        {/* CONTENT STATISTICS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>إحصائيات المحتوى</Text>
          <View style={styles.contentStatsGrid}>
            <View style={styles.contentStatCard}>
              <View style={[styles.contentStatIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="document-text" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.contentStatNumber}>{doctorDetails.contentStats.articles}</Text>
              <Text style={styles.contentStatLabel}>مقالة</Text>
            </View>

            <View style={styles.contentStatCard}>
              <View style={[styles.contentStatIcon, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="videocam" size={20} color="#10b981" />
              </View>
              <Text style={styles.contentStatNumber}>{doctorDetails.contentStats.videos}</Text>
              <Text style={styles.contentStatLabel}>فيديو</Text>
            </View>

            <View style={styles.contentStatCard}>
              <View style={[styles.contentStatIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="eye" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.contentStatNumber}>{doctorDetails.contentStats.totalViews.toLocaleString()}</Text>
              <Text style={styles.contentStatLabel}>مشاهدة</Text>
            </View>

            <View style={styles.contentStatCard}>
              <View style={[styles.contentStatIcon, { backgroundColor: '#fce7f3' }]}>
                <Ionicons name="heart" size={20} color="#ec4899" />
              </View>
              <Text style={styles.contentStatNumber}>{doctorDetails.contentStats.totalLikes.toLocaleString()}</Text>
              <Text style={styles.contentStatLabel}>إعجاب</Text>
            </View>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="chatbubbles" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>طلب استشارة</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="videocam" size={20} color="#14b8a6" />
            <Text style={styles.secondaryButtonText}>حجز مكالمة</Text>
          </TouchableOpacity>
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
  // HEADER STYLES (matching other pages)
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
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 50,
  },
  // PROFILE CARD
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#14b8a6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  doctorBasicInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  reviewsText: {
    fontSize: 14,
    color: '#6b7280',
  },
  doctorDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'right',
  },
  // SECTION CARDS
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 16,
    paddingRight: 8,
    borderRightWidth: 3,
    borderRightColor: '#14b8a6',
  },
  descriptionText: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'right',
    lineHeight: 24,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  certificationText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'right',
    flex: 1,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  languageText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  // STATS
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  contentStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  contentStatCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  contentStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  contentStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  // ACTION BUTTONS
  actionsContainer: {
    gap: 12,
    marginVertical: 24,
    marginBottom: 100,
  },
  primaryButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 16,
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
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#14b8a6',
  },
  secondaryButtonText: {
    color: '#14b8a6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});