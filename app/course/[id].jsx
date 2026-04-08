import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { courseAPI, userAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import { LinearGradient } from 'expo-linear-gradient';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(0);

  useEffect(() => {
    courseAPI.getById(id)
      .then(res => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const handleGoToCourse = async () => {
     if (course?.externalLink) {
        Linking.openURL(course.externalLink);
     } else {
        // Fallback or alert
        Linking.openURL('https://www.youtube.com');
     }
  };

  return (
    <View style={styles.container}>
      <Navbar showBackButton={true} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
           <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.heroGradient}>
              <View style={styles.heroContent}>
                  <View style={styles.categoryBadgeRow}>
                    <Ionicons name="ribbon" size={14} color="#7C3AED" />
                    <Text style={styles.categoryBadge}>{course.category || 'Professional Recommendation'}</Text>
                  </View>
                 <Text style={styles.titleText}>{course.title}</Text>
                 <Text style={styles.descText}>{course.description}</Text>
                 
                 <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                       <Ionicons name="star" size={16} color="#F59E0B" />
                       <Text style={styles.metaText}>{course.rating} Rating</Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                       <Ionicons name="people" size={16} color="#94a3b8" />
                       <Text style={styles.metaText}>{course.studentsEnrolled || '0.5'}k Students</Text>
                    </View>
                 </View>

                 <View style={styles.instructorPod}>
                    <View style={styles.instructorAvatar}>
                       <Ionicons name="person" size={20} color="#fff" />
                    </View>
                    <Text style={styles.instructorName}>Content by {course.instructor?.name || 'EduLearn Pro'}</Text>
                 </View>
              </View>
           </LinearGradient>
        </View>

        <View style={styles.mainGrid}>
           <View style={styles.leftCol}>
              <View style={styles.syllabusHeader}>
                 <Text style={styles.sectionTitle}>Course Curriculum</Text>
                 <Text style={styles.syllabusStats}>Full module breakdown and lesson structure</Text>
              </View>

              <View style={styles.modulesContainer}>
                 {course.syllabus?.map((module, i) => (
                    <View key={i} style={styles.moduleCard}>
                       <TouchableOpacity 
                         style={[styles.moduleHeader, expandedModule === i && styles.moduleHeaderActive]}
                         onPress={() => setExpandedModule(expandedModule === i ? -1 : i)}
                       >
                          <View style={styles.moduleHeadLeft}>
                             <Ionicons name={expandedModule === i ? "remove-circle-outline" : "add-circle-outline"} size={22} color="#7C3AED" />
                             <View>
                                <Text style={styles.moduleTitle}>{module.moduleName || `Module ${i+1}`}</Text>
                                <Text style={styles.moduleMeta}>{module.topics?.length || 4} topics included</Text>
                             </View>
                          </View>
                       </TouchableOpacity>
                       
                       {expandedModule === i && (
                          <View style={styles.topicsArea}>
                             {(module.topics || [1,2,3]).map((topic, tIndex) => (
                                <View key={tIndex} style={styles.topicRow}>
                                   <View style={styles.topicLeft}>
                                      <Ionicons name="play-circle" size={18} color="#94a3b8" />
                                      <Text style={styles.topicTitle}>{topic.title || `Topic ${tIndex + 1}`}</Text>
                                   </View>
                                   <Text style={styles.topicTime}>Available</Text>
                                </View>
                             ))}
                          </View>
                       )}
                    </View>
                 ))}
              </View>
           </View>

           <View style={styles.rightCol}>
              <View style={styles.recommendationCard}>
                 <View style={styles.previewBox}>
                    <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.previewPlaceholder}>
                       <Ionicons name="film-outline" size={48} color="#fff" />
                    </LinearGradient>
                 </View>
                 <View style={styles.actionArea}>
                    <Text style={styles.recTitle}>Platform Recommendation</Text>
                    <Text style={styles.recDesc}>
                       Our AI system has selected this course based on your current skill gaps and professional aspirations.
                    </Text>

                    <TouchableOpacity style={styles.visitBtn} onPress={handleGoToCourse}>
                       <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.visitGradient}>
                          <Text style={styles.visitText}>View Course on Source</Text>
                          <Ionicons name="open-outline" size={18} color="#fff" />
                       </LinearGradient>
                    </TouchableOpacity>
                    
                    <Text style={styles.disclaimerText}>
                       You will be redirected to the official platform to view the full content.
                    </Text>

                    <View style={styles.featuresList}>
                       <View style={styles.featureItem}>
                          <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                          <Text style={styles.featureText}>Verified Content</Text>
                       </View>
                       <View style={styles.featureItem}>
                          <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                          <Text style={styles.featureText}>AI Recommended</Text>
                       </View>
                       <View style={styles.featureItem}>
                          <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                          <Text style={styles.featureText}>Full Syllabus Available</Text>
                       </View>
                    </View>
                 </View>
              </View>
           </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    backgroundColor: '#F8FAFC',
  },
  heroGradient: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: Platform.OS === 'web' ? 50 : 25,
  },
  heroContent: {
    maxWidth: 800,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '900',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  titleText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 56,
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  descText: {
    fontSize: 18,
    color: '#cbd5e1',
    lineHeight: 28,
    marginBottom: 30,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#334155',
    marginHorizontal: 15,
  },
  instructorPod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructorName: {
     fontSize: 14,
     fontWeight: '800',
     color: '#fff',
  },
  mainGrid: {
     flexDirection: Platform.OS === 'web' ? 'row' : 'column-reverse',
     padding: Platform.OS === 'web' ? 50 : 20,
     gap: Platform.OS === 'web' ? 50 : 20,
  },
  leftCol: {
     flex: 1,
  },
  rightCol: {
     width: Platform.OS === 'web' ? 380 : '100%',
  },
  sectionTitle: {
     fontSize: 24,
     fontWeight: '900',
     color: '#1e293b',
     letterSpacing: -0.5,
  },
  syllabusHeader: {
     marginBottom: 30,
  },
  syllabusStats: {
     fontSize: 14,
     color: '#64748b',
     marginTop: 6,
     fontWeight: '700',
  },
  modulesContainer: {
     gap: 15,
  },
  moduleCard: {
     borderWidth: 1,
     borderColor: '#f1f5f9',
     borderRadius: 24,
     overflow: 'hidden',
     backgroundColor: '#fff',
  },
  moduleHeader: {
     padding: 24,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
  },
  moduleHeaderActive: {
     backgroundColor: '#f8fafc',
  },
  moduleHeadLeft: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 15,
  },
  moduleTitle: {
     fontSize: 16,
     fontWeight: '800',
     color: '#1e293b',
  },
  moduleMeta: {
     fontSize: 12,
     color: '#94a3b8',
     marginTop: 2,
     fontWeight: '600',
  },
  topicsArea: {
     padding: 24,
     paddingTop: 0,
     backgroundColor: '#f8fafc',
  },
  topicRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingVertical: 12,
     borderTopWidth: 1,
     borderTopColor: '#eef2f6',
  },
  topicLeft: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 12,
  },
  topicTitle: {
     fontSize: 14,
     fontWeight: '700',
     color: '#475569',
  },
  topicTime: {
     fontSize: 12,
     fontWeight: '700',
     color: '#10b981',
  },
  recommendationCard: {
     backgroundColor: '#fff',
     borderRadius: 32,
     overflow: 'hidden',
     ...Platform.select({
       ios: {
         shadowColor: '#000',
         shadowOpacity: 0.1,
         shadowRadius: 30,
         shadowOffset: { width: 0, height: 10 },
       },
       android: {
         elevation: 20,
       },
       web: {
         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
         position: 'sticky',
         top: 100,
       }
     }),
  },
  previewBox: {
     width: '100%',
     height: 200,
  },
  previewPlaceholder: {
     width: '100%',
     height: '100%',
     justifyContent: 'center',
     alignItems: 'center',
  },
  actionArea: {
     padding: 30,
  },
  recTitle: {
     fontSize: 18,
     fontWeight: '900',
     color: '#1e293b',
     marginBottom: 10,
  },
  recDesc: {
     fontSize: 13,
     color: '#64748b',
     lineHeight: 20,
     fontWeight: '500',
     marginBottom: 25,
  },
  visitBtn: {
     marginBottom: 20,
  },
  visitGradient: {
     paddingVertical: 18,
     borderRadius: 20,
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     gap: 10,
  },
  visitText: {
     color: '#fff',
     fontSize: 15,
     fontWeight: '900',
  },
  disclaimerText: {
     fontSize: 11,
     color: '#94a3b8',
     textAlign: 'center',
     fontWeight: '600',
     marginBottom: 25,
     fontStyle: 'italic',
  },
  featuresList: {
     gap: 12,
     paddingTop: 15,
     borderTopWidth: 1,
     borderTopColor: '#f1f5f9',
  },
  featureItem: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 12,
  },
  featureText: {
     fontSize: 13,
     fontWeight: '700',
     color: '#475569',
  }
});
