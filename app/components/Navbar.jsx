import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// ─── Peaceful Theme Token ───────────────────────────────────────────────────
const T = {
  primary:   '#7C3AED',
  primaryBg: '#F5F3FF',
  accent:    '#3B82F6',
  bg:        '#F8FAFC',
  card:      '#FFFFFF',
  border:    '#E2E8F0',
  text:      '#1E293B',
  muted:     '#64748B',
  red:       '#EF4444',
  redBg:     '#FEF2F2',
};

export default function Navbar({ showBackButton = false }) {
  const router   = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.replace('/signin');
  };

  const navItems = [
    { name: 'Dashboard', path: '/home',            icon: 'grid-outline' },
    { name: 'Courses',   path: '/courses',          icon: 'book-outline' },
    { name: 'Mentors',   path: '/recommendations',  icon: 'sparkles-outline' },
    { name: 'Profile',   path: '/profile',          icon: 'person-outline' },
  ];

  return (
    <View style={styles.outerContainer}>
      <View style={styles.header}>

        {/* Left – Logo */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={18} color={T.muted} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.logoContainer} onPress={() => router.push('/home')} activeOpacity={0.8}>
            <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.logoIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Ionicons name="school" size={16} color="#fff" />
            </LinearGradient>
            <Text style={styles.logoText}>EduLearn</Text>
          </TouchableOpacity>
        </View>

        {/* Center – Nav Links */}
        <View style={styles.navLinks}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => router.push(item.path)}
                style={[styles.navLink, isActive && styles.activeNavLink]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isActive ? item.icon.replace('-outline', '') : item.icon}
                  size={15}
                  color={isActive ? T.primary : T.muted}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.navLinkText, isActive && styles.activeNavLinkText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Right – Actions */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={17} color={T.muted} />
          </TouchableOpacity>

          <View style={styles.vDivider} />

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={15} color={T.red} />
            <Text style={styles.signOutText}>Exit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')} activeOpacity={0.8}>
            {Platform.OS === 'web' && (() => {
              const userStr = localStorage.getItem('user');
              if (userStr) {
                const u = JSON.parse(userStr);
                if (u.profilePicture) {
                  return <Image source={{ uri: u.profilePicture }} style={{ width: '100%', height: '100%' }} />;
                }
              }
              return (
                <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.avatarInner} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Ionicons name="person" size={13} color="#fff" />
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    zIndex: 1000,
    backgroundColor: T.bg,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    maxWidth: 1100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: T.card,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: T.border,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 24px rgba(124, 58, 237, 0.08)',
        backdropFilter: 'blur(12px)',
      },
      ios:     { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 16 },
      android: { elevation: 6 },
    }),
  },
  leftSection:    { flexDirection: 'row', alignItems: 'center' },
  backButton: {
    marginRight: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: T.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  logoContainer:  { flexDirection: 'row', alignItems: 'center' },
  logoIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  logoText: { fontSize: 17, fontWeight: '800', color: T.text, letterSpacing: -0.5 },

  navLinks: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: T.bg, padding: 3, borderRadius: 100,
  },
  navLink: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
  },
  activeNavLink: {
    backgroundColor: T.primaryBg,
    ...Platform.select({ web: { boxShadow: '0 0 12px rgba(124, 58, 237, 0.12)' } }),
  },
  navLinkText:       { fontSize: 13, fontWeight: '600', color: T.muted },
  activeNavLinkText: { color: T.primary },

  headerRight:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconButton: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: T.border,
  },
  vDivider: { width: 1, height: 18, backgroundColor: T.border, marginHorizontal: 2 },
  signOutButton: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
    backgroundColor: T.redBg,
    borderWidth: 1, borderColor: '#FECACA',
  },
  signOutText: { color: T.red, fontSize: 12, fontWeight: '700' },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    overflow: 'hidden', borderWidth: 2, borderColor: T.border,
  },
  avatarInner: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
});
