import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { userAPI } from './utils/api';
import Navbar from './components/Navbar';
import { LinearGradient } from 'expo-linear-gradient';

import { useFocusEffect } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [user, setUser] = useState(null);

  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    studentId: '',
    bio: '',
    courses: 0,
    coursesChange: '',
    learningHours: 0,
    skillMatch: '0%',
    learningRank: '',
    certificates: 0,
    interests: [],
    recentCertificates: [],
  });

  const loadProfile = () => {
    if (Platform.OS === 'web') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        setUser(u);
        
        userAPI.getProfile(u.id || u._id).then(res => {
           const data = res.data;
           const enrolled = data.enrolledCourses || [];
           const skillPerc = enrolled.length > 0 ? Math.min(65 + (enrolled.length * 5), 98) : 42;

           setUserProfile({
              name: data.fullName || u.fullName || u.username || 'User',
              studentId: data.id ? `#EDU-${data.id.substring(data.id.length - 5)}` : (data._id ? `#EDU-${data._id.substring(data._id.length - 5)}` : ''),
              bio: data.bio || '',
              courses: enrolled.length,
              coursesChange: 'Active Learner',
              learningHours: data.learningHours || 0,
              skillMatch: `${skillPerc}%`,
              learningRank: 'Top 10% of learners',
              certificates: (data.certificates || []).length + enrolled.length,
              interests: (data.interests && data.interests.length > 0) ? data.interests : ['Data Science', 'Development', 'Business', 'Design'],
              recentCertificates: enrolled,
           });
        }).catch(err => {
           setUserProfile(prev => ({
               ...prev,
               name: u.fullName || 'User',
               bio: u.bio || '',
           }));
        });
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
           <LinearGradient
             colors={['#741ce9', '#9d50bb']}
             style={styles.headerGradient}
           >
              <View style={styles.profileHeaderContent}>
                 <View style={styles.profilePicBox}>
                    <Image
                      source={{ uri: user?.profilePicture || `https://ui-avatars.com/api/?name=${userProfile.name.replace(' ', '+')}&background=741ce9&color=fff&size=150` }}
                      style={styles.profilePic}
                    />
                    <TouchableOpacity style={styles.editPicBtn}>
                       <Ionicons name="camera" size={16} color="#fff" />
                    </TouchableOpacity>
                 </View>
                 <View style={styles.nameSection}>
                    <Text style={styles.nameText}>{userProfile.name}</Text>
                    <View style={styles.idRow}>
                       <Text style={styles.idText}>{userProfile.studentId}</Text>
                       <View style={styles.idDivider} />
                       <Text style={styles.rankText}>Gold Member</Text>
                    </View>
                 </View>
              </View>
           </LinearGradient>
           
           <View style={styles.statsOverlay}>
              <View style={styles.statBox}>
                 <Text style={styles.statNum}>{userProfile.courses}</Text>
                 <Text style={styles.statLabel}>Recommends</Text>
              </View>
              <View style={styles.statBoxDivider} />
              <View style={styles.statBox}>
                 <Text style={styles.statNum}>{userProfile.skillMatch || '42%'}</Text>
                 <Text style={styles.statLabel}>Skill Match</Text>
              </View>
              <View style={styles.statBoxDivider} />
              <View style={styles.statBox}>
                 <Text style={styles.statNum}>{userProfile.recentCertificates.length}</Text>
                 <Text style={styles.statLabel}>Saved</Text>
              </View>
           </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.section}>
             <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>About Me</Text>
                <TouchableOpacity onPress={() => router.push('/settings')}>
                  <Ionicons name="create-outline" size={20} color="#741ce9" />
                </TouchableOpacity>
             </View>
             <Text style={styles.bioText}>
                {userProfile.bio || "No biography provided yet. Tell us about your learning goals and professional background to personalize your experience."}
             </Text>
          </View>

          <View style={styles.section}>
              <View style={styles.sectionHead}>
                 <Ionicons name="star" size={20} color="#741ce9" />
                 <Text style={styles.sectionTitle}>My Interests</Text>
              </View>
             <View style={styles.interestsGrid}>
                {userProfile.interests.map((interest, i) => (
                   <View key={i} style={styles.interestPill}>
                      <Text style={styles.interestText}>{interest}</Text>
                   </View>
                ))}
             </View>
          </View>

          <View style={styles.section}>
              <View style={styles.sectionHead}>
                 <View style={styles.sectionTitleRow}>
                    <Ionicons name="bookmark" size={20} color="#741ce9" />
                    <Text style={styles.sectionTitle}>Saved Recommendations</Text>
                 </View>
                 <TouchableOpacity onPress={() => router.push('/courses')}>
                    <Text style={styles.seeAllText}>Manage Library</Text>
                 </TouchableOpacity>
              </View>
             
             {userProfile.recentCertificates.length > 0 ? (
                userProfile.recentCertificates.map((course, index) => (
                   <TouchableOpacity key={index} style={styles.certificateCard} onPress={() => router.push(`/course/${course._id || course.id}`)}>
                      <View style={styles.certIcon}>
                         <Ionicons name="book" size={24} color="#741ce9" />
                      </View>
                      <View style={styles.certInfo}>
                         <Text style={styles.certTitle}>{course.title || 'In Progress Course'}</Text>
                          <View style={styles.certMetaRow}>
                             <Ionicons name="ribbon" size={12} color="#94a3b8" />
                             <Text style={styles.certMeta}>{course.category || 'Professional'}</Text>
                             <View style={styles.metaDot} />
                             <Ionicons name="time" size={12} color="#94a3b8" />
                             <Text style={styles.certMeta}>{course.level || 'All Levels'}</Text>
                          </View>
                      </View>
                      <View style={styles.viewCertBtn}>
                         <Ionicons name="arrow-forward-outline" size={20} color="#666" />
                      </View>
                   </TouchableOpacity>
                ))
             ) : (
                <View style={styles.emptyActivity}>
                   <Ionicons name="sparkles-outline" size={40} color="#e2e8f0" />
                   <Text style={styles.emptyText}>Find your first recommendation!</Text>
                </View>
             )}
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
  headerSection: {
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 100,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  profileHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicBox: {
    position: 'relative',
    marginRight: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editPicBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  nameSection: {
    flex: 1,
  },
  nameText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  idText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  idDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 12,
  },
  rankText: {
     fontSize: 14,
     color: '#fff',
     fontWeight: '800',
  },
  statsOverlay: {
     flexDirection: 'row',
     marginHorizontal: Platform.select({ web: 40, default: 20 }),
     marginTop: -45,
     backgroundColor: '#fff',
     borderRadius: 30,
     paddingVertical: 25,
     ...Platform.select({
       ios: {
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 10 },
         shadowOpacity: 0.1,
         shadowRadius: 20,
       },
       android: {
         elevation: 10,
       },
       web: {
         boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
       }
     }),
     alignItems: 'center',
  },
  statBox: {
     flex: 1,
     alignItems: 'center',
  },
  statNum: {
     fontSize: 24,
     fontWeight: '900',
     color: '#1e293b',
  },
  statLabel: {
     fontSize: 12,
     fontWeight: '700',
     color: '#94a3b8',
     textTransform: 'uppercase',
  },
  statBoxDivider: {
     width: 1,
     height: 30,
     backgroundColor: '#f1f5f9',
  },
  mainContent: {
     padding: 25,
     paddingTop: 10,
  },
  section: {
     marginBottom: 35,
  },
  sectionHead: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: 15,
  },
  sectionTitle: {
     fontSize: 20,
     fontWeight: '800',
     color: '#1e293b',
     letterSpacing: -0.5,
  },
  bioText: {
     fontSize: 15,
     lineHeight: 24,
     color: '#64748b',
     fontWeight: '500',
  },
  interestsGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
  },
  interestPill: {
     backgroundColor: '#f8fafc',
     paddingHorizontal: 16,
     paddingVertical: 10,
     borderRadius: 14,
     marginRight: 10,
     marginBottom: 10,
     borderWidth: 1,
     borderColor: '#f1f5f9',
  },
  interestText: {
     fontSize: 14,
     fontWeight: '700',
     color: '#475569',
  },
  seeAllText: {
     fontSize: 14,
     fontWeight: 'bold',
     color: '#741ce9',
  },
  certificateCard: {
     flexDirection: 'row',
     backgroundColor: '#fff',
     padding: 16,
     borderRadius: 24,
     borderWidth: 1,
     borderColor: '#f1f5f9',
     alignItems: 'center',
     marginBottom: 12,
  },
  certIcon: {
     width: 50,
     height: 50,
     borderRadius: 18,
     backgroundColor: '#f3ebff',
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 15,
  },
  certInfo: {
     flex: 1,
  },
  certTitle: {
     fontSize: 15,
     fontWeight: '800',
     color: '#1e293b',
  },
  certMetaRow: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 6,
     marginTop: 6,
  },
  certMeta: {
     fontSize: 12,
     color: '#94a3b8',
     fontWeight: '600',
  },
  metaDot: {
     width: 4,
     height: 4,
     borderRadius: 2,
     backgroundColor: '#cbd5e1',
     marginHorizontal: 4,
  },
  sectionTitleRow: {
     flexDirection: 'row',
     alignItems: 'center',
     gap: 12,
  },
  viewCertBtn: {
     width: 40,
     height: 40,
     borderRadius: 20,
     justifyContent: 'center',
     alignItems: 'center',
  },
  emptyActivity: {
     alignItems: 'center',
     paddingVertical: 40,
  },
  emptyText: {
     marginTop: 10,
     color: '#cbd5e1',
     fontWeight: '600',
  }
});
