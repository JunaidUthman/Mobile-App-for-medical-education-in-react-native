import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function VideoCallDoctorScreen({ route, navigation }) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Mock call data - in real app this would come from route params
  const callData = {
    patientName: 'أحمد محمد',
    patientAvatar: require('../assets/images/doctor.jpg'),
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
    Alert.alert(
      'إنهاء المكالمة',
      'هل أنت متأكد من إنهاء المكالمة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إنهاء',
          style: 'destructive',
          onPress: () => router.replace('/(tabs_doctor)/calendar')
        },
      ]
    );
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoToggle = () => {
    setIsVideoOff(!isVideoOff);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Area */}
      <View style={styles.videoContainer}>
        {/* Patient's Video (Mock) */}
        <View style={styles.patientVideo}>
          <Image
            source={callData.patientAvatar}
            style={styles.patientImage}
            resizeMode="cover"
          />
          <View style={styles.patientOverlay}>
            <Text style={styles.patientName}>{callData.patientName}</Text>
          </View>
        </View>

        {/* Call Duration */}
        <View style={styles.durationContainer}>
          <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
        </View>

        {/* Doctor's Self View (Mock) */}
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

          {/* Video Toggle Button */}
          <TouchableOpacity
            style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
            onPress={handleVideoToggle}
          >
            <Ionicons
              name={isVideoOff ? "videocam-off" : "videocam"}
              size={24}
              color={isVideoOff ? "#fff" : "#333"}
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
  patientVideo: {
    flex: 1,
    position: 'relative',
  },
  patientImage: {
    width: '100%',
    height: '100%',
  },
  patientOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    borderRadius: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
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
});