import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { courseAPI, userAPI } from '../utils/api';
import Navbar from '../components/Navbar';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [expandedModule, setExpandedModule] = useState(0);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#741ce9" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.container}>
        <Navbar showBackButton={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.logoText}>Course Not Found</Text>
        </View>
      </View>
    );
  }

  const handleGoToCourse = async () => {
    try {
      if (Platform.OS === 'web') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const u = JSON.parse(userStr);
          const userId = u.id || u._id;
          if (userId) {
            await userAPI.enroll(id);
          }
        }
      }

      const supported = await Linking.canOpenURL(course.externalLink || 'https://www.youtube.com');
      if (supported) {
        await Linking.openURL(course.externalLink || 'https://www.youtube.com');
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      console.error('Enrollment/Navigation error:', error);
      if (course.externalLink) {
        Linking.openURL(course.externalLink);
      }
    }
  };

  const ratingDistribution = [
    { stars: 5, percentage: 78 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 4 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ];

  const courseReviews = course.reviews && course.reviews.length > 0 ? course.reviews : [
    {
      id: 1,
      userName: 'Alex Johnson',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent course! The instructor explains complex concepts in a clear and easy-to-understand way. Highly recommended!',
    },
    {
      id: 2,
      userName: 'Sarah Mitchell',
      rating: 4,
      date: '1 month ago',
      comment: 'Great content and well-structured curriculum. Could use more hands-on projects, but overall very helpful.',
    },
  ];

  return (
    <View style={styles.container}>
      <Navbar showBackButton={true} />

      <ScrollView style={styles.content}>
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Home</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
          <Text style={styles.breadcrumbText}>{course.category || 'Category'}</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
          <Text style={styles.breadcrumbText}>{course.title ? course.title.substring(0, 20) : 'Course'}...</Text>
        </View>

        <View style={styles.mainSection}>
          <View style={styles.leftColumn}>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.description}>{course.description}</Text>
            
            <View style={styles.instructorSection}>
              <View style={styles.instructorAvatar}>
                <Ionicons name="person" size={24} color="#741ce9" />
              </View>
              <View>
                <Text style={styles.instructorLabel}>Created by</Text>
                <Text style={styles.instructorName}>{course.instructor?.name || course.instructor}</Text>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text style={styles.detailText}>{course.rating} Rating</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people" size={18} color="#666" />
                <Text style={styles.detailText}>{course.studentsEnrolled || 0} students</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={18} color="#666" />
                <Text style={styles.detailText}>{course.duration?.hours ? `${course.duration.hours}h ${course.duration.minutes}m` : course.duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="language" size={18} color="#666" />
                <Text style={styles.detailText}>English</Text>
              </View>
            </View>

            <View style={styles.tabs}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={[styles.tabText, styles.activeTabText]}>Syllabus</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Instructors</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.syllabusContainer}>
              {course.syllabus ? course.syllabus.map((module, index) => (
                <View key={index} style={styles.moduleItem}>
                  <TouchableOpacity 
                    style={styles.moduleHeader}
                    onPress={() => setExpandedModule(expandedModule === index ? -1 : index)}
                  >
                    <View style={styles.moduleHeaderLeft}>
                      <Ionicons 
                        name={expandedModule === index ? "chevron-down" : "chevron-forward"} 
                        size={20} 
                        color="#333" 
                      />
                      <Text style={styles.moduleTitle}>Module {index + 1}: {module.moduleName || module.title}</Text>
                    </View>
                    <Text style={styles.moduleDuration}>{module.topics?.length || 0} topics</Text>
                  </TouchableOpacity>
                  
                  {expandedModule === index && (
                    <View style={styles.topicsContainer}>
                      {module.topics?.map((topic, tIndex) => (
                        <View key={tIndex} style={styles.topicItem}>
                          <View style={styles.topicLeft}>
                            <Ionicons 
                              name={topic.contentType === 'video' ? "play-circle" : "document-text"} 
                              size={20} 
                              color="#741ce9" 
                            />
                            <Text style={styles.topicTitle}>{topic.title}</Text>
                          </View>
                          <Text style={styles.topicDuration}>{topic.duration}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )) : <Text>No syllabus available for this course.</Text>}
            </View>

            <View style={styles.reviewsSection}>
              <Text style={styles.sectionTitle}>Student Reviews</Text>
              <View style={styles.reviewSummary}>
                <View style={styles.ratingBig}>
                  <Text style={styles.ratingBigValue}>{course.rating}</Text>
                  <View style={styles.starsRow}>
                    <Ionicons name="star" size={20} color="#F59E0B" />
                    <Ionicons name="star" size={20} color="#F59E0B" />
                    <Ionicons name="star" size={20} color="#F59E0B" />
                    <Ionicons name="star" size={20} color="#F59E0B" />
                    <Ionicons name="star-half" size={20} color="#F59E0B" />
                  </View>
                  <Text style={styles.ratingCount}>Course Rating</Text>
                </View>
                <View style={styles.ratingBars}>
                  {ratingDistribution.map((item) => (
                    <View key={item.stars} style={styles.ratingBarItem}>
                      <View style={styles.barContainer}>
                        <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
                      </View>
                      <View style={styles.barStars}>
                        {[...Array(item.stars)].map((_, i) => (
                          <Ionicons key={i} name="star" size={12} color="#F59E0B" />
                        ))}
                      </View>
                      <Text style={styles.barPercentage}>{item.percentage}%</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.reviewsList}>
                {courseReviews.map((review) => (
                  <View key={review.id} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewerAvatar}>
                        <Text style={styles.avatarText}>{review.userName[0]}</Text>
                      </View>
                      <View>
                        <Text style={styles.reviewerName}>{review.userName}</Text>
                        <View style={styles.reviewMeta}>
                          <View style={styles.starsSmall}>
                            {[...Array(review.rating)].map((_, i) => (
                              <Ionicons key={i} name="star" size={12} color="#F59E0B" />
                            ))}
                          </View>
                          <Text style={styles.reviewDate}>{review.date}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{review.comment}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.stickyCard}>
              <Image 
                source={{ uri: 'https://via.placeholder.com/400x225' }} 
                style={styles.previewImage}
              />
              <View style={styles.cardContent}>
                <View style={styles.priceRow}>
                  <Text style={styles.cardPrice}>{course.price === 0 ? 'Free' : `$${course.price}`}</Text>
                  <Text style={styles.originalPrice}>$94.99</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>85% OFF</Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.enrollButton} onPress={handleGoToCourse}>
                  <Text style={styles.enrollButtonText}>Enroll Now</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.wishlistButton}>
                  <Ionicons name="heart-outline" size={20} color="#333" />
                  <Text style={styles.wishlistText}>Add to Wishlist</Text>
                </TouchableOpacity>

                <View style={styles.featuresList}>
                  <Text style={styles.featuresTitle}>This course includes:</Text>
                  <View style={styles.featureItem}>
                    <Ionicons name="play-circle-outline" size={18} color="#666" />
                    <Text style={styles.featureText}>{course.duration?.hours ? `${course.duration.hours} hours` : course.duration} on-demand video</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="document-text-outline" size={18} color="#666" />
                    <Text style={styles.featureText}>{course.syllabus?.length || 0} modules</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="infinite-outline" size={18} color="#666" />
                    <Text style={styles.featureText}>Full lifetime access</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="phone-portrait-outline" size={18} color="#666" />
                    <Text style={styles.featureText}>Access on mobile and TV</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Ionicons name="ribbon-outline" size={18} color="#666" />
                    <Text style={styles.featureText}>Certificate of completion</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.shareLink}>
                  <Text style={styles.shareText}>Share this course</Text>
                </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  mainSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  leftColumn: {
    flex: 2,
    marginRight: 40,
  },
  rightColumn: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontSize: 18,
    color: '#444',
    lineHeight: 28,
    marginBottom: 24,
  },
  instructorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3ebff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructorLabel: {
    fontSize: 12,
    color: '#666',
  },
  instructorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#741ce9',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
    gap: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 32,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#741ce9',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#741ce9',
  },
  syllabusContainer: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  moduleItem: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  moduleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  moduleDuration: {
    fontSize: 14,
    color: '#666',
  },
  topicsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topicTitle: {
    fontSize: 14,
    color: '#444',
  },
  topicDuration: {
    fontSize: 12,
    color: '#999',
  },
  reviewsSection: {
    marginTop: 20,
  },
  reviewSummary: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  ratingBig: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 24,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    width: 140,
  },
  ratingBigValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  ratingCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  ratingBars: {
    flex: 1,
    paddingLeft: 24,
    justifyContent: 'center',
  },
  ratingBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginRight: 12,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  barStars: {
    flexDirection: 'row',
    width: 60,
    marginRight: 10,
  },
  barPercentage: {
    fontSize: 12,
    color: '#666',
    width: 30,
  },
  reviewsList: {
    gap: 24,
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 24,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#741ce9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsSmall: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  stickyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    ...Platform.select({
        web: {
            position: 'sticky',
            top: 100,
        }
    })
  },
  previewImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 24,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
  },
  enrollButton: {
    backgroundColor: '#741ce9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wishlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    gap: 8,
    marginBottom: 24,
  },
  wishlistText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
  },
  shareLink: {
    alignItems: 'center',
  },
  shareText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#741ce9',
    textDecorationLine: 'underline',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  }
});
