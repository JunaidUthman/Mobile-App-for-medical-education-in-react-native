import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen({ route, navigation }) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  // Mock call data - in real app this would come from route params
  const callData = {
    doctorName: 'د. أمينة الحسني',
    specialty: 'طب الأطفال',
    avatar: require('../assets/images/doctor.jpg'),
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    console.log('End call button pressed');
    setShowRatingModal(true);
  };

  const handleRatingSubmit = (rating) => {
    setSelectedRating(rating);
    setShowRatingModal(false);
    Alert.alert(
      'شكراً لك',
      `تم تقييم الطبيب بـ ${rating} نجوم`,
      [{ text: 'موافق', onPress: () => router.replace('/(tabs_person)/consultation') }]
    );
    // Navigate immediately after showing alert
    setTimeout(() => {
      router.replace('/(tabs_person)/consultation');
    }, 1000);
  };

  const handleSkipRating = () => {
    setShowRatingModal(false);
    router.replace('/(tabs_person)/consultation');
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Video Area */}
      <View style={styles.videoContainer}>
        {/* Doctor's Video (Mock) */}
        <View style={styles.doctorVideo}>
          <Image
            source={callData.avatar}
            style={styles.doctorImage}
            resizeMode="cover"
          />
          <View style={styles.doctorOverlay}>
            <Text style={styles.doctorName}>{callData.doctorName}</Text>
            <Text style={styles.doctorSpecialty}>{callData.specialty}</Text>
          </View>
        </View>

        {/* Call Duration */}
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
        </View>

        {/* User's Self View (Mock) - No Camera */}
        <View style={styles.selfView}>
          <View style={styles.selfPlaceholder}>
            <Ionicons name="person" size={40} color="#666" />
          </View>
          <Text style={styles.selfLabel}>أنت</Text>
        </View>
      </View>

      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          {/* Mute Button */}
          <TouchableOpacity
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={handleMute}
          >
            <Ionicons
              name={isMuted ? "mic-off" : "mic"}
              size={24}
              color={isMuted ? "#fff" : "#333"}
            />
          </TouchableOpacity>


          {/* Speaker Button */}
          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="volume-high" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* End Call Button */}
        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Ionicons name="call" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>تقييم الطبيب</Text>
            <Text style={styles.modalSubtitle}>
              كيف كانت تجربتك مع {callData.doctorName}؟
            </Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={styles.starButton}
                  onPress={() => handleRatingSubmit(star)}
                >
                  <Ionicons
                    name={selectedRating >= star ? "star" : "star-outline"}
                    size={32}
                    color="#fbbf24"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkipRating}
            >
              <Text style={styles.skipButtonText}>تخطي</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  doctorVideo: {
    flex: 1,
    position: 'relative',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  doctorOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    borderRadius: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'right',
    marginTop: 4,
  },
  durationContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selfView: {
    position: 'absolute',
    top: 100,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#333',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  selfPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
  },
  selfLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    paddingVertical: 2,
  },
  controlsContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#000',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  controlButtonActive: {
    backgroundColor: '#ef4444',
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  starButton: {
    padding: 5,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});