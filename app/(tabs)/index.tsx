import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      
      <TouchableOpacity 
        onPress={() => router.push('/(auth)/register')}
        style={{
          padding: 20, 
          backgroundColor: '#14b8a6', 
          borderRadius: 12,
          width: '80%',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          📝 تسجيل حساب جديد
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/home')}
        style={{
          padding: 20, 
          backgroundColor: '#0ea5e9', 
          borderRadius: 12,
          width: '80%',
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          🏠 الصفحة الرئيسية
        </Text>
      </TouchableOpacity>

    </View>
  );
}