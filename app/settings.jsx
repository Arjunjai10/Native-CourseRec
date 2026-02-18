import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Johnson');
  const [email, setEmail] = useState('alex.johnson@edulearn.com');
  const [bio, setBio] = useState("I'm a lifelong learner interested in data science, creative coding, and the psychology of learning. I'm currently working towards a pivot into UX design!");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={24} color="#741ce9" />
          <Text style={styles.logoText}>EduLearn</Text>
        </View>
        <View style={styles.nav}>
          <TouchableOpacity><Text style={styles.navLink}>Explore</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.navLink}>My Courses</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.navLink}>Recommendations</Text></TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#666" />
            <Text style={styles.searchText}>Search courses...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
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

      <View style={styles.mainContent}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Settings</Text>
            <Text style={styles.sidebarSubtitle}>Manage your account and preferences</Text>
          </View>

          <View style={styles.sidebarSection}>
            <TouchableOpacity style={[styles.sidebarItem, styles.sidebarItemActive]}>
              <Ionicons name="person" size={20} color="#741ce9" />
              <Text style={[styles.sidebarText, styles.sidebarTextActive]}>Profile Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Ionicons name="notifications" size={20} color="#666" />
              <Text style={styles.sidebarText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Ionicons name="shield" size={20} color="#666" />
              <Text style={styles.sidebarText}>Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Ionicons name="eye" size={20} color="#666" />
              <Text style={styles.sidebarText}>Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Ionicons name="globe" size={20} color="#666" />
              <Text style={styles.sidebarText}>Language & Region</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>Profile Information</Text>
            <Text style={styles.contentSubtitle}>
              Update your personal details and how others see you on the platform.
            </Text>
          </View>

          <View style={styles.profilePictureSection}>
            <View style={styles.profilePictureContainer}>
              <View style={styles.profilePicture}>
                <Ionicons name="person" size={48} color="#999" />
              </View>
              <TouchableOpacity style={styles.uploadIcon}>
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.profilePictureInfo}>
              <Text style={styles.profilePictureTitle}>Profile Picture</Text>
              <Text style={styles.profilePictureText}>
                Upload a clear photo to help your mentors and peers identify you. JPG, GIF or PNG. Max size 800K.
              </Text>
              <View style={styles.uploadButtons}>
                <TouchableOpacity style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>Upload New</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Alex"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Johnson"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.emailInputContainer}>
                <TextInput
                  style={[styles.input, styles.emailInput]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="alex.johnson@edulearn.com"
                  keyboardType="email-address"
                />
                <Ionicons name="checkmark-circle" size={20} color="#741ce9" />
              </View>
              <Text style={styles.helperText}>
                Your email is verified and will be used for course notifications.
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Brief description for your profile (max 200 characters)."
                multiline
                numberOfLines={4}
              />
              <Text style={styles.helperText}>
                Brief description for your profile (max 200 characters).
              </Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          {showSuccess && (
            <View style={styles.successToast}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <View style={styles.toastContent}>
                <Text style={styles.toastTitle}>Settings saved successfully</Text>
                <Text style={styles.toastText}>Your profile info is now up to date.</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSuccess(false)}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  nav: {
    flexDirection: 'row',
    gap: 24,
  },
  navLink: {
    fontSize: 14,
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 'auto',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchText: {
    fontSize: 14,
    color: '#999',
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
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: 'white',
    padding: 24,
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
  },
  sidebarSection: {
    marginBottom: 24,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sidebarSubtitle: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#741ce9',
  },
  sidebarText: {
    fontSize: 14,
    color: '#666',
  },
  sidebarTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 40,
  },
  contentHeader: {
    marginBottom: 32,
  },
  contentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contentSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  profilePictureSection: {
    flexDirection: 'row',
    gap: 20,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 24,
  },
  profilePictureContainer: {
    position: 'relative',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#741ce9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profilePictureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  profilePictureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    backgroundColor: '#741ce9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  removeButtonText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  formRow: {
    flexDirection: 'row',
    gap: 20,
  },
  formGroup: {
    flex: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingRight: 12,
    backgroundColor: '#fafafa',
  },
  emailInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#741ce9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  successToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#10b981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toastContent: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  toastText: {
    fontSize: 12,
    color: '#666',
  },
});
