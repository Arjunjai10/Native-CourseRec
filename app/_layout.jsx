import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const token = localStorage.getItem('token');
      const rootPath = segments[0];
      
      // Define public routes
      const publicRoutes = ['signin', 'signup', 'index', undefined];
      const isPublicRoute = publicRoutes.includes(rootPath);

      if (!token && !isPublicRoute) {
        // Not logged in and trying to access a protected route
        router.replace('/signin');
      } else if (token && (rootPath === 'signin' || rootPath === 'signup')) {
        // Logged in and trying to access signin/signup
        router.replace('/home');
      }
    }
  }, [segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="home" />
      <Stack.Screen name="courses" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="recommendations" />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="admin" />
    </Stack>
  );
}
