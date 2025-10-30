import { Ionicons } from '@expo/vector-icons';
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
import { addConsultation, getConsultations, getUser } from '../../utils/storage';

export default function ConsultationScreen() {
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [pastConsultations, setPastConsultations] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const userData = await getUser();
      setUser(userData);

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
        {/* FORM SECTION */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>طلب استشارة جديدة</Text>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="chatbubble" size={14} /> الموضوع / المشكلة
              </Text>
              <TextInput
                style={styles.input}
                value={topic}
                onChangeText={setTopic}
                placeholder="اكتب موضوع استشارتك هنا..."
                textAlign="right"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="document-text" size={14} /> التفاصيل
              </Text>
              <TextInput
                style={[styles.input, styles.messageInput]}
                value={message}
                onChangeText={setMessage}
                placeholder="اكتب تفاصيل استشارتك هنا..."
                textAlign="right"
                multiline
                numberOfLines={6}
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>إرسال الاستشارة</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  formSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
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