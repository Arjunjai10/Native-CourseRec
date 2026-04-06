import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { courseAPI, userAPI } from './utils/api';
import Navbar from './components/Navbar';

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

        // Get user info from local storage (if available) to get the ID
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

        // Fetch full profile if we have an ID
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

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/home')}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const continueLearningCourses = courses.slice(0, 3);
  const exploreMoreCourses = courses.slice(3, 12);
  const displayRecommendations = recommendedCourses.length > 0 ? recommendedCourses : courses.slice(12, 18);

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome back, {user ? user.fullName.split(' ')[0] : 'learner'}! 👋</Text>
          <Text style={styles.heroSubtitle}>Continue your learning journey</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/recommendations')}
          >
            <Ionicons name="sparkles" size={32} color="#741ce9" />
            <Text style={styles.actionTitle}>AI Recommendations</Text>
            <Text style={styles.actionSubtitle}>Get personalized course suggestions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={32} color="#741ce9" />
            <Text style={styles.actionTitle}>My Profile</Text>
            <Text style={styles.actionSubtitle}>View your learning progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/courses')}>
            <Ionicons name="book" size={32} color="#741ce9" />
            <Text style={styles.actionTitle}>Browse Courses</Text>
            <Text style={styles.actionSubtitle}>Explore 700+ courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings" size={32} color="#741ce9" />
            <Text style={styles.actionTitle}>Settings</Text>
            <Text style={styles.actionSubtitle}>Manage your account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesList}>
            {continueLearningCourses.map((course, index) => (
              <TouchableOpacity
                key={course._id || course.id}
                style={styles.courseCard}
                onPress={() => router.push(`/course/${course._id || course.id}`)}
              >
                <View style={[styles.courseThumbnail, { backgroundColor: course.thumbnailColor || '#741ce9' }]}>
                  <Ionicons name={course.thumbnail || 'book'} size={48} color="white" />
                </View>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseInstructor}>by {course.instructor?.name || course.instructor}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${[60, 35, 85][index % 3]}%` }]} />
                </View>
                <Text style={styles.progressText}>{[60, 35, 85][index % 3]}% Complete</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore More Courses</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesList}>
            {exploreMoreCourses.map((course) => (
              <TouchableOpacity
                key={course._id || course.id}
                style={styles.courseCard}
                onPress={() => router.push(`/course/${course._id || course.id}`)}
              >
                <View style={[styles.courseThumbnail, { backgroundColor: course.thumbnailColor || '#741ce9' }]}>
                  <Ionicons name={course.thumbnail || 'book'} size={48} color="white" />
                </View>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseInstructor}>by {course.instructor?.name || course.instructor}</Text>
                <View style={styles.courseRating}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.ratingText}>{course.rating}</Text>
                  <Text style={styles.studentsText}>({((course.studentsEnrolled || 0) / 1000).toFixed(0)}k students)</Text>
                </View>
                <Text style={styles.priceText}>{course.price === 0 ? 'Free' : `$${course.price}`}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          {user ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesList}>
              {displayRecommendations.map((course) => (
                <TouchableOpacity
                  key={course._id || course.id}
                  style={styles.courseCard}
                  onPress={() => router.push(`/course/${course._id || course.id}`)}
                >
                  <View style={[styles.courseThumbnail, { backgroundColor: course.thumbnailColor || '#741ce9' }]}>
                    <Ionicons name={course.thumbnail || 'sparkles'} size={48} color="white" />
                  </View>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseInstructor}>by {course.instructor?.name || course.instructor}</Text>
                  <View style={styles.courseRating}>
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text style={styles.ratingText}>{course.rating}</Text>
                    <Text style={styles.studentsText}>({((course.studentsEnrolled || 0) / 1000).toFixed(0)}k students)</Text>
                  </View>
                  <Text style={styles.priceText}>{course.price === 0 ? 'Free' : `$${course.price}`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity
              style={styles.bigCard}
              onPress={() => router.push('/recommendations')}
            >
              <Ionicons name="sparkles" size={48} color="#741ce9" />
              <Text style={styles.bigCardTitle}>Try AI Course Assistant</Text>
              <Text style={styles.bigCardText}>
                Get personalized path advice, course suggestions, and more.
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  hero: {
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  coursesList: {
    flexDirection: 'row',
  },
  courseCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseThumbnail: {
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#741ce9',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
    marginRight: 4,
  },
  studentsText: {
    fontSize: 12,
    color: '#666',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#741ce9',
  },
  bigCard: {
    backgroundColor: '#f3ebff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#741ce933',
  },
  bigCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  bigCardText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#741ce9',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});
