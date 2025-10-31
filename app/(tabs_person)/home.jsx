import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getPosts } from '../../utils/storage';

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
    mediaUrl: require('../../assets/images/doctor thubnail.png'),
    mediaType: 'video',
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
    mediaUrl: require('../../assets/images/woman thubnail.jpg'),
    mediaType: 'video',
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
    mediaUrl: require('../../assets/images/parent kids.jpg'),
    mediaType: 'image',
    likes: 456,
    comments: 67,
    shares: 23,
    isLiked: false,
  },
];

// Carousel data
const carouselData = [
  {
    id: 1,
    image: require('../../assets/images/parents and children.png'),
    title: 'مساحة آمنة للتعلم',
    subtitle: 'معلومات موثوقة من أطباء متخصصين',
  },
  {
    id: 2,
    image: require('../../assets/images/video call.png'),
    title: 'تعليم الأطفال',
    subtitle: 'كيفية التعامل مع التغيرات الجسدية',
  },
  {
    id: 3,
    image: require('../../assets/images/docter_content.webp'),
    title: 'دعم نفسي',
    subtitle: 'استشارات مع متخصصين في الصحة النفسية',
  },
];

export default function PersonHomeScreen() {
  const [posts, setPosts] = useState(HARDCODED_POSTS);
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      // Get user from AsyncStorage directly
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Load posts from storage, fallback to hardcoded
      const storedPosts = await getPosts();
      if (storedPosts.length > 0) {
        setPosts(storedPosts);
      }
    };
    loadData();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % carouselData.length;
        flatListRef.current?.scrollToOffset({
          offset: next * width,
          animated: true,
        });
        return next;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleVideoPress = (post) => {
    // For now, just show an alert with the video URL
    // In a real app, this would open a video player or YouTube
    Alert.alert(
      'تشغيل الفيديو',
      `سيتم تشغيل فيديو: ${post.description.substring(0, 50)}...`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'شاهد الآن',
          onPress: () => {
            // Here you would integrate with a video player or open YouTube
            console.log('Opening video:', post.mediaUrl);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
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

      {/* CONTENT */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* CAROUSEL BANNER */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={carouselData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image
                  source={item.image}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
                <View style={styles.carouselOverlay}>
                  <Text style={styles.carouselTitle}>{item.title}</Text>
                  <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            )}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentSlide(slideIndex);
            }}
            onScrollToIndexFailed={(info) => {
              console.warn('Scroll to index failed:', info);
            }}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />
          {/* Carousel Indicators */}
          <View style={styles.indicators}>
            {carouselData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentSlide && styles.indicatorActive,
                ]}
              />
            ))}
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
              onVideoPress={handleVideoPress}
            />
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

// POST CARD COMPONENT (Best Practice: Separate component)
function PostCard({ post, onLike, onVideoPress }) {
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
        <TouchableOpacity
          style={styles.mediaContainer}
          onPress={() => post.mediaType === 'video' && onVideoPress(post)}
        >
          <Image
            source={post.mediaUrl}
            style={styles.postMedia}
            resizeMode="cover"
          />
          {post.mediaType === 'video' && (
            <View style={styles.playIconContainer}>
              <Ionicons name="play-circle" size={48} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
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
  // CONTENT STYLES
  content: {
    flex: 1,
  },
  // CAROUSEL STYLES
  carouselContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    marginBottom: 16,
  },
  carouselItem: {
    width: width,
    height: 200,
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
    marginBottom: 4,
  },
  carouselSubtitle: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'right',
  },
  indicators: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorActive: {
    backgroundColor: '#fff',
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
  mediaContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  postMedia: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    padding: 8,
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