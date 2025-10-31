import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { removeUser } from '../../utils/storage';

// HARDCODED DOCTORS DATA WITH RATINGS
const HARDCODED_DOCTORS = [
  {
    id: 1,
    name: 'د. أمينة الحسني',
    specialty: 'طب الأطفال',
    rating: 4.9,
    reviews: 124,
    avatar: 'https://i.pravatar.cc/150?img=1',
    experience: '15 سنة',
    isCurrentUser: false,
  },
  {
    id: 2,
    name: 'د. كريم بنعلي',
    specialty: 'علم النفس',
    rating: 4.8,
    reviews: 89,
    avatar: 'https://i.pravatar.cc/150?img=33',
    experience: '12 سنة',
    isCurrentUser: false,
  },
  {
    id: 3,
    name: 'د. سلمى الإدريسي',
    specialty: 'الصحة الجنسية',
    rating: 4.7,
    reviews: 156,
    avatar: 'https://i.pravatar.cc/150?img=5',
    experience: '10 سنوات',
    isCurrentUser: false,
  },
  {
    id: 4,
    name: 'د. محمد التازي',
    specialty: 'طب المراهقين',
    rating: 4.6,
    reviews: 98,
    avatar: 'https://i.pravatar.cc/150?img=12',
    experience: '8 سنوات',
    isCurrentUser: false,
  },
  {
    id: 5,
    name: 'د. فاطمة الزهراء',
    specialty: 'استشارات أسرية',
    rating: 4.5,
    reviews: 203,
    avatar: 'https://i.pravatar.cc/150?img=9',
    experience: '18 سنة',
    isCurrentUser: false,
  },
];

export default function DoctorSettingsScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await removeUser();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error during logout:', error);
      router.replace('/(auth)/login');
    }
  };

  const settingsOptions = [
    {
      id: 1,
      title: 'الملف الشخصي',
      icon: 'person-outline',
      action: () => Alert.alert('قريباً', 'هذه الميزة ستكون متاحة قريباً'),
    },
    {
      id: 2,
      title: 'الإشعارات',
      icon: 'notifications-outline',
      action: () => Alert.alert('قريباً', 'هذه الميزة ستكون متاحة قريباً'),
    },
    {
      id: 3,
      title: 'الأمان والخصوصية',
      icon: 'shield-checkmark-outline',
      action: () => Alert.alert('قريباً', 'هذه الميزة ستكون متاحة قريباً'),
    },
    {
      id: 4,
      title: 'المساعدة والدعم',
      icon: 'help-circle-outline',
      action: () => Alert.alert('قريباً', 'هذه الميزة ستكون متاحة قريباً'),
    },
    {
      id: 5,
      title: 'حول التطبيق',
      icon: 'information-circle-outline',
      action: () => Alert.alert('حول التطبيق', 'تطبيق التربية الصحية - نسخة 1.0.0'),
    },
  ];

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
          <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
            <Ionicons name="person-circle" size={28} color="#14b8a6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>الإعدادات</Text>

        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.settingItem}
            onPress={option.action}
          >
            <View style={styles.settingLeft}>
              <Ionicons name={option.icon} size={24} color="#6b7280" />
              <Text style={styles.settingText}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 24,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'right',
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    marginBottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
});