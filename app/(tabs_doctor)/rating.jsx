import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getUser } from '../../utils/storage';

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

export default function RatingScreen() {
  const [doctors, setDoctors] = useState(HARDCODED_DOCTORS);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      setCurrentUser(user);

      // Mark current user in the list
      if (user && user.type === 'doctor') {
        setDoctors(prev => prev.map(doctor => ({
          ...doctor,
          isCurrentUser: doctor.name.includes(user.username) || false, // Simple match for demo
        })));
      }
    };
    loadUser();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#fbbf24" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#fbbf24" />
      );
    }

    return stars;
  };

  const renderDoctorCard = ({ item, index }) => (
    <View style={[styles.doctorCard, item.isCurrentUser && styles.currentUserCard]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, item.isCurrentUser && styles.currentUserRankText]}>
          #{index + 1}
        </Text>
      </View>

      <View style={styles.doctorInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>

        <View style={styles.doctorDetails}>
          <Text style={[styles.doctorName, item.isCurrentUser && styles.currentUserText]}>
            {item.name} {item.isCurrentUser && '(أنت)'}
          </Text>
          <Text style={[styles.doctorSpecialty, item.isCurrentUser && styles.currentUserText]}>
            {item.specialty}
          </Text>
          <Text style={[styles.doctorExperience, item.isCurrentUser && styles.currentUserText]}>
            {item.experience} خبرة
          </Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>
          {renderStars(item.rating)}
        </View>
        <Text style={[styles.ratingText, item.isCurrentUser && styles.currentUserText]}>
          {item.rating}
        </Text>
        <Text style={[styles.reviewsText, item.isCurrentUser && styles.currentUserText]}>
          ({item.reviews} تقييم)
        </Text>
      </View>
    </View>
  );

  const sortedDoctors = [...doctors].sort((a, b) => b.rating - a.rating);

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
      <View style={styles.content}>
        <Text style={styles.title}>ترتيب الأطباء</Text>
        <Text style={styles.subtitle}>
          الترتيب حسب متوسط التقييمات من الآباء
        </Text>

        <FlatList
          data={sortedDoctors}
          renderItem={renderDoctorCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.doctorsList}
        />
      </View>
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
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
    marginBottom: 24,
  },
  doctorsList: {
    paddingBottom: 100,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  currentUserCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
    borderColor: '#14b8a6',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  currentUserRankText: {
    color: '#14b8a6',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#14b8a6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  doctorDetails: {
    flex: 1,
    marginLeft: 12,
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
  doctorExperience: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
  },
  currentUserText: {
    color: '#14b8a6',
  },
  ratingContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6b7280',
  },
});