import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function DoctorTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'لوحة التحكم',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'المواعيد',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-content"
        options={{
          title: 'إضافة محتوى',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rating"
        options={{
          title: 'التقييم',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="star.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}