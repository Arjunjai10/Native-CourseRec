import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const COURSE_DATA = {
  title: 'Advanced Machine Learning with Python 2024',
  description: 'Master state-of-the-art ML architectures, from Transformer models to production-grade deployment pipelines using PyTorch and Scikit-Learn.',
  rating: 4.8,
  reviewsCount: 1245,
  studentsEnrolled: 12450,
  lastUpdated: 'May 2024',
  level: 'Intermediate',
  language: 'English',
  captions: 'Yes (8 languages)',
  lectures: 42,
  instructor: {
    name: 'Dr. Elena Vance',
    title: 'Senior ML Research Scientist at TechCorp Labs',
    avatar: 'https://via.placeholder.com/80',
    rating: 4.9,
    students: 45000,
    courses: 12,
    bio: 'Dr. Vance has over 15 years of experience in the field of AI and Machine Learning. She led the research team for autonomous navigation at TechCorp and is a frequent speaker at NeurIPS and ICML conferences.',
  },
  includes: [
    { icon: 'play-circle', text: '40 hours on-demand video' },
    { icon: 'document-text', text: '25 coding exercises' },
    { icon: 'download', text: '54 downloadable resources' },
    { icon: 'infinite', text: 'Full lifetime access' },
    { icon: 'phone-portrait', text: 'Access on mobile and TV' },
    { icon: 'ribbon', text: 'Certificate of completion' },
  ],
  syllabus: [
    {
      module: 'Module 1: Deep Learning Foundations',
      lectures: 4,
      duration: '3h 20m',
      expanded: true,
      topics: [
        { title: 'Introduction to PyTorch Tensors', duration: '15:09', type: 'video' },
        { title: 'Backpropagation and Autograd', duration: '24:30', type: 'video' },
        { title: 'Lab: Building your first Neural Network', type: 'resource' },
      ],
    },
    {
      module: 'Module 2: Advanced Computer Vision',
      lectures: 6,
      duration: '8h 15m',
      expanded: false,
    },
    {
      module: 'Module 3: Natural Language Processing',
      lectures: 8,
      duration: '10h 40m',
      expanded: false,
    },
  ],
  reviews: [
    {
      id: 1,
      userName: 'Marcus Chen',
      rating: 5,
      date: '3 days ago',
      comment: 'The production deployment module alone is worth the price of the entire course. Dr. Vance explains complex Docker concepts in a way that finally clicked for me.',
    },
    {
      id: 2,
      userName: 'Sarah Jenkins',
      rating: 4,
      date: '1 week ago',
      comment: 'Excellent curriculum. It covers the latest research papers in Transformer architectures which is hard to find in other online courses.',
    },
  ],
  ratingDistribution: [
    { stars: 5, percentage: 78 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 4 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ],
};

export default function CourseDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [expandedModule, setExpandedModule] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={24} color="#7C3AED" />
          <Text style={styles.logoText}>EduLearn</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity><Text style={styles.navLink}>Browse Courses</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.navLink}>My Learning</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.navLink}>Resources</Text></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="cart-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar}>
            <Ionicons name="person" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.breadcrumb}>
          <Text style={styles.breadcrumbText}>Home</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
          <Text style={styles.breadcrumbText}>Data Science</Text>
          <Ionicons name="chevron-forward" size={16} color="#666" />
          <Text style={styles.breadcrumbText}>Machine Learning</Text>
        </View>

        <View style={styles.mainSection}>
          <View style={styles.leftColumn}>
            <Text style={styles.title}>{COURSE_DATA.title}</Text>
            <Text style={styles.description}>{COURSE_DATA.description}</Text>

            <View style={styles.metaInfo}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingNumber}>{COURSE_DATA.rating}</Text>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={16} color="#F59E0B" />
                  ))}
                </View>
                <Text style={styles.reviewCount}>({COURSE_DATA.reviewsCount} reviews)</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="people" size={16} color="#666" />
                <Text style={styles.metaText}>{COURSE_DATA.studentsEnrolled.toLocaleString()} students enrolled</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="calendar" size={16} color="#666" />
                <Text style={styles.metaText}>Last updated {COURSE_DATA.lastUpdated}</Text>
              </View>
            </View>

            <View style={styles.videoSection}>
              <View style={styles.videoPlaceholder}>
                <Ionicons name="play-circle" size={64} color="white" />
                <Text style={styles.previewText}>Watch Course Preview</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Course Overview</Text>
              <Text style={styles.sectionText}>{COURSE_DATA.description}</Text>
              <Text style={styles.sectionText}>
                You will learn how to design, train, and deploy large-scale machine learning models using industry-standard tools. The curriculum is built around hands-on projects including a sentiment analysis engine and a real-time object detection system.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Course Content</Text>
              <Text style={styles.contentSummary}>
                8 sections • 42 lectures • 40h total length
              </Text>
              {COURSE_DATA.syllabus.map((module, index) => (
                <View key={index} style={styles.moduleContainer}>
                  <TouchableOpacity
                    style={styles.moduleHeader}
                    onPress={() => setExpandedModule(expandedModule === index ? -1 : index)}
                  >
                    <Ionicons
                      name={expandedModule === index ? 'chevron-down' : 'chevron-forward'}
                      size={20}
                      color="#333"
                    />
                    <Text style={styles.moduleTitle}>{module.module}</Text>
                    <Text style={styles.moduleMeta}>
                      {module.lectures} lectures • {module.duration}
                    </Text>
                  </TouchableOpacity>
                  {expandedModule === index && module.topics && (
                    <View style={styles.topicsList}>
                      {module.topics.map((topic, topicIndex) => (
                        <View key={topicIndex} style={styles.topicItem}>
                          <Ionicons
                            name={topic.type === 'video' ? 'play-circle-outline' : 'document-text-outline'}
                            size={16}
                            color="#666"
                          />
                          <Text style={styles.topicTitle}>{topic.title}</Text>
                          {topic.duration && <Text style={styles.topicDuration}>{topic.duration}</Text>}
                          {topic.type === 'resource' && (
                            <Text style={styles.topicType}>Resource</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Instructor</Text>
              <View style={styles.instructorCard}>
                <Image
                  source={{ uri: COURSE_DATA.instructor.avatar }}
                  style={styles.instructorAvatar}
                />
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>{COURSE_DATA.instructor.name}</Text>
                  <Text style={styles.instructorTitle}>{COURSE_DATA.instructor.title}</Text>
                  <View style={styles.instructorStats}>
                    <View style={styles.instructorStat}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.instructorStatText}>{COURSE_DATA.instructor.rating} Instructor Rating</Text>
                    </View>
                    <View style={styles.instructorStat}>
                      <Ionicons name="people" size={16} color="#666" />
                      <Text style={styles.instructorStatText}>{COURSE_DATA.instructor.students.toLocaleString()} Students</Text>
                    </View>
                    <View style={styles.instructorStat}>
                      <Ionicons name="book" size={16} color="#666" />
                      <Text style={styles.instructorStatText}>{COURSE_DATA.instructor.courses} Courses</Text>
                    </View>
                  </View>
                  <Text style={styles.instructorBio}>{COURSE_DATA.instructor.bio}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Student Reviews</Text>
              <View style={styles.reviewsOverview}>
                <View style={styles.ratingOverview}>
                  <Text style={styles.ratingLarge}>{COURSE_DATA.rating}</Text>
                  <View style={styles.starsLarge}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons key={star} name="star" size={20} color="#F59E0B" />
                    ))}
                  </View>
                  <Text style={styles.courseRatingLabel}>Course Rating</Text>
                </View>
                <View style={styles.ratingBars}>
                  {COURSE_DATA.ratingDistribution.map((rating) => (
                    <View key={rating.stars} style={styles.ratingBar}>
                      <Text style={styles.starLabel}>{rating.stars} star</Text>
                      <View style={styles.barContainer}>
                        <View style={[styles.barFill, { width: `${rating.percentage}%` }]} />
                      </View>
                      <Text style={styles.percentageLabel}>{rating.percentage}%</Text>
                    </View>
                  ))}
                </View>
              </View>

              {COURSE_DATA.reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerAvatar}>
                      <Ionicons name="person" size={20} color="#666" />
                    </View>
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>{review.userName}</Text>
                      <View style={styles.reviewRating}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons
                            key={star}
                            name="star"
                            size={12}
                            color={star <= review.rating ? '#F59E0B' : '#ddd'}
                          />
                        ))}
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllButtonText}>See All Reviews</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sidebar}>
            <View style={styles.courseCard}>
              <TouchableOpacity style={styles.goCourseButton}>
                <Ionicons name="play" size={20} color="white" />
                <Text style={styles.goCourseButtonText}>Go to Course</Text>
              </TouchableOpacity>

              <Text style={styles.cardSectionTitle}>This course includes:</Text>
              {COURSE_DATA.includes.map((item, index) => (
                <View key={index} style={styles.includeItem}>
                  <Ionicons name={item.icon} size={16} color="#7C3AED" />
                  <Text style={styles.includeText}>{item.text}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Skill Level</Text>
                <Text style={styles.infoValue}>{COURSE_DATA.level}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Language</Text>
                <Text style={styles.infoValue}>{COURSE_DATA.language}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Captions</Text>
                <Text style={styles.infoValue}>{COURSE_DATA.captions}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Lectures</Text>
                <Text style={styles.infoValue}>{COURSE_DATA.lectures} Lectures</Text>
              </View>

              <View style={styles.certBanner}>
                <Ionicons name="ribbon" size={24} color="#7C3AED" />
                <View>
                  <Text style={styles.certTitle}>Professional Certification</Text>
                  <Text style={styles.certSubtitle}>
                    Earn a recognized certificate and share it with your industry peers upon completion
                  </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    marginRight: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 24,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
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
  iconButton: {
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#666',
  },
  mainSection: {
    flexDirection: 'row',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    padding: 24,
    gap: 24,
  },
  leftColumn: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  videoSection: {
    marginBottom: 32,
  },
  videoPlaceholder: {
    width: '100%',
    height: 400,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    color: 'white',
    fontSize: 16,
    marginTop: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#333',
    marginBottom: 12,
  },
  contentSummary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  moduleContainer: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    gap: 12,
  },
  moduleTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  moduleMeta: {
    fontSize: 14,
    color: '#666',
  },
  topicsList: {
    backgroundColor: 'white',
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingLeft: 48,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  topicTitle: {
    flex: 1,
    fontSize: 14,
  },
  topicDuration: {
    fontSize: 14,
    color: '#666',
  },
  topicType: {
    fontSize: 12,
    color: '#7C3AED',
  },
  instructorCard: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  instructorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructorTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  instructorStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  instructorStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instructorStatText: {
    fontSize: 13,
    color: '#666',
  },
  instructorBio: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  reviewsOverview: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  ratingOverview: {
    alignItems: 'center',
  },
  ratingLarge: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  starsLarge: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  courseRatingLabel: {
    fontSize: 14,
    color: '#666',
  },
  ratingBars: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  starLabel: {
    fontSize: 14,
    width: 40,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  percentageLabel: {
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  reviewCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  seeAllButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 8,
    alignItems: 'center',
  },
  seeAllButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  sidebar: {
    width: 350,
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 20,
    position: 'sticky',
    top: 24,
  },
  goCourseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  goCourseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  includeText: {
    fontSize: 14,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5e5',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  certBanner: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    marginTop: 16,
  },
  certTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  certSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
