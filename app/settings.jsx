import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
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

export default function Settings() {
  const router = useRouter();
  const [userContext, setUserContext] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (Platform.OS === 'web') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUserContext(parsedUser);
        
        userAPI.getProfile(parsedUser.id || parsedUser._id).then(res => {
            const data = res.data;
            const names = (data.fullName || '').split(' ');
            setFirstName(names[0] || '');
            setLastName(names.slice(1).join(' ') || '');
            setEmail(data.email || '');
            setBio(data.bio || '');
        }).catch(err => console.error(err));
      }
    }
  }, []);

  const handleSave = () => {
    if (!userContext) return;
    const userId = userContext.id || userContext._id;
    const fullName = `${firstName} ${lastName}`.trim();
    
    userAPI.updateProfile(userId, { fullName, bio })
       .then(res => {
         setShowSuccess(true);
         setTimeout(() => setShowSuccess(false), 3000);
         
         if (Platform.OS === 'web') {
             const userStr = localStorage.getItem('user');
             if (userStr) {
                 const u = JSON.parse(userStr);
                 u.fullName = fullName;
                 localStorage.setItem('user', JSON.stringify(u));
             }
         }
       })
       .catch(err => {
         alert('Failed to update profile!');
         console.error(err);
       });
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>Settings</Text>
            <TouchableOpacity 
              style={[styles.sidebarItem, activeTab === 'profile' && styles.sidebarItemActive]}
              onPress={() => setActiveTab('profile')}
            >
              <Ionicons name="person-outline" size={20} color={activeTab === 'profile' ? '#741ce9' : '#666'} />
              <Text style={[styles.sidebarText, activeTab === 'profile' && styles.sidebarTextActive]}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sidebarItem, activeTab === 'notifications' && styles.sidebarItemActive]}
              onPress={() => setActiveTab('notifications')}
            >
              <Ionicons name="notifications-outline" size={20} color={activeTab === 'notifications' ? '#741ce9' : '#666'} />
              <Text style={[styles.sidebarText, activeTab === 'notifications' && styles.sidebarTextActive]}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sidebarItem, activeTab === 'security' && styles.sidebarItemActive]}
              onPress={() => setActiveTab('security')}
            >
              <Ionicons name="shield-checkmark-outline" size={20} color={activeTab === 'security' ? '#741ce9' : '#666'} />
              <Text style={[styles.sidebarText, activeTab === 'security' && styles.sidebarTextActive]}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.sidebarItem, activeTab === 'billing' && styles.sidebarItemActive]}
              onPress={() => setActiveTab('billing')}
            >
              <Ionicons name="card-outline" size={20} color={activeTab === 'billing' ? '#741ce9' : '#666'} />
              <Text style={[styles.sidebarText, activeTab === 'billing' && styles.sidebarTextActive]}>Billing</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContent}>
            {activeTab === 'profile' ? (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Edit Profile</Text>
                  <Text style={styles.sectionSubtitle}>Update your personal information and biography.</Text>
                </View>

                <View style={styles.profileImageSection}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/100' }}
                    style={styles.profileImage}
                  />
                  <View style={styles.imageActions}>
                    <TouchableOpacity style={styles.changeImageButton}>
                      <Text style={styles.changeImageText}>Change Photo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeImageButton}>
                      <Text style={styles.removeImageText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.formRow}>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>First Name</Text>
                      <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                      />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Last Name</Text>
                      <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={[styles.input, styles.disabledInput]}
                      value={email}
                      editable={false}
                    />
                    <Text style={styles.helperText}>Email address cannot be changed.</Text>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Biography</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Write a short bio about yourself..."
                      multiline={true}
                      numberOfLines={4}
                    />
                  </View>

                  {showSuccess && (
                    <View style={styles.successMessage}>
                      <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                      <Text style={styles.successText}>Changes saved successfully!</Text>
                    </View>
                  )}

                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.placeholderSection}>
                <Ionicons name="construct-outline" size={64} color="#ddd" />
                <Text style={styles.placeholderTitle}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</Text>
                <Text style={styles.placeholderSubtitle}>This section is coming soon.</Text>
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
    backgroundColor: '#f5f7fb',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    flexDirection: 'row',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    padding: 30,
  },
  sidebar: {
    width: 250,
    marginRight: 40,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 30,
    marginLeft: 12,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  sidebarItemActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sidebarText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginLeft: 12,
  },
  sidebarTextActive: {
    color: '#741ce9',
  },
  settingsContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  profileImageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 24,
    borderWidth: 4,
    borderColor: '#f3ebff',
  },
  changeImageButton: {
    backgroundColor: '#741ce9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeImageButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  removeImageText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  formGroup: {
    flex: 1,
    marginRight: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
  helperText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#741ce9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#741ce9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  successText: {
    color: '#10b981',
    fontWeight: '600',
    marginLeft: 8,
  },
  placeholderSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: '#999',
  }
});
