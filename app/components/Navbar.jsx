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
              <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.logoContainer} 
            onPress={() => router.push('/home')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#741ce9', '#9d50bb']}
              style={styles.logoIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="school" size={20} color="#fff" />
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
                  name={item.icon} 
                  size={18} 
                  color={isActive ? '#741ce9' : '#555'} 
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
            <Ionicons name="settings" size={20} color="#555" />
          </TouchableOpacity>
          
          <View style={styles.vDivider} />
          
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <View style={styles.signOutIconContainer}>
                <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            </View>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.avatar} 
            onPress={() => router.push('/profile')}
          >
            <LinearGradient
              colors={['#f3ebff', '#eaddff']}
              style={styles.avatarInner}
            >
              <Ionicons name="person" size={16} color="#741ce9" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 15,
      }
    }),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 4,
    borderRadius: 16,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  activeNavLink: {
    backgroundColor: '#fff',
    ...Platform.select({
        web: {
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        },
        default: {
            elevation: 2,
        }
    })
  },
  navIcon: {
    marginRight: 6,
  },
  navLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeNavLinkText: {
    color: '#741ce9',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  vDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 4,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#fff1f1',
    marginRight: 12,
  },
  signOutIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  signOutText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '700',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#741ce9',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
