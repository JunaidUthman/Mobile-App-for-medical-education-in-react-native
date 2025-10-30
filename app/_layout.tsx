import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { getUser } from '../utils/storage';

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const checkUserLogin = async () => {
      const user = await getUser();
      if (user) {
        // User is logged in, redirect to appropriate tab group
        if (user.type === 'normal') {
          // Redirect to person tabs
          router.replace('/(tabs_person)/home');
        } else {
          // Redirect to doctor tabs
          router.replace('/(tabs_doctor)/dashboard');
        }
      }
      // If no user, stay on auth (registration)
    };

    checkUserLogin();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs_person)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs_doctor)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
