import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getConsultations, getPosts } from '../../utils/storage';

export default function DoctorDashboardScreen() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    consultations: 0,
    posts: 0,
    rating: 4.8,
    timeSpent: 8, // months
    videos: 7,
    articles: 12,
    reactions: 118,
  });

  useEffect(() => {
    const loadData = async () => {
      // Load stats
      const consultations = await getConsultations();
      const posts = await getPosts();

      setStats(prevStats => ({
        ...prevStats,
        consultations: consultations.length,
        posts: posts.length,
        rating: 4.8, // hardcoded for now
      }));
    };
    loadData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const handleLogout = async () => {
    try {
      await removeUser();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect even if there's an error
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoImage}>
            <Ionicons name="school" size={24} color="#14b8a6" />
          </View>
          <Text style={styles.logoText}>بيني وبينك</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user?.username || 'الطبيب'}</Text>
          <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
            <Ionicons name="person-circle" size={28} color="#14b8a6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* STATS OVERVIEW */}
        <View style={styles.statsOverview}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="star" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.statNumber}>{stats.rating}</Text>
              <Text style={styles.statLabel}>التقييم</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="videocam" size={24} color="#3b82f6" />
              </View>
              <Text style={styles.statNumber}>{stats.consultations}</Text>
              <Text style={styles.statLabel}>الاستشارات</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIconBg, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="time" size={24} color="#10b981" />
              </View>
              <Text style={styles.statNumber}>{stats.timeSpent}</Text>
              <Text style={styles.statLabel}>أشهر</Text>
            </View>
          </View>
        </View>

        {/* DOCTOR PROFILE */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.doctorImage}>
              <Ionicons name="person-circle" size={80} color="#14b8a6" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.doctorName}>د. {user?.username || 'أحمد محمد'}</Text>
              <Text style={styles.doctorSpecialty}>طبيب نفسي متخصص في الصحة النفسية للأطفال والمراهقين</Text>
              <Text style={styles.doctorBio}>
                أعمل على مساعدة الأسر في فهم احتياجات أطفالهم النفسية وتقديم الدعم اللازم لهم في رحلتهم التعليمية والنفسية.
              </Text>
              <View style={styles.doctorStats}>
                <View style={styles.doctorStat}>
                  <Ionicons name="school" size={16} color="#14b8a6" />
                  <Text style={styles.doctorStatText}>خبرة 8 سنوات</Text>
                </View>
                <View style={styles.doctorStat}>
                  <Ionicons name="location" size={16} color="#14b8a6" />
                  <Text style={styles.doctorStatText}>الرباط، المغرب</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* CONTENT STATS */}
        <View style={styles.contentStatsSection}>
          <Text style={styles.sectionTitle}>إحصائيات المحتوى</Text>
          <View style={styles.contentStatsGrid}>
            <View style={styles.contentStatCard}>
              <View style={[styles.contentStatIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="videocam" size={20} color="#f59e0b" />
              </View>
              <Text style={styles.contentStatNumber}>{stats.videos}</Text>
              <Text style={styles.contentStatLabel}>فيديو</Text>
            </View>

            <View style={styles.contentStatCard}>
              <View style={[styles.contentStatIcon, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="document-text" size={20} color="#3b82f6" />
              </View>
              <Text style={styles.contentStatNumber}>{stats.articles}</Text>
              <Text style={styles.contentStatLabel}>مقالة</Text>
            </View>

            <View style={styles.contentStatCard}>
              <View style={[styles.contentStatIcon, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="heart" size={20} color="#10b981" />
              </View>
              <Text style={styles.contentStatNumber}>{stats.reactions}</Text>
              <Text style={styles.contentStatLabel}>تفاعل</Text>
            </View>
          </View>
        </View>


        {/* RECENT ACTIVITY */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>النشاط الأخير</Text>

          <View style={styles.activityCard}>
            <Ionicons name="time" size={20} color="#6b7280" />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>لا يوجد نشاط حديث</Text>
              <Text style={styles.activityTime}>آخر تحديث: الآن</Text>
            </View>
          </View>
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
  // HEADER STYLES (matching user space)
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
  statsOverview: {
    backgroundColor: '#14b8a6',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#e6f7f4',
    fontWeight: '600',
  },
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  profileInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 20,
  },
  doctorBio: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'right',
    lineHeight: 18,
    marginBottom: 12,
  },
  doctorStats: {
    flexDirection: 'row',
    gap: 16,
  },
  doctorStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorStatText: {
    fontSize: 12,
    color: '#14b8a6',
    fontWeight: '600',
  },
  contentStatsSection: {
    marginBottom: 32,
  },
  contentStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  contentStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  contentStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  contentStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  statContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  actionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 8,
  },
  activitySection: {
    marginBottom: 100,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
    alignItems: 'flex-end',
  },
  activityText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'right',
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'right',
  },
});