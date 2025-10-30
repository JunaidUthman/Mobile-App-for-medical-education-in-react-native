import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getPosts, getUser } from '../../utils/storage';

const { width } = Dimensions.get('window');

// HARDCODED POSTS DATA (Later: fetch from API)
const HARDCODED_POSTS = [
  {
    id: 1,
    doctorName: 'د. أمينة الحسني',
    doctorSpecialty: 'طب الأطفال',
    doctorAvatar: 'https://i.pravatar.cc/150?img=1',
    timeAgo: 'منذ ساعتين',
    description: 'كيفاش تكلم مع ولادك على التغيرات الجسدية في مرحلة المراهقة. من المهم نبدأو الحوار بشكل مبكر باش نخليو الأطفال يحسو بالراحة.',
    mediaUrl: 'https://picsum.photos/400/300?random=1',
    mediaType: 'image',
    likes: 234,
    comments: 45,
    shares: 12,
    isLiked: false,
  },
  {
    id: 2,
    doctorName: 'د. كريم بنعلي',
    doctorSpecialty: 'علم النفس',
    doctorAvatar: 'https://i.pravatar.cc/150?img=33',
    timeAgo: 'منذ 5 ساعات',
    description: 'نصائح مهمة: الاستماع الفعال هو المفتاح. خلي ولادك يحسو أنك متاح ديما باش يسولوك أي سؤال بدون خوف.',
    mediaUrl: 'https://picsum.photos/400/300?random=2',
    mediaType: 'image',
    likes: 189,
    comments: 28,
    shares: 8,
    isLiked: true,
  },
  {
    id: 3,
    doctorName: 'د. سلمى الإدريسي',
    doctorSpecialty: 'الصحة الجنسية',
    doctorAvatar: 'https://i.pravatar.cc/150?img=5',
    timeAgo: 'منذ يوم',
    description: 'التوعية الجنسية مامشي غير على الجنس، بل على احترام الجسد، الحدود الشخصية، والعلاقات الصحية.',
    mediaUrl: 'https://picsum.photos/400/300?random=3',
    mediaType: 'image',
    likes: 456,
    comments: 67,
    shares: 23,
    isLiked: false,
  },
];

export default function PersonHomeScreen() {
  const [posts, setPosts] = useState(HARDCODED_POSTS);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const userData = await getUser();
      setUser(userData);

      // Load posts from storage, fallback to hardcoded
      const storedPosts = await getPosts();
      if (storedPosts.length > 0) {
        setPosts(storedPosts);
      }
    };
    loadData();
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
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

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* FEATURE IMAGE BANNER */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/800/400?random=banner' }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>مساحة آمنة للتعلم</Text>
            <Text style={styles.bannerSubtitle}>معلومات موثوقة من أطباء متخصصين</Text>
          </View>
        </View>

        {/* POSTS SECTION */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>آخر المنشورات</Text>

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
            />
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

// POST CARD COMPONENT (Best Practice: Separate component)
function PostCard({ post, onLike }) {
  return (
    <View style={styles.postCard}>
      {/* Doctor Info */}
      <View style={styles.postHeader}>
        <View style={styles.doctorInfo}>
          <Image
            source={{ uri: post.doctorAvatar }}
            style={styles.doctorAvatar}
          />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{post.doctorName}</Text>
            <Text style={styles.doctorSpecialty}>{post.doctorSpecialty}</Text>
          </View>
        </View>
        <Text style={styles.timeAgo}>{post.timeAgo}</Text>
      </View>

      {/* Description */}
      <Text style={styles.postDescription}>{post.description}</Text>

      {/* Media (Image/Video) */}
      {post.mediaUrl && (
        <Image
          source={{ uri: post.mediaUrl }}
          style={styles.postMedia}
          resizeMode="cover"
        />
      )}

      {/* Reactions Section */}
      <View style={styles.reactionsContainer}>
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={onLike}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={24}
            color={post.isLiked ? "#ef4444" : "#6b7280"}
          />
          <Text style={[styles.reactionText, post.isLiked && styles.reactionTextActive]}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="chatbubble-outline" size={22} color="#6b7280" />
          <Text style={styles.reactionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="share-social-outline" size={22} color="#6b7280" />
          <Text style={styles.reactionText}>{post.shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.reactionButton, { marginLeft: 'auto' }]}>
          <Ionicons name="bookmark-outline" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  // HEADER STYLES
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
  // CONTENT STYLES
  content: {
    flex: 1,
  },
  // BANNER STYLES
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'right',
  },
  // POSTS SECTION
  postsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 16,
  },
  // POST CARD STYLES
  postCard: {
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
  postHeader: {
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
  timeAgo: {
    fontSize: 12,
    color: '#9ca3af',
  },
  postDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 12,
  },
  postMedia: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  reactionTextActive: {
    color: '#ef4444',
  },
});