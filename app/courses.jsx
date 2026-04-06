import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { courseAPI } from './utils/api';
import Navbar from './components/Navbar';
import { LinearGradient } from 'expo-linear-gradient';

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Personal Growth'];

  useEffect(() => {
    courseAPI.getAll()
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory || (selectedCategory === 'Programming' && course.category?.includes('Web'));
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#741ce9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.headerArea}>
         <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search for any course, skill, or mentor..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
         </View>
         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
            {categories.map(cat => (
               <TouchableOpacity 
                  key={cat} 
                  style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
                  onPress={() => setSelectedCategory(cat)}
               >
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
               </TouchableOpacity>
            ))}
         </ScrollView>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ padding: 25, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
           <Text style={styles.resultsTitle}>
              {searchQuery ? `Searching for "${searchQuery}"` : `${selectedCategory} Courses`}
           </Text>
           <Text style={styles.resultsCount}>{filteredCourses.length} results found</Text>
        </View>

        <View style={styles.courseGrid}>
           {filteredCourses.length > 0 ? (
             filteredCourses.map(course => (
                <TouchableOpacity 
                   key={course._id || course.id}
                   style={styles.courseCard}
                   onPress={() => router.push(`/course/${course._id || course.id}`)}
                >
                   <View style={[styles.courseThumbnail, { backgroundColor: course.thumbnailColor || '#741ce9' }]}>
                      <Ionicons name={course.thumbnail || 'book'} size={32} color="#fff" />
                      <TouchableOpacity style={styles.bookmarkBadge}>
                         <Ionicons name="bookmark-outline" size={14} color="#1a1a1a" />
                      </TouchableOpacity>
                      <View style={styles.badge}>
                         <Text style={styles.badgeText}>{course.level || 'Beginner'}</Text>
                      </View>
                   </View>
                   <View style={styles.courseInfo}>
                      <Text style={styles.courseCategory}>{course.category || 'Programming'}</Text>
                      <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
                      <View style={styles.instructorRow}>
                         <View style={styles.instructorIcon}>
                            <Ionicons name="person" size={14} color="#64748b" />
                         </View>
                         <Text style={styles.instructorName}>{course.instructor?.name || 'EduLearn Pro'}</Text>
                      </View>
                      <View style={styles.footerRow}>
                         <View style={styles.ratingBox}>
                            <Ionicons name="star" size={12} color="#F59E0B" />
                            <Text style={styles.ratingText}>{course.rating || '4.8'}</Text>
                         </View>
                         <View style={styles.detailsIndicator}>
                            <Text style={styles.detailsText}>View Recommendation</Text>
                            <Ionicons name="arrow-forward" size={12} color="#741ce9" />
                         </View>
                      </View>
                   </View>
                </TouchableOpacity>
             ))
           ) : (
             <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color="#e2e8f0" />
                <Text style={styles.emptyTitle}>No courses found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting your search or filters to find what you're looking for.</Text>
             </View>
           )}
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
  headerArea: {
     paddingTop: 10,
     paddingHorizontal: 25,
     backgroundColor: '#f8fafc',
  },
  searchBox: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#fff',
     paddingHorizontal: 20,
     paddingVertical: 14,
     borderRadius: 24,
     borderWidth: 1,
     borderColor: '#e2e8f0',
     marginBottom: 20,
     ...Platform.select({
        web: {
           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
           outlineStyle: 'none',
        }
     })
  },
  searchInput: {
     flex: 1,
     marginLeft: 12,
     fontSize: 15,
     fontWeight: '500',
     color: '#1e293b',
  },
  categoryList: {
     flexDirection: 'row',
     marginBottom: 10,
  },
  categoryPill: {
     paddingHorizontal: 18,
     paddingVertical: 10,
     borderRadius: 14,
     backgroundColor: '#fff',
     marginRight: 10,
     borderWidth: 1,
     borderColor: '#e2e8f0',
  },
  categoryPillActive: {
     backgroundColor: '#0a0a0a',
     borderColor: '#0a0a0a',
  },
  categoryText: {
     fontSize: 14,
     fontWeight: '600',
     color: '#64748b',
  },
  categoryTextActive: {
     color: '#fff',
  },
  content: {
     flex: 1,
  },
  sectionHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'flex-end',
     marginBottom: 20,
     paddingHorizontal: 4,
  },
  resultsTitle: {
     fontSize: 24,
     fontWeight: '800',
     color: '#1e293b',
     letterSpacing: -0.5,
  },
  resultsCount: {
     fontSize: 14,
     fontWeight: '600',
     color: '#94a3b8',
  },
  courseGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'space-between',
  },
  courseCard: {
     width: '48%',
     backgroundColor: '#fff',
     borderRadius: 28,
     padding: 10,
     marginBottom: 24,
     borderWidth: 1,
     borderColor: '#f1f5f9',
     ...Platform.select({
        web: {
           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.04)',
        }
     })
  },
  courseThumbnail: {
     width: '100%',
     height: 140,
     borderRadius: 22,
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 12,
     position: 'relative',
  },
  badge: {
     position: 'absolute',
     top: 10,
     right: 10,
     backgroundColor: 'rgba(255, 255, 255, 0.9)',
     paddingHorizontal: 8,
     paddingVertical: 4,
     borderRadius: 8,
  },
  bookmarkBadge: {
     position: 'absolute',
     top: 10,
     left: 10,
     backgroundColor: 'rgba(255, 255, 255, 0.8)',
     width: 28,
     height: 28,
     borderRadius: 14,
     justifyContent: 'center',
     alignItems: 'center',
  },
  badgeText: {
     fontSize: 10,
     fontWeight: '900',
     color: '#1e293b',
  },
  courseInfo: {
     paddingHorizontal: 6,
  },
  courseCategory: {
     fontSize: 10,
     fontWeight: 'bold',
     color: '#741ce9',
     textTransform: 'uppercase',
     marginBottom: 4,
  },
  courseTitle: {
     fontSize: 15,
     fontWeight: '800',
     color: '#1e293b',
     lineHeight: 20,
     height: 40,
  },
  instructorRow: {
     flexDirection: 'row',
     alignItems: 'center',
     marginTop: 8,
     marginBottom: 12,
  },
  instructorName: {
     fontSize: 12,
     fontWeight: '600',
     color: '#64748b',
     marginLeft: 6,
  },
  footerRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingTop: 10,
     borderTopWidth: 1,
     borderTopColor: '#f8fafc',
  },
  ratingBox: {
     flexDirection: 'row',
     alignItems: 'center',
  },
  ratingText: {
     fontSize: 12,
     fontWeight: 'bold',
     color: '#1e293b',
     marginLeft: 4,
  },
  detailsIndicator: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 6,
  },
  detailsText: {
     fontSize: 11,
     fontWeight: '800',
     color: '#741ce9',
     textTransform: 'uppercase',
  },
  emptyState: {
     width: '100%',
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 100,
  },
  emptyTitle: {
     fontSize: 20,
     fontWeight: '800',
     color: '#1e293b',
     marginTop: 15,
  },
  emptySubtitle: {
     fontSize: 14,
     color: '#94a3b8',
     textAlign: 'center',
     marginTop: 8,
     paddingHorizontal: 40,
  }
});
