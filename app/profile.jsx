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
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  const userData = {
    name: 'Alex',
    studentId: '#EDU-88291',
    bio: 'Aspiring Data Scientist with a passion for building AI-driven solutions. Currently focused on mastering Python and Natural Language Processing. Always looking for new challenges in the tech space.',
    courses: 12,
    coursesChange: '+2 this month',
    learningHours: 145,
    learningRank: 'Top 5% of learners',
    certificates: 8,
    interests: ['Data Science', 'Machine Learning', 'Python', 'UI/UX Design', 'Statistics'],
    recentCertificates: [
      { id: 1, title: 'Python for Beginners', date: 'October 14, 2023' },
      { id: 2, title: 'Advanced ML Algorithms', date: 'September 28, 2023' },
    ],
  };

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
            <Text style={styles.navLink}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navLink}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.navLink}>Mentors</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.navLink, styles.activeNavLink]}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar}>
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.sidebar}>
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>ACCOUNT</Text>
              <TouchableOpacity
                style={[styles.sidebarItem, activeTab === 'profile' && styles.sidebarItemActive]}
                onPress={() => setActiveTab('profile')}
              >
                <Ionicons name="person" size={20} color={activeTab === 'profile' ? '#7C3AED' : '#666'} />
                <Text style={[styles.sidebarText, activeTab === 'profile' && styles.sidebarTextActive]}>
                  Profile Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem}>
                <Ionicons name="shield" size={20} color="#666" />
                <Text style={styles.sidebarText}>Security</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem}>
                <Ionicons name="eye" size={20} color="#666" />
                <Text style={styles.sidebarText}>Privacy Settings</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>SUPPORT</Text>
              <TouchableOpacity style={styles.sidebarItem}>
                <Ionicons name="help-circle" size={20} color="#666" />
                <Text style={styles.sidebarText}>Help Center</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sidebarItem}>
                <Ionicons name="log-out" size={20} color="#666" />
                <Text style={styles.sidebarText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileContent}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/120' }}
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData.name}</Text>
                <Text style={styles.studentId}>Student ID: {userData.studentId}</Text>
                <Text style={styles.bio}>{userData.bio}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="book" size={24} color="#7C3AED" />
                  <Text style={styles.statValue}>{userData.courses}</Text>
                </View>
                <Text style={styles.statLabel}>COURSES</Text>
                <Text style={styles.statChange}>{userData.coursesChange}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="time" size={24} color="#7C3AED" />
                  <Text style={styles.statValue}>{userData.learningHours}</Text>
                </View>
                <Text style={styles.statLabel}>LEARNING HOURS</Text>
                <Text style={styles.statChange}>{userData.learningRank}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="ribbon" size={24} color="#7C3AED" />
                  <Text style={styles.statValue}>{userData.certificates}</Text>
                </View>
                <Text style={styles.statLabel}>CERTIFICATES</Text>
                <Text style={styles.statChange}>Verified credentials</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Interests</Text>
                <TouchableOpacity>
                  <Text style={styles.manageLink}>Manage Interests</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.interestsContainer}>
                {userData.interests.map((interest, index) => (
                  <View key={index} style={styles.interestChip}>
                    <Text style={styles.interestText}>{interest}</Text>
                    <Ionicons name="analytics" size={16} color="#666" />
                  </View>
                ))}
                <TouchableOpacity style={styles.addInterestButton}>
                  <Ionicons name="add" size={20} color="#7C3AED" />
                  <Text style={styles.addInterestText}>Add Interest</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Certificates</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllLink}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.certificatesGrid}>
                {userData.recentCertificates.map((cert) => (
                  <View key={cert.id} style={styles.certificateCard}>
                    <View style={styles.certificateIcon}>
                      <Ionicons name="shield-checkmark" size={40} color="#7C3AED" />
                    </View>
                    <View style={styles.certificateProgress} />
                    <Text style={styles.certificateTitle}>{cert.title}</Text>
                    <Text style={styles.certificateDate}>Completed {cert.date}</Text>
                    <TouchableOpacity style={styles.viewCertButton}>
                      <Text style={styles.viewCertButtonText}>View Certificate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.downloadIcon}>
                      <Ionicons name="download-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Ionicons name="school" size={24} color="#7C3AED" />
          <Text style={styles.footerText}>EduLearn</Text>
        </View>
        <Text style={styles.footerCopyright}>© 2023 EduLearn Inc.</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.footerLink}>Terms of Service</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.footerLink}>Cookie Settings</Text></TouchableOpacity>
        </View>
      </View>
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flexDirection: 'row',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    padding: 24,
    gap: 24,
  },
  sidebar: {
    width: 250,
    gap: 24,
  },
  sidebarSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  sidebarItemActive: {
    backgroundColor: '#F3E8FF',
  },
  sidebarText: {
    fontSize: 14,
    color: '#666',
  },
  sidebarTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  profileContent: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#7C3AED',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  manageLink: {
    color: '#7C3AED',
    fontSize: 14,
  },
  viewAllLink: {
    color: '#7C3AED',
    fontSize: 14,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    color: '#333',
  },
  addInterestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  addInterestText: {
    fontSize: 14,
    color: '#7C3AED',
  },
  certificatesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  certificateCard: {
    flex: 1,
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    padding: 20,
    position: 'relative',
  },
  certificateIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  certificateProgress: {
    height: 4,
    backgroundColor: '#7C3AED',
    borderRadius: 2,
    marginBottom: 16,
  },
  certificateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  certificateDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  viewCertButton: {
    borderWidth: 1,
    borderColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  viewCertButtonText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
  downloadIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerCopyright: {
    fontSize: 14,
    color: '#666',
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 24,
  },
  footerLink: {
    fontSize: 14,
    color: '#666',
  },
});
