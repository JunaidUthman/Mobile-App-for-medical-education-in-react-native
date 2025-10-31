import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f5f8fa' }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 50 }}
    >
      {/* Logo Section with Decorative Elements */}
      <View style={{ 
        alignItems: 'center', 
        marginTop: 70, 
        marginBottom: 60,
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

      {/* Feature Cards */}
      <View style={{ gap: 20 }}>
        {/* First Card */}
        <View style={{
          backgroundColor: '#ffffff',
          padding: 26,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#e6f7f4',
          shadowColor: '#28b79d',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#e6f7f4',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#28b79d',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 3,
            }}>
              <MaterialCommunityIcons name="book-open-page-variant" size={28} color="#28b79d" />
            </View>
            <View style={{
              backgroundColor: '#28b79d',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>تعليم</Text>
            </View>
          </View>
          <Text style={{
            fontSize: 17,
            fontWeight: '600',
            color: '#1f2937',
            textAlign: 'right',
            lineHeight: 28,
            writingDirection: 'rtl',
          }}>
            في هذا التطبيق، ستتعلم كيفية تعليم أطفالك كيفية التعامل مع مشاكلهم الجنسية
          </Text>
        </View>

        {/* Second Card */}
        <View style={{
          backgroundColor: '#ffffff',
          padding: 26,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#f0f7f3',
          shadowColor: '#67C090',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#f0f7f3',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#67C090',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 3,
            }}>
              <Feather name="video" size={26} color="#67C090" />
            </View>
            <View style={{
              backgroundColor: '#67C090',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>محتوى</Text>
            </View>
          </View>
          <Text style={{
            fontSize: 17,
            fontWeight: '600',
            color: '#1f2937',
            textAlign: 'right',
            lineHeight: 28,
            writingDirection: 'rtl',
          }}>
            يمكنك مشاهدة الفيديوهات، قراءة المقالات والتفاعل مع الأطباء الذين يمكنهم مساعدتك في التعامل مع أطفالك
          </Text>
        </View>

        {/* Third Card */}
        <View style={{
          backgroundColor: '#ffffff',
          padding: 26,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#e8f1f5',
          shadowColor: '#26667F',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 4,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 16,
          }}>
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#e8f1f5',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#26667F',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 3,
            }}>
              <MaterialCommunityIcons name="doctor" size={28} color="#26667F" />
            </View>
            <View style={{
              backgroundColor: '#26667F',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}>
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>استشارة</Text>
            </View>
          </View>
          <Text style={{
            fontSize: 17,
            fontWeight: '600',
            color: '#1f2937',
            textAlign: 'right',
            lineHeight: 28,
            writingDirection: 'rtl',
          }}>
            إذا شعرت أن لديك حالة خاصة، يمكنك إجراء مكالمة هاتفية مع متخصص (طبيب) لمساعدتك في مشاكلك
          </Text>
        </View>
      </View>

      {/* CTA Button with Gradient Effect */}
      <TouchableOpacity
        onPress={() => router.push('/(auth)/register')}
        style={{
          marginTop: 50,
          backgroundColor: '#28b79d',
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#28b79d',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 8,
        }}
        activeOpacity={0.85}
      >
        <View style={{
          paddingVertical: 20,
          paddingHorizontal: 32,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}>
          <Feather name="arrow-left" size={22} color="white" />
          <Text style={{ 
            color: 'white', 
            fontSize: 19, 
            fontWeight: '800',
            letterSpacing: 0.5,
          }}>
            ابدأ الآن
          </Text>
        </View>
      </TouchableOpacity>

      {/* Bottom Spacing */}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}