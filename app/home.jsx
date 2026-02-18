import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={28} color="#7C3AED" />
          <Text style={styles.logoText}>EduLearn</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Search courses...</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => router.push('/home')}>
            <Text style={[styles.navLink, styles.activeNavLink]}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navLink}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navLink}>Mentors</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Text style={styles.navLink}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome back! 👋</Text>
          <Text style={styles.heroSubtitle}>Continue your learning journey</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/recommendations')}
          >
            <Ionicons name="sparkles" size={32} color="#7C3AED" />
            <Text style={styles.actionTitle}>AI Recommendations</Text>
            <Text style={styles.actionSubtitle}>Get personalized course suggestions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={32} color="#7C3AED" />
            <Text style={styles.actionTitle}>My Profile</Text>
            <Text style={styles.actionSubtitle}>View your learning progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="book" size={32} color="#7C3AED" />
            <Text style={styles.actionTitle}>Browse Courses</Text>
            <Text style={styles.actionSubtitle}>Explore 5000+ courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings" size={32} color="#7C3AED" />
            <Text style={styles.actionTitle}>Settings</Text>
            <Text style={styles.actionSubtitle}>Manage your account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesList}>
            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => router.push('/course/1')}
            >
              <View style={styles.courseThumbnail}>
                <Ionicons name="code-slash" size={48} color="white" />
              </View>
              <Text style={styles.courseTitle}>Python for Beginners</Text>
              <Text style={styles.courseInstructor}>by John Doe</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
              <Text style={styles.progressText}>60% Complete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => router.push('/course/2')}
            >
              <View style={[styles.courseThumbnail, { backgroundColor: '#10b981' }]}>
                <Ionicons name="analytics" size={48} color="white" />
              </View>
              <Text style={styles.courseTitle}>Data Science Fundamentals</Text>
              <Text style={styles.courseInstructor}>by Jane Smith</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '35%' }]} />
              </View>
              <Text style={styles.progressText}>35% Complete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.courseCard}
              onPress={() => router.push('/course/3')}
            >
              <View style={[styles.courseThumbnail, { backgroundColor: '#f59e0b' }]}>
                <Ionicons name="color-palette" size={48} color="white" />
              </View>
              <Text style={styles.courseTitle}>UI/UX Design Masterclass</Text>
              <Text style={styles.courseInstructor}>by Sarah Johnson</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '85%' }]} />
              </View>
              <Text style={styles.progressText}>85% Complete</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity
            style={styles.bigCard}
            onPress={() => router.push('/recommendations')}
          >
            <Ionicons name="sparkles" size={48} color="#7C3AED" />
            <Text style={styles.bigCardTitle}>Try AI Course Assistant</Text>
            <Text style={styles.bigCardText}>
              Get personalized course recommendations based on your interests and learning goals
            </Text>
            <View style={styles.bigCardButton}>
              <Text style={styles.bigCardButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 24,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    maxWidth: 400,
    gap: 8,
  },
  searchPlaceholder: {
    color: '#999',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginLeft: 'auto',
  },
  navLink: {
    fontSize: 14,
    color: '#666',
  },
  activeNavLink: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  iconButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  hero: {
    padding: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 24,
    gap: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  coursesList: {
    flexDirection: 'row',
  },
  courseCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  courseThumbnail: {
    height: 140,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  bigCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  bigCardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  bigCardText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  bigCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  bigCardButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
