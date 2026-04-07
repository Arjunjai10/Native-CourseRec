import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Delay navigation slightly to ensure the root layout is mounted
    const timeout = setTimeout(() => {
      if (Platform.OS === 'web') {
        const token = localStorage.getItem('token');
        if (token) {
          router.replace('/home');
        } else {
          router.replace('/signin');
        }
      } else {
        // Default behavior for native
        router.replace('/signin');
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [router]);

  return null;
}
