import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { courseAPI, userAPI } from './utils/api';
import Navbar from './components/Navbar';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home() {
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let userId = null;
        let storedUser = null;
        if (Platform.OS === 'web') {
          const userStr = localStorage.getItem('user');
          if (!userStr) {
            router.replace('/signin');
            return;
          }
          storedUser = JSON.parse(userStr);
          userId = storedUser.id || storedUser._id;
          setUser(storedUser);
        }

        const [coursesRes, recommendationsRes] = await Promise.all([
          courseAPI.getAll(),
          userId ? courseAPI.getRecommendations(userId) : Promise.resolve({ data: [] })
        ]);

        setCourses(coursesRes.data);
        setRecommendedCourses(recommendationsRes.data);

        if (userId) {
          const profileRes = await userAPI.getProfile(userId);
          setUser(profileRes.data);
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#741ce9" />
      </View>
    );
  }

  const continueLearningCourses = courses.slice(0, 3);
  const exploreMoreCourses = courses.slice(3, 12);
  
  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.heroSection}>
          <LinearGradient
            colors={['#741ce9', '#9d50bb']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroBadge}>Welcome Back 👋</Text>
              <Text style={styles.heroTitle}>Master Your{'\n'}Future Today.</Text>
              <Text style={styles.heroSubtitle}>
                {user ? user.fullName.split(' ')[0] : 'Learner'}, we've found 3 new courses that match your career profile perfectly!
              </Text>
              <TouchableOpacity 
                style={styles.heroButton}
                onPress={() => router.push('/courses')}
              >
                <Text style={styles.heroButtonText}>Continue My Learning</Text>
                <Ionicons name="arrow-forward" size={18} color="#741ce9" />
              </TouchableOpacity>
            </View>
            <View style={styles.heroDecoration}>
               <Ionicons name="rocket" size={120} color="rgba(255,255,255,0.15)" />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.quickActionGrid}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/recommendations')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#f3ebff' }]}>
              <Ionicons name="sparkles" size={24} color="#741ce9" />
            </View>
            <Text style={styles.actionLabel}>AI Mentors</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/courses')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#e6fffa' }]}>
              <Ionicons name="compass" size={24} color="#38b2ac" />
            </View>
            <Text style={styles.actionLabel}>Explore</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/profile')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fff5f5' }]}>
              <Ionicons name="trophy" size={24} color="#e53e3e" />
            </View>
            <Text style={styles.actionLabel}>Goals</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => router.push('/settings')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#f0f4f8' }]}>
              <Ionicons name="settings" size={24} color="#2d3748" />
            </View>
            <Text style={styles.actionLabel}>Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top AI Recommendations</Text>
            <TouchableOpacity onPress={() => router.push('/recommendations')}>
              <Text style={styles.viewAll}>Personalize</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
            {continueLearningCourses.map((course) => (
              <TouchableOpacity 
                key={course._id || course.id}
                style={styles.wideCard}
                onPress={() => router.push(`/course/${course._id || course.id}`)}
              >
                <View style={[styles.wideCardThumbnail, { backgroundColor: course.thumbnailColor || '#741ce9' }]}>
                   <Ionicons name={course.thumbnail || 'sparkles'} size={40} color="#fff" />
                   <View style={styles.cardBookmark}>
                      <Ionicons name="bookmark-outline" size={12} color="#1a1a1a" />
                   </View>
                </View>
                <View style={styles.wideCardContent}>
                   <Text style={styles.wideCardCategory}>{course.category || 'Career Growth'}</Text>
                   <Text style={styles.wideCardTitle} numberOfLines={1}>{course.title}</Text>
                   <View style={styles.recommendationBadge}>
                      <Ionicons name="shield-checkmark" size={12} color="#741ce9" />
                      <Text style={styles.recommendationText}>Highly Recommended</Text>
                   </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.section, { marginTop: 40 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore Recommendations</Text>
            <TouchableOpacity onPress={() => router.push('/courses')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.courseGrid}>
            {exploreMoreCourses.map((course) => (
              <TouchableOpacity 
                key={course._id || course.id}
                style={styles.verticalCard}
                onPress={() => router.push(`/course/${course._id || course.id}`)}
              >
                <View style={[styles.verticalThumbnail, { backgroundColor: course.thumbnailColor || '#741ce9' }]}>
                   <Ionicons name={course.thumbnail || 'book'} size={32} color="#fff" />
                   <View style={styles.cardBookmark}>
                      <Ionicons name="bookmark-outline" size={12} color="#1a1a1a" />
                   </View>
                </View>
                <View style={styles.verticalContent}>
                   <Text style={styles.verticalTitle} numberOfLines={2}>{course.title}</Text>
                   <Text style={styles.verticalInstructor}>{course.instructor?.name || 'EduLearn Pro'}</Text>
                   <View style={styles.verticalFooter}>
                      <View style={styles.ratingBox}>
                         <Ionicons name="star" size={14} color="#F59E0B" />
                         <Text style={styles.ratingText}>{course.rating || '4.8'}</Text>
                      </View>
                      <Text style={styles.studentCount}>{(0.4).toFixed(1)}k+ learners</Text>
                   </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 25,
    paddingTop: 10,
    marginBottom: 35,
  },
  heroGradient: {
    borderRadius: 32,
    padding: 35,
    height: 280,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
       web: {
          boxShadow: '0 20px 40px rgba(116, 28, 233, 0.15)',
       }
    })
  },
  heroTextContainer: {
    flex: 1,
    zIndex: 2,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 48,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 12,
    lineHeight: 22,
    maxWidth: '80%',
  },
  heroButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#741ce9',
    fontWeight: 'bold',
    marginRight: 8,
  },
  heroDecoration: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    zIndex: 1,
  },
  quickActionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginBottom: 40,
  },
  actionItem: {
    alignItems: 'center',
    width: '22%',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    ...Platform.select({
      web: {
        transition: 'transform 0.2s',
      }
    })
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  section: {
    paddingHorizontal: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#741ce9',
  },
  horizontalList: {
    paddingBottom: 10,
  },
  wideCard: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    ...Platform.select({
       web: {
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
       }
    })
  },
  wideCardThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  cardBookmark: {
     position: 'absolute',
     top: 5,
     left: 5,
     backgroundColor: 'rgba(255, 255, 255, 0.8)',
     width: 22,
     height: 22,
     borderRadius: 11,
     justifyContent: 'center',
     alignItems: 'center',
  },
  wideCardContent: {
    flex: 1,
  },
  wideCardCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#741ce9',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  wideCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 10,
  },
  recommendationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  recommendationText: {
    fontSize: 12,
    color: '#741ce9',
    fontWeight: '700',
  },
  courseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  verticalCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  verticalThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  verticalContent: {
    paddingHorizontal: 4,
  },
  verticalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 20,
    height: 40,
  },
  verticalInstructor: {
    fontSize: 12,
    color: '#64748b',
    marginVertical: 6,
  },
  verticalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9a3412',
    marginLeft: 3,
  },
  studentCount: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  }
});
