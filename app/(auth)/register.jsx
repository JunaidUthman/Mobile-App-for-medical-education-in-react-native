import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { saveUser } from '../../utils/storage';

export default function RegistrationScreen() {
  const [userType, setUserType] = useState('normal'); // 'normal' or 'doctor'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    university: '',
    field: '',
  });

  const handleSubmit = async () => {
    console.log('Form submitted:', { userType, ...formData });

    // Prepare user data
    const userData = {
      id: Date.now().toString(),
      type: userType,
      username: formData.username,
      password: formData.password,
      ...(userType === 'doctor' && {
        university: formData.university,
        field: formData.field,
      }),
      createdAt: new Date().toISOString(),
    };

    // Save user data locally
    await saveUser(userData);

    // Redirect based on user type
    if (userType === 'normal') {
      router.replace('/(tabs_person)/home');
    } else {
      router.replace('/(tabs_doctor)/dashboard');
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
    // Here you would implement Google OAuth
  };

  const pickDocument = async () => {
    // You'll need expo-document-picker for this
    console.log('Document picker would open here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={48} color="#fff" />
          </View>
          <Text style={styles.logoTitle}>بيني وبينيك</Text>
          <Text style={styles.logoSubtitle}>دليل الوالدين للتوعية الجنسية</Text>
        </View>

        {/* Registration Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>تسجيل حساب جديد</Text>

          {/* User Type Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                userType === 'normal' && styles.toggleButtonActive,
              ]}
              onPress={() => setUserType('normal')}
            >
              <Ionicons
                name="person"
                size={16}
                color={userType === 'normal' ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.toggleText,
                  userType === 'normal' && styles.toggleTextActive,
                ]}
              >
                مستخدم عادي
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                userType === 'doctor' && styles.toggleButtonActive,
              ]}
              onPress={() => setUserType('doctor')}
            >
              <Ionicons
                name="medkit"
                size={16}
                color={userType === 'doctor' ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.toggleText,
                  userType === 'doctor' && styles.toggleTextActive,
                ]}
              >
                طبيب
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Doctor-specific fields */}
            {userType === 'doctor' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="business" size={14} /> الجامعة
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formData.university}
                    onChangeText={(text) =>
                      setFormData({ ...formData, university: text })
                    }
                    placeholder="أدخل اسم الجامعة"
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>التخصص</Text>
                  <View style={styles.pickerContainer}>
                    <TouchableOpacity
                      style={styles.picker}
                      onPress={() => {
                        // In real app, you'd show a picker modal here
                        console.log('Show field picker');
                      }}
                    >
                      <Text style={styles.pickerText}>
                        {formData.field || 'اختر التخصص'}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="document" size={14} /> الشهادة الطبية
                  </Text>
                  <TouchableOpacity
                    style={styles.fileButton}
                    onPress={pickDocument}
                  >
                    <Ionicons name="cloud-upload" size={20} color="#14b8a6" />
                    <Text style={styles.fileButtonText}>رفع الشهادة</Text>
                  </TouchableOpacity>
                  <Text style={styles.helpText}>
                    PDF, JPG أو PNG (الحد الأقصى 5MB)
                  </Text>
                </View>
              </>
            )}

            {/* Common fields */}
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
                placeholder="أدخل كلمة المرور"
                secureTextEntry
                textAlign="right"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>تسجيل الحساب</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>أو</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
            >
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text style={styles.googleButtonText}>التسجيل بواسطة Google</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>عندك حساب؟ </Text>
            <TouchableOpacity>
              <Text style={styles.loginLink}>تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          بإنشاء حساب، أنت توافق على شروط الخدمة وسياسة الخصوصية
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2f1',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#14b8a6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  logoSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#14b8a6',
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#666',
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#f0fdfa',
  },
  fileButtonText: {
    fontSize: 16,
    color: '#14b8a6',
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6b7280',
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#6b7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#14b8a6',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    marginTop: 24,
    paddingHorizontal: 20,
  },
});