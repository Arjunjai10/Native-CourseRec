import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);

  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    studentId: '',
    bio: '',
    courses: 0,
    coursesChange: '',
    learningHours: 0,
    learningRank: '',
    certificates: 0,
    interests: [],
    recentCertificates: [],
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setUser(u);
        
        // Dynamic fetch from backend
        import('./utils/api').then(({ userAPI }) => {
            userAPI.getProfile(u.id || u._id).then(res => {
               const data = res.data;
               setUserProfile({
                  name: data.fullName || 'User',
                  studentId: data.id ? `#EDU-${data.id.substring(data.id.length - 5)}` : (data._id ? `#EDU-${data._id.substring(data._id.length - 5)}` : ''),
                  bio: data.bio || '',
                  courses: (data.enrolledCourses || []).length + (data.completedCourses || []).length,
                  coursesChange: 'Active Learner',
                  learningHours: data.learningHours || 0,
                  learningRank: 'Top 10% of learners',
                  certificates: (data.certificates || []).length,
                  interests: data.interests || [],
                  recentCertificates: data.certificates || [],
               });
            }).catch(err => console.error(err));
        });
      }
    }
  }, []);

  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.replace('/signin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={28} color="#741ce9" />
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
          <TouchableOpacity onPress={() => router.push('/courses')}>
            <Text style={styles.navLink}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/recommendations')}>
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
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
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
                <Ionicons name="person" size={20} color={activeTab === 'profile' ? '#741ce9' : '#666'} />
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
              <TouchableOpacity style={styles.sidebarItem} onPress={handleSignOut}>
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
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <Text style={styles.studentId}>Student ID: {userProfile.studentId}</Text>
                <Text style={styles.bio}>{userProfile.bio}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="book" size={24} color="#741ce9" />
                  <Text style={styles.statValue}>{userProfile.courses}</Text>
                </View>
                <Text style={styles.statLabel}>COURSES</Text>
                <Text style={styles.statChange}>{userProfile.coursesChange}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="time" size={24} color="#741ce9" />
                  <Text style={styles.statValue}>{userProfile.learningHours}</Text>
                </View>
                <Text style={styles.statLabel}>LEARNING HOURS</Text>
                <Text style={styles.statChange}>{userProfile.learningRank}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name="ribbon" size={24} color="#741ce9" />
                  <Text style={styles.statValue}>{userProfile.certificates}</Text>
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
                {userProfile.interests.length > 0 ? userProfile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                )) : <Text style={{marginLeft: 10, color: '#666'}}>No interests added yet.</Text>}
                <TouchableOpacity style={styles.addInterestButton}>
                  <Ionicons name="add" size={20} color="#741ce9" />
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
                {userProfile.recentCertificates.length > 0 ? userProfile.recentCertificates.map(cert => (
                  <View key={cert.id || cert.courseId} style={styles.certCard}>
                    <View style={styles.certIcon}>
                      <Ionicons name="ribbon" size={24} color="#741ce9" />
                    </View>
                    <View style={styles.certInfo}>
                      <Text style={styles.certTitle}>{cert.title || cert.courseName}</Text>
                      <Text style={styles.certDate}>Issued on {cert.date || new Date(cert.completedDate).toLocaleDateString()}</Text>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="download-outline" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                )) : <Text style={{marginLeft: 10, color: '#666', marginBottom: 20}}>No certificates earned yet.</Text>}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Ionicons name="school" size={24} color="#741ce9" />
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
    color: '#741ce9',
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
    color: '#741ce9',
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
    color: '#741ce9',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: '#741ce9',
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
    color: '#741ce9',
    fontSize: 14,
  },
  viewAllLink: {
    color: '#741ce9',
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
    borderColor: '#741ce9',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  addInterestText: {
    fontSize: 14,
    color: '#741ce9',
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
    backgroundColor: '#741ce9',
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
    borderColor: '#741ce9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  viewCertButtonText: {
    color: '#741ce9',
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
