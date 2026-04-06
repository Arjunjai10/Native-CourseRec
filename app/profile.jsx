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
import { userAPI } from './utils/api';
import Navbar from './components/Navbar';

export default function Profile() {
  const router = useRouter();
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
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView style={styles.content}>
        <View style={styles.mainContent}>
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
              <TouchableOpacity style={styles.editButton} onPress={() => router.push('/settings')}>
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
                <TouchableOpacity onPress={() => router.push('/settings')}>
                  <Text style={styles.manageLink}>Manage Interests</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.interestsContainer}>
                {userProfile.interests.length > 0 ? userProfile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                )) : <Text style={{marginLeft: 10, color: '#666'}}>No interests added yet.</Text>}
                <TouchableOpacity style={styles.addInterestButton} onPress={() => router.push('/settings')}>
                  <Ionicons name="add" size={20} color="#741ce9" />
                  <Text style={styles.addInterestText}>Add Interest</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Certificates</Text>
                <TouchableOpacity onPress={() => {if (Platform.OS === 'web') {alert('All certificates shown.');}}}>
                  <Text style={styles.viewAllLink}>View All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.certificatesGrid}>
                {userProfile.recentCertificates.length > 0 ? userProfile.recentCertificates.map((cert, index) => (
                  <View key={index} style={styles.certCard}>
                    <View style={styles.certIcon}>
                      <Ionicons name="ribbon" size={24} color="#741ce9" />
                    </View>
                    <Text style={styles.certTitle}>{cert.courseTitle || 'Course Certificate'}</Text>
                    <Text style={styles.certDate}>Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'Recent'}</Text>
                    <TouchableOpacity style={styles.downloadLink}>
                      <Ionicons name="download-outline" size={16} color="#741ce9" />
                      <Text style={styles.downloadText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                )) : <Text style={{marginLeft: 10, color: '#666'}}>You haven't earned any certificates yet.</Text>}
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
    backgroundColor: '#f5f7fb',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
    padding: 24,
  },
  profileContent: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  profileImageContainer: {
    marginRight: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#f3ebff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 16,
    color: '#741ce9',
    fontWeight: '600',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f3ebff',
  },
  editButtonText: {
    color: '#741ce9',
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  manageLink: {
    color: '#741ce9',
    fontWeight: '600',
  },
  viewAllLink: {
    color: '#741ce9',
    fontWeight: '600',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  interestText: {
    color: '#666',
    fontWeight: '500',
  },
  addInterestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#741ce9',
    borderStyle: 'dashed',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  addInterestText: {
    color: '#741ce9',
    fontWeight: '600',
    marginLeft: 4,
  },
  certificatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginRight: '2%',
  },
  certIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  certTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  certDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  downloadLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadText: {
    color: '#741ce9',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  }
});
