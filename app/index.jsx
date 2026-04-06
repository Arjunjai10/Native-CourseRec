import { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { Platform } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') {
      const token = localStorage.getItem('token');
      if (token) {
        router.replace('/home');
      } else {
        router.replace('/signin');
      }
    }
  }, []);

  return null;
}
