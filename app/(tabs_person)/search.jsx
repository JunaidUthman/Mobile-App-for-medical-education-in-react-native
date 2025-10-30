import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// HARDCODED DOCTORS DATA
const HARDCODED_DOCTORS = [
  {
    id: 1,
    name: 'د. أمينة الحسني',
    specialty: 'طب الأطفال',
    rating: 4.8,
    reviews: 124,
    avatar: 'https://i.pravatar.cc/150?img=1',
    experience: '15 سنة',
    location: 'الرباط',
  },
  {
    id: 2,
    name: 'د. كريم بنعلي',
    specialty: 'علم النفس',
    rating: 4.9,
    reviews: 89,
    avatar: 'https://i.pravatar.cc/150?img=33',
    experience: '12 سنة',
    location: 'الدار البيضاء',
  },
  {
    id: 3,
    name: 'د. سلمى الإدريسي',
    specialty: 'الصحة الجنسية',
    rating: 4.7,
    reviews: 156,
    avatar: 'https://i.pravatar.cc/150?img=5',
    experience: '10 سنوات',
    location: 'فاس',
  },
  {
    id: 4,
    name: 'د. محمد التازي',
    specialty: 'طب المراهقين',
    rating: 4.6,
    reviews: 98,
    avatar: 'https://i.pravatar.cc/150?img=12',
    experience: '8 سنوات',
    location: 'مراكش',
  },
  {
    id: 5,
    name: 'د. فاطمة الزهراء',
    specialty: 'استشارات أسرية',
    rating: 4.9,
    reviews: 203,
    avatar: 'https://i.pravatar.cc/150?img=9',
    experience: '18 سنة',
    location: 'أكادير',
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors] = useState(HARDCODED_DOCTORS);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDoctorCard = ({ item }) => (
    <TouchableOpacity style={styles.doctorCard}>
      <View style={styles.doctorInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{item.name}</Text>
          <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
          <Text style={styles.doctorLocation}>
            <Ionicons name="location" size={12} /> {item.location}
          </Text>
        </View>
      </View>

      <View style={styles.doctorStats}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews})</Text>
        </View>
        <Text style={styles.experienceText}>{item.experience} خبرة</Text>
      </View>
    </TouchableOpacity>
  );

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

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="البحث عن طبيب..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
          />
        </View>
      </View>

      {/* DOCTORS LIST */}
      <View style={styles.doctorsSection}>
        <Text style={styles.sectionTitle}>
          الأطباء المتخصصون ({filteredDoctors.length})
        </Text>

        <FlatList
          data={filteredDoctors}
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'right',
  },
  doctorsSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
    marginBottom: 16,
  },
  doctorsList: {
    paddingBottom: 20,
  },
  doctorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#14b8a6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  doctorDetails: {
    flex: 1,
    gap: 4,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
  doctorLocation: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  doctorStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  experienceText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
});