import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getUser, removeUser, saveUser } from '../../utils/storage';

export default function SettingsScreen() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser();
      setUser(userData);
      if (userData) {
        setFormData({
          username: userData.username || '',
          password: userData.password || '',
        });
      }
    };
    loadUser();
  }, []);

  const handleSaveProfile = async () => {
    if (!formData.username.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المستخدم');
      return;
    }

    const updatedUser = {
      ...user,
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    await saveUser(updatedUser);
    setUser(updatedUser);
    Alert.alert('تم بنجاح', 'تم حفظ التغييرات');
  };

  const handleLogout = () => {
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
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        {/* PROFILE SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إعدادات الملف الشخصي</Text>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="person" size={14} /> اسم المستخدم
              </Text>
              <TextInput
                style={styles.input}
                value={formData.username}
                onChangeText={(text) =>
                  setFormData({ ...formData, username: text })
                }
                placeholder="أدخل اسم المستخدم"
                textAlign="right"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="lock-closed" size={14} /> كلمة المرور
              </Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                placeholder="أدخل كلمة المرور الجديدة"
                secureTextEntry
                textAlign="right"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ACCOUNT ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>إجراءات الحساب</Text>

          <View style={styles.card}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="notifications-outline" size={24} color="#6b7280" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>إشعارات</Text>
                <Text style={styles.actionSubtitle}>إدارة إعدادات الإشعارات</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle-outline" size={24} color="#6b7280" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>المساعدة والدعم</Text>
                <Text style={styles.actionSubtitle}>الحصول على المساعدة</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="information-circle-outline" size={24} color="#6b7280" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>حول التطبيق</Text>
                <Text style={styles.actionSubtitle}>معلومات عن التطبيق</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* LOGOUT */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutButtonText}>تسجيل الخروج</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
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
    paddingBottom: 20,
  },
  section: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 16,
  },
  card: {
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
  saveButton: {
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
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  actionContent: {
    flex: 1,
    gap: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});