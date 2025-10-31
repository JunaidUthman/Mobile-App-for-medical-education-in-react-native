import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Image,
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
    email: '',
    university: '',
    field: '',
  });
  const [children, setChildren] = useState([{ age: '', gender: 'بنت' }]);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showGenderDropdown, setShowGenderDropdown] = useState(null);

  const handleSubmit = async () => {
    console.log('Form submitted:', { userType, ...formData });

    // Prepare user data
    const userData = {
      id: Date.now().toString(),
      type: userType,
      username: formData.username,
      password: formData.password,
      ...(userType === 'normal' && { children }),
      ...(userType === 'doctor' && {
        email: formData.email,
        university: formData.university,
        field: formData.field,
      }),
      createdAt: new Date().toISOString(),
    };

    // Save user data locally
    await saveUser(userData);

    // For doctors, show verification popup and don't redirect immediately
    if (userType === 'doctor') {
      // Show verification alert
      alert('سيتم التحقق من معلوماتك وإشعارك عبر البريد الإلكتروني عند الموافقة عليها');
      // Stay on registration page or redirect to login
      router.replace('/(auth)/login');
      return;
    }

    // For normal users, redirect immediately
    router.replace('/(tabs_person)/home');
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
    // Here you would implement Google OAuth
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        console.log('Document selected:', result);
        // For web testing, just use console.log since Alert doesn't work
        console.log('تم رفع الملف بنجاح', `اسم الملف: ${result.name}\nالحجم: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      console.error('خطأ: حدث خطأ أثناء اختيار الملف');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo Section with Decorative Elements */}
        <View style={{
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 30,
          position: 'relative',
        }}>
          {/* Decorative circles */}
          <View style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: '#e6f7f4',
            opacity: 0.3,
            top: -25,
          }} />
          <View style={{
            position: 'absolute',
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: '#28b79d',
            opacity: 0.1,
            top: -5,
          }} />

          {/* Logo Container */}
          <View style={{
            backgroundColor: '#ffffff',
            padding: 20,
            borderRadius: 30,
            shadowColor: '#28b79d',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 10,
          }}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 120, height: 120, resizeMode: 'contain' }}
            />
          </View>

          {/* Welcome Text */}
          <Text style={{
            marginTop: 24,
            fontSize: 26,
            fontWeight: '800',
            color: '#124170',
            textAlign: 'center',
            letterSpacing: 0.5,
          }}>
            مرحباً بك
          </Text>
          <Text style={{
            marginTop: 8,
            fontSize: 15,
            color: '#6b7280',
            textAlign: 'center',
          }}>
            منصتك الموثوقة للتوعية الأسرية
          </Text>
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
                    <Ionicons name="person" size={14} /> اسم المستخدم
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === 'doctor-username' && styles.inputFocused
                    ]}
                    value={formData.username}
                    onChangeText={(text) =>
                      setFormData({ ...formData, username: text })
                    }
                    onFocus={() => setFocusedInput('doctor-username')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="أدخل اسم المستخدم"
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="mail" size={14} /> البريد الإلكتروني
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === 'doctor-email' && styles.inputFocused
                    ]}
                    value={formData.email}
                    onChangeText={(text) =>
                      setFormData({ ...formData, email: text })
                    }
                    onFocus={() => setFocusedInput('doctor-email')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="أدخل البريد الإلكتروني"
                    keyboardType="email-address"
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    <Ionicons name="business" size={14} /> الجامعة
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      focusedInput === 'university' && styles.inputFocused
                    ]}
                    value={formData.university}
                    onChangeText={(text) =>
                      setFormData({ ...formData, university: text })
                    }
                    onFocus={() => setFocusedInput('university')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="أدخل اسم الجامعة"
                    textAlign="right"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>التخصص</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={formData.field}
                      onValueChange={(itemValue) =>
                        setFormData({ ...formData, field: itemValue })
                      }
                      style={styles.nativePicker}
                    >
                      <Picker.Item label="اختر التخصص" value="" />
                      <Picker.Item label="طبيب عام" value="طبيب عام" />
                      <Picker.Item label="طبيب أطفال" value="طبيب أطفال" />
                      <Picker.Item label="طبيب صحة جنسية" value="طبيب صحة جنسية" />
                      <Picker.Item label="أخرى" value="أخرى" />
                    </Picker>
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

            {/* Username field for normal users */}
            {userType === 'normal' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Ionicons name="person" size={14} /> اسم المستخدم
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'normal-username' && styles.inputFocused
                  ]}
                  value={formData.username}
                  onChangeText={(text) =>
                    setFormData({ ...formData, username: text })
                  }
                  onFocus={() => setFocusedInput('normal-username')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="أدخل اسم المستخدم"
                  textAlign="right"
                />
              </View>
            )}

            {/* Children info for normal users */}
            {userType === 'normal' && (
              <View style={styles.childrenContainer}>
                <Text style={styles.sectionTitle}>معلومات الأطفال</Text>
                {children.map((child, index) => (
                  <View key={index} style={styles.childCard}>
                    <View style={styles.childHeader}>
                      <Text style={styles.childTitle}>الطفل {index + 1}</Text>
                      {index > 0 && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => {
                            const newChildren = children.filter((_, i) => i !== index);
                            setChildren(newChildren);
                          }}
                        >
                          <Ionicons name="close-circle" size={24} color="#ef4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.childInputs}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>العمر</Text>
                        <TextInput
                          style={[
                            styles.input,
                            focusedInput === `age-${index}` && styles.inputFocused
                          ]}
                          value={child.age}
                          onChangeText={(text) => {
                            const newChildren = [...children];
                            newChildren[index].age = text;
                            setChildren(newChildren);
                          }}
                          onFocus={() => setFocusedInput(`age-${index}`)}
                          onBlur={() => setFocusedInput(null)}
                          placeholder="أدخل العمر"
                          keyboardType="numeric"
                          textAlign="right"
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.label}>الجنس</Text>
                        <View style={styles.pickerContainer}>
                          <TouchableOpacity
                            style={[
                              styles.picker,
                              showGenderDropdown === index && styles.pickerFocused
                            ]}
                            onPress={() => {
                              const newChildren = [...children];
                              newChildren[index].gender = newChildren[index].gender === 'بنت' ? 'ولد' : 'بنت';
                              setChildren(newChildren);
                            }}
                          >
                            <View style={styles.genderContent}>
                              <Ionicons
                                name={child.gender === 'ولد' ? 'male' : 'female'}
                                size={20}
                                color={child.gender === 'ولد' ? '#14b8a6' : '#ec4899'}
                              />
                              <Text style={styles.pickerText}>
                                {child.gender}
                              </Text>
                            </View>
                            <Ionicons
                              name="swap-horizontal"
                              size={20}
                              color="#666"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addChildButton}
                  onPress={() => setChildren([...children, { age: '', gender: '' }])}
                >
                  <Ionicons name="add-circle" size={24} color="#14b8a6" />
                  <Text style={styles.addChildText}>إضافة طفل آخر</Text>
                </TouchableOpacity>
              </View>
            )}

          

            {/* Password field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="lock-closed" size={14} /> كلمة المرور
              </Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === `${userType}-password` && styles.inputFocused
                ]}
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                onFocus={() => setFocusedInput(`${userType}-password`)}
                onBlur={() => setFocusedInput(null)}
                placeholder="أدخل كلمة المرور"
                secureTextEntry
                textAlign="right"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>تسجيل الحساب</Text>
            </TouchableOpacity>

            {/* Auto-login notice for normal users */}
            {userType === 'normal' && (
              <Text style={styles.autoLoginText}>
                سيتم تسجيل الدخول تلقائياً بعد إنشاء الحساب
              </Text>
            )}

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
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
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
  inputFocused: {
    borderColor: '#14b8a6 !important',
    borderWidth: 3,
    borderStyle: 'solid',
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
    position: 'relative', // Add this
    zIndex: 1, // Add this
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
  childrenContainer: {
    marginTop: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 8,
  },
  childCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  childTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'right',
    marginBottom: 12,
  },
  childInputs: {
    gap: 12,
  },
  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f0fdfa',
    borderWidth: 2,
    borderColor: '#14b8a6',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  addChildText: {
    fontSize: 16,
    color: '#14b8a6',
    fontWeight: '600',
  },
  pickerFocused: {
    borderColor: '#14b8a6',
    shadowColor: '#14b8a6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdown: {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: 4, // Add spacing between picker and dropdown
  backgroundColor: '#ffffff', // Fully opaque white
  borderWidth: 2,
  borderColor: '#e5e7eb',
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 15, // Increased elevation
  zIndex: 9999, // Very high z-index
  maxHeight: 200, // Limit height
  overflow: 'hidden',
},
  dropdownItem: {
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: '#f3f4f6',
  backgroundColor: '#ffffff', // Fully opaque
},
dropdownItemLast: {
  borderBottomWidth: 0,
},
nativePicker: {
  height: 50,
  color: '#374151',
  borderRadius: 12,
  width: '100%',
},
  dropdownText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'right',
  },
  genderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  removeButton: {
    padding: 4,
  },
  autoLoginText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
});