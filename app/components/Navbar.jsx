import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Navbar({ showBackButton = false }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.replace('/signin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/home', icon: 'grid-outline' },
    { name: 'Courses', path: '/courses', icon: 'book-outline' },
    { name: 'Mentors', path: '/recommendations', icon: 'sparkles-outline' },
    { name: 'Profile', path: '/profile', icon: 'person-outline' },
  ];

  return (
    <View style={styles.outerContainer}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.logoContainer} 
            onPress={() => router.push('/home')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#4f46e5', '#06b6d4']}
              style={styles.logoIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="school" size={18} color="#fff" />
            </LinearGradient>
            <Text style={styles.logoText}>EduLearn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navLinks}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => router.push(item.path)}
                style={[
                  styles.navLink,
                  isActive && styles.activeNavLink
                ]}
              >
                <Ionicons 
                  name={isActive ? item.icon.replace('-outline', '') : item.icon} 
                  size={16} 
                  color={isActive ? '#fff' : '#888'} 
                  style={styles.navIcon}
                />
                <Text style={[
                  styles.navLinkText,
                  isActive && styles.activeNavLinkText
                ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
            <Ionicons name="settings" size={18} color="#888" />
          </TouchableOpacity>
          
          <View style={styles.vDivider} />
          
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <View style={styles.signOutIconContainer}>
                <Ionicons name="log-out" size={16} color="#ff4d4d" />
            </View>
            <Text style={styles.signOutText}>Exit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.avatar} 
            onPress={() => router.push('/profile')}
          >
            {Platform.OS === 'web' && (() => {
              const userStr = localStorage.getItem('user');
              if (userStr) {
                 const u = JSON.parse(userStr);
                 if (u.profilePicture) {
                    return <Image source={{ uri: u.profilePicture }} style={{ width: '100%', height: '100%' }} />;
                 }
              }
              return (
                <LinearGradient
                  colors={['#1a1a1a', '#2a2a2a']}
                  style={styles.avatarInner}
                >
                  <Ionicons name="person" size={14} color="#741ce9" />
                </LinearGradient>
              );
            })()}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 25,
    marginBottom: 20,
    zIndex: 1000,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    maxWidth: 1100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0a0a0a',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(16px)',
      }
    }),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.8,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 2,
    borderRadius: 100,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
  },
  activeNavLink: {
    backgroundColor: '#2a2a2a',
    ...Platform.select({
      ios: {
        shadowColor: '#741ce9',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 0 10px rgba(79, 70, 229, 0.2)',
      }
    }),
  },
  navIcon: {
    marginRight: 6,
  },
  navLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  activeNavLinkText: {
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  vDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 3,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: '#1a1010',
    marginRight: 10,
  },
  signOutIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  signOutText: {
    color: '#ff4d4d',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
