import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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
import { addPost, getUser } from '../../utils/storage';

export default function AddContentScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('خطأ', 'يرجى ملء العنوان والوصف');
      return;
    }

    const user = await getUser();
    if (!user) {
      Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً');
      return;
    }

    const post = {
      id: Date.now().toString(),
      doctorName: `د. ${user.username}`,
      doctorSpecialty: user.field || 'طبيب',
      doctorAvatar: 'https://i.pravatar.cc/150?img=12', // placeholder
      timeAgo: 'الآن',
      title: title.trim(),
      description: description.trim(),
      mediaUrl: mediaUrl.trim() || 'https://picsum.photos/400/300?random=post',
      mediaType,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    await addPost(post);

    // Reset form
    setTitle('');
    setDescription('');
    setMediaUrl('');

    Alert.alert('تم بنجاح', 'تم نشر المحتوى بنجاح');
  };

  const pickMedia = () => {
    // In a real app, this would open image/video picker
    Alert.alert('اختيار الوسائط', 'سيتم إضافة منتقي الصور/الفيديو هنا');
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
          <Text style={styles.sectionTitle}>إضافة محتوى جديد</Text>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="document-text" size={14} /> العنوان
              </Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="اكتب عنوان المنشور..."
                textAlign="right"
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="chatbubble" size={14} /> الوصف
              </Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="اكتب وصف المنشور..."
                textAlign="right"
                multiline
                numberOfLines={6}
              />
            </View>

            {/* MEDIA TYPE SELECTOR */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="images" size={14} /> نوع الوسائط
              </Text>
              <View style={styles.mediaTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.mediaTypeButton,
                    mediaType === 'image' && styles.mediaTypeButtonActive,
                  ]}
                  onPress={() => setMediaType('image')}
                >
                  <Ionicons name="image" size={20} color={mediaType === 'image' ? '#fff' : '#6b7280'} />
                  <Text style={[
                    styles.mediaTypeText,
                    mediaType === 'image' && styles.mediaTypeTextActive,
                  ]}>
                    صورة
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.mediaTypeButton,
                    mediaType === 'video' && styles.mediaTypeButtonActive,
                  ]}
                  onPress={() => setMediaType('video')}
                >
                  <Ionicons name="videocam" size={20} color={mediaType === 'video' ? '#fff' : '#6b7280'} />
                  <Text style={[
                    styles.mediaTypeText,
                    mediaType === 'video' && styles.mediaTypeTextActive,
                  ]}>
                    فيديو
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* MEDIA PICKER */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                <Ionicons name="cloud-upload" size={14} /> الوسائط
              </Text>
              <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
                <Ionicons name="add-circle" size={24} color="#14b8a6" />
                <Text style={styles.mediaButtonText}>
                  {mediaType === 'image' ? 'اختر صورة' : 'اختر فيديو'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.helpText}>
                أو أدخل رابط URL للوسائط
              </Text>
              <TextInput
                style={styles.urlInput}
                value={mediaUrl}
                onChangeText={setMediaUrl}
                placeholder="https://example.com/image.jpg"
                textAlign="right"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>نشر المحتوى</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PREVIEW SECTION */}
        {(title || description) && (
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>معاينة المنشور</Text>

            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>{title || 'عنوان المنشور'}</Text>
              <Text style={styles.previewDescription}>
                {description || 'وصف المنشور سيظهر هنا...'}
              </Text>
              {mediaUrl && (
                <View style={styles.previewMedia}>
                  <Ionicons
                    name={mediaType === 'video' ? 'videocam' : 'image'}
                    size={48}
                    color="#9ca3af"
                  />
                  <Text style={styles.previewMediaText}>
                    {mediaType === 'video' ? 'فيديو' : 'صورة'}
                  </Text>
                </View>
              )}
            </View>
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
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  mediaTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  mediaTypeButtonActive: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  mediaTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  mediaTypeTextActive: {
    color: '#fff',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  mediaButtonText: {
    fontSize: 16,
    color: '#14b8a6',
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 8,
    marginBottom: 8,
  },
  urlInput: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    textAlign: 'right',
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
  previewSection: {
    paddingBottom: 100,
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 12,
  },
  previewDescription: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'right',
    lineHeight: 22,
    marginBottom: 16,
  },
  previewMedia: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  previewMediaText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
});