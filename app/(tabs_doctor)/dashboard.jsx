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
import { getConsultations, getPosts, getUser } from '../../utils/storage';

export default function DoctorDashboardScreen() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    consultations: 0,
    posts: 0,
    rating: 4.8,
  });

  useEffect(() => {
    const loadData = async () => {
      const userData = await getUser();
      setUser(userData);

      // Load stats
      const consultations = await getConsultations();
      const posts = await getPosts();

      setStats({
        consultations: consultations.length,
        posts: posts.length,
        rating: 4.8, // hardcoded for now
      });
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

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={28} color="#14b8a6" />
          <Text style={styles.logoText}>التربية الصحية</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            Alert.alert(
              'تأكيد الخروج',
              'هل أنت متأكد من رغبتك في تسجيل الخروج؟',
              [
                { text: 'إلغاء', style: 'cancel' },
                {
                  text: 'خروج',
                  style: 'destructive',
                  onPress: async () => {
                    await removeUser();
                    router.replace('/(auth)/register');
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name="log-out-outline" size={28} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* WELCOME SECTION */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            مرحباً د. {user?.username || 'الطبيب'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            إليك نظرة عامة على نشاطك في التطبيق
          </Text>
        </View>

        {/* STATS CARDS */}
        <View style={styles.statsSection}>
          <StatCard
            title="الاستشارات"
            value={stats.consultations}
            icon="chatbubbles"
            color="#14b8a6"
          />
          <StatCard
            title="المنشورات"
            value={stats.posts}
            icon="document-text"
            color="#f59e0b"
          />
          <StatCard
            title="متوسط التقييم"
            value={stats.rating}
            icon="star"
            color="#ef4444"
          />
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>الإجراءات السريعة</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="add-circle" size={32} color="#14b8a6" />
              <Text style={styles.actionText}>إضافة منشور</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="calendar" size={32} color="#f59e0b" />
              <Text style={styles.actionText}>جدولة موعد</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="chatbubbles" size={32} color="#8b5cf6" />
              <Text style={styles.actionText}>الاستشارات</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="stats-chart" size={32} color="#ef4444" />
              <Text style={styles.actionText}>الإحصائيات</Text>
            </TouchableOpacity>
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
  welcomeSection: {
    paddingVertical: 24,
    alignItems: 'flex-end',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'right',
  },
  statsSection: {
    gap: 16,
    marginBottom: 32,
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