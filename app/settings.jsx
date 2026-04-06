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
import { userAPI, getActiveBackend, switchBackend } from './utils/api';
import Navbar from './components/Navbar';
import { LinearGradient } from 'expo-linear-gradient';

export default function Settings() {
  const router = useRouter();
  const [userContext, setUserContext] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Notification states
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifyDiscord, setNotifyDiscord] = useState(true);

  // Security states
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

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

  const menuItems = [
    { id: 'profile', label: 'My Profile', icon: 'person-outline' },
    { id: 'notify', label: 'Notifications', icon: 'notifications-outline' },
    { id: 'shield', label: 'Security', icon: 'shield-checkmark-outline' },
    { id: 'payment', label: 'Connections', icon: 'link-outline' },
    { id: 'help', label: 'AI Support', icon: 'help-circle-outline' },
    { id: 'dev', label: 'Developer', icon: 'code-working-outline' },
  ];

  const currentBackend = getActiveBackend();

  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.appArea}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Control Center</Text>
          <View style={styles.menuList}>
            {menuItems.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.menuItem, activeTab === item.id && styles.menuItemActive]}
                onPress={() => setActiveTab(item.id)}
              >
                <View style={[styles.menuIconBox, activeTab === item.id && styles.menuIconBoxActive]}>
                   <Ionicons name={item.icon} size={18} color={activeTab === item.id ? '#741ce9' : '#64748b'} />
                </View>
                <Text style={[styles.menuText, activeTab === item.id && styles.menuTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView style={styles.contentArea} contentContainerStyle={{ padding: 40 }}>
              {activeTab === 'profile' && (
                <>
                <View style={styles.formHeader}>
                    <Text style={styles.formTitle}>Identity & Bio</Text>
                    <Text style={styles.formSubtitle}>Update your visual profile and public biography.</Text>
                </View>

                <View style={styles.photoBox}>
                    <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.bigAvatar} />
                    <View style={styles.photoActions}>
                        <TouchableOpacity style={styles.uploadBtn}>
                        <Text style={styles.uploadText}>New Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeBtn}>
                        <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputRow}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>FIRST NAME</Text>
                        <TextInput 
                        style={styles.input} 
                        value={firstName} 
                        onChangeText={setFirstName} 
                        placeholder="Enter first name"
                        />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>LAST NAME</Text>
                        <TextInput 
                        style={styles.input} 
                        value={lastName} 
                        onChangeText={setLastName} 
                        placeholder="Enter last name"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                    <View style={styles.disabledInput}>
                        <Text style={styles.disabledText}>{email || 'user@example.com'}</Text>
                        <Ionicons name="lock-closed" size={14} color="#94a3b8" />
                    </View>
                    <Text style={styles.helperText}>Verified accounts cannot change their primary email.</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>PUBLIC BIOGRAPHY</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        multiline 
                        numberOfLines={4}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell your students and colleagues about yourself..."
                    />
                </View>

                {showSuccess && (
                    <View style={styles.successBar}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                    <Text style={styles.successMsg}>System updated successfully!</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <LinearGradient colors={['#741ce9', '#9d50bb']} style={styles.saveGradient}>
                        <Text style={styles.saveText}>Save Changes</Text>
                    </LinearGradient>
                </TouchableOpacity>
                </>
              )}

              {activeTab === 'notify' && (
                <View style={styles.tabSection}>
                   <View style={styles.formHeader}>
                      <Text style={styles.formTitle}>Communication</Text>
                      <Text style={styles.formSubtitle}>Decide how and when you want to receive new platform recommendations.</Text>
                   </View>

                   <View style={styles.notifyList}>
                      {[
                        { id: 'push', title: 'Push Notifications', desc: 'Real-time alerts on your device', state: notifyPush, setter: setNotifyPush },
                        { id: 'email', title: 'Email Digests', desc: 'Weekly roundup of your best matches', state: notifyEmail, setter: setNotifyEmail },
                        { id: 'discord', title: 'Discord Sync', desc: 'Alerts sent to your workspace', state: notifyDiscord, setter: setNotifyDiscord },
                      ].map(item => (
                        <View key={item.id} style={styles.notifyItem}>
                           <View style={styles.notifyInfo}>
                              <Text style={styles.notifyTitle}>{item.title}</Text>
                              <Text style={styles.notifyDesc}>{item.desc}</Text>
                           </View>
                           <TouchableOpacity 
                             style={[styles.toggleBase, item.state && styles.toggleActive]}
                             onPress={() => item.setter(!item.state)}
                           >
                              <View style={[styles.toggleCircle, item.state && styles.toggleCircleActive]} />
                           </TouchableOpacity>
                        </View>
                      ))}
                   </View>
                </View>
              )}

              {activeTab === 'shield' && (
                <View style={styles.tabSection}>
                   <View style={styles.formHeader}>
                      <Text style={styles.formTitle}>Access & Data</Text>
                      <Text style={styles.formSubtitle}>Protect your professional profile and managed credentials.</Text>
                   </View>

                   <View style={styles.passwordForm}>
                      <View style={styles.inputGroup}>
                         <Text style={styles.label}>CURRENT PASSWORD</Text>
                         <TextInput style={styles.input} secureTextEntry value={currentPass} onChangeText={setCurrentPass} placeholder="••••••••" />
                      </View>
                      <View style={styles.inputGroup}>
                         <Text style={styles.label}>NEW PASSWORD</Text>
                         <TextInput style={styles.input} secureTextEntry value={newPass} onChangeText={setNewPass} placeholder="Min 8 characters" />
                      </View>
                      <View style={styles.inputGroup}>
                         <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
                         <TextInput style={styles.input} secureTextEntry value={confirmPass} onChangeText={setConfirmPass} placeholder="Match your new password" />
                      </View>

                      <TouchableOpacity style={styles.saveBtn} onPress={() => {
                         if (newPass !== confirmPass) alert('Passwords do not match!');
                         else {
                            setShowSuccess(true);
                            setTimeout(() => setShowSuccess(false), 3000);
                         }
                      }}>
                         <LinearGradient colors={['#741ce9', '#9d50bb']} style={styles.saveGradient}>
                            <Text style={styles.saveText}>Update Password</Text>
                         </LinearGradient>
                      </TouchableOpacity>
                   </View>
                </View>
              )}

              {activeTab === 'payment' && (
                <View style={styles.tabSection}>
                   <View style={styles.formHeader}>
                      <Text style={styles.formTitle}>External Ecosphere</Text>
                      <Text style={styles.formSubtitle}>Connect your favorite learning platforms to enable cross-platform discovery.</Text>
                   </View>

                   <View style={styles.connectionsGrid}>
                      {[
                        { name: 'Coursera', color: '#0056D2', icon: 'logo-google' },
                        { name: 'Udemy', color: '#A435F0', icon: 'play-circle' },
                        { name: 'YouTube Learning', color: '#FF0000', icon: 'logo-youtube' },
                        { name: 'LinkedIn Learning', color: '#0077B5', icon: 'logo-linkedin' },
                      ].map(plat => (
                        <View key={plat.name} style={styles.connCard}>
                           <View style={[styles.connLogo, { backgroundColor: plat.color }]}>
                              <Ionicons name={plat.icon} size={24} color="#fff" />
                           </View>
                           <Text style={styles.connName}>{plat.name}</Text>
                           <TouchableOpacity style={styles.connBtn}>
                              <Text style={styles.connBtnText}>Connect API</Text>
                           </TouchableOpacity>
                        </View>
                      ))}
                   </View>
                </View>
              )}

              {activeTab === 'help' && (
                <View style={styles.tabSection}>
                   <View style={styles.formHeader}>
                      <Text style={styles.formTitle}>Personal Guardian</Text>
                      <Text style={styles.formSubtitle}>Our AI Support engine is ready to assist you with any platform issues.</Text>
                   </View>

                   <View style={styles.supportBox}>
                      <LinearGradient colors={['#741ce9', '#9d50bb']} style={styles.supportGradient}>
                         <Ionicons name="sparkles" size={40} color="#fff" />
                         <Text style={styles.supportHeroText}>How can I help you today?</Text>
                         <Text style={styles.supportSubText}>Explain your problem and our AI will troubleshoot in real-time.</Text>
                      </LinearGradient>

                      <View style={styles.supportChatSim}>
                         <TextInput style={styles.supportInput} placeholder="Type your issue here..." />
                         <TouchableOpacity style={styles.sendIconBox}>
                            <Ionicons name="send" size={20} color="#741ce9" />
                         </TouchableOpacity>
                      </View>
                   </View>
                </View>
              )}

              {activeTab === 'dev' && (
                <View style={styles.devSection}>
                   <View style={styles.formHeader}>
                      <Text style={styles.formTitle}>Server Orchestration</Text>
                      <Text style={styles.formSubtitle}>Switch between the hybrid Node.js and Java backends for development and scaling tests.</Text>
                   </View>

                   <View style={styles.activeInfoCard}>
                      <Ionicons name="server" size={24} color="#741ce9" />
                      <View>
                         <Text style={styles.activeLabel}>CURRENTLY ACTIVE BACKEND</Text>
                         <Text style={styles.activeValue}>{currentBackend}</Text>
                      </View>
                   </View>

                   <Text style={styles.label}>SWITCH SERVER INSTANCE</Text>
                   <View style={styles.switchGrid}>
                      <TouchableOpacity 
                        style={[styles.switchOption, currentBackend.includes('Node') && styles.switchOptionActive]}
                        onPress={() => switchBackend('node')}
                      >
                         <Ionicons name="logo-nodejs" size={24} color={currentBackend.includes('Node') ? '#fff' : '#666'} />
                         <Text style={[styles.switchOptionText, currentBackend.includes('Node') && styles.switchOptionActiveText]}>Node.js Backend</Text>
                         <Text style={styles.switchOptionSub}>Port 5000 • Express</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={[styles.switchOption, currentBackend.includes('Java') && styles.switchOptionActive]}
                        onPress={() => switchBackend('java')}
                      >
                         <Ionicons name="cafe" size={24} color={currentBackend.includes('Java') ? '#fff' : '#666'} />
                         <Text style={[styles.switchOptionText, currentBackend.includes('Java') && styles.switchOptionActiveText]}>Java Backend</Text>
                         <Text style={styles.switchOptionSub}>Port 8080 • Spring Boot</Text>
                      </TouchableOpacity>
                   </View>
                   <Text style={styles.warningText}>Switching will trigger a platform reload to re-initialize dependencies.</Text>
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
    backgroundColor: '#fff',
  },
  appArea: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 300,
    backgroundColor: '#f8fafc',
    padding: 30,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  menuList: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIconBoxActive: {
    backgroundColor: '#f3ebff',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },
  menuTextActive: {
    color: '#1e293b',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formSection: {
    maxWidth: 800,
    width: '100%',
  },
  formHeader: {
    marginBottom: 40,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: -1,
  },
  formSubtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  photoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  bigAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 25,
    backgroundColor: '#f1f5f9',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadBtn: {
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  uploadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  removeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  removeText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '800',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 25,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 25,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94a3b8',
    marginBottom: 10,
    letterSpacing: 1.2,
  },
  input: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledText: {
    color: '#94a3b8',
    fontSize: 15,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
    fontWeight: '500',
  },
  successBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 18,
    marginBottom: 30,
    gap: 12,
  },
  successMsg: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 14,
  },
  saveBtn: {
    width: 200,
    marginTop: 10,
  },
  saveGradient: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  devSection: {
     flex: 1,
  },
  activeInfoCard: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#f8fafc',
     padding: 24,
     borderRadius: 24,
     gap: 20,
     marginBottom: 40,
     borderWidth: 1,
     borderColor: '#f1f5f9',
  },
  activeLabel: {
     fontSize: 10,
     fontWeight: '900',
     color: '#94a3b8',
     letterSpacing: 1.5,
  },
  activeValue: {
     fontSize: 18,
     fontWeight: '800',
     color: '#1e293b',
     marginTop: 4,
  },
  switchGrid: {
     flexDirection: 'row',
     gap: 20,
     marginTop: 5,
     marginBottom: 20,
  },
  switchOption: {
     flex: 1,
     backgroundColor: '#fff',
     borderWidth: 1,
     borderColor: '#e2e8f0',
     borderRadius: 20,
     padding: 24,
     alignItems: 'center',
     gap: 10,
  },
  switchOptionActive: {
     backgroundColor: '#0a0a0a',
     borderColor: '#0a0a0a',
  },
  switchOptionText: {
     fontSize: 15,
     fontWeight: '800',
     color: '#1e293b',
  },
  switchOptionActiveText: {
     color: '#fff',
  },
  switchOptionSub: {
     fontSize: 12,
     color: '#64748b',
     fontWeight: '600',
  },
  warningText: {
     fontSize: 13,
     color: '#94a3b8',
     fontStyle: 'italic',
     fontWeight: '500',
  },
  tabSection: {
     flex: 1,
  },
  notifyList: {
     gap: 15,
  },
  notifyItem: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     padding: 24,
     backgroundColor: '#f8fafc',
     borderRadius: 24,
  },
  notifyTitle: {
     fontSize: 16,
     fontWeight: '800',
     color: '#1e293b',
  },
  notifyDesc: {
     fontSize: 13,
     color: '#64748b',
     marginTop: 4,
     fontWeight: '500',
  },
  toggleBase: {
     width: 50,
     height: 28,
     borderRadius: 14,
     backgroundColor: '#cbd5e1',
     padding: 3,
  },
  toggleActive: {
     backgroundColor: '#10b981',
  },
  toggleCircle: {
     width: 22,
     height: 22,
     borderRadius: 11,
     backgroundColor: '#fff',
  },
  toggleCircleActive: {
     alignSelf: 'flex-end',
  },
  passwordForm: {
     maxWidth: 500,
  },
  connectionsGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     gap: 20,
  },
  connCard: {
     width: 180,
     backgroundColor: '#f8fafc',
     borderRadius: 24,
     padding: 20,
     alignItems: 'center',
     gap: 12,
  },
  connLogo: {
     width: 48,
     height: 48,
     borderRadius: 24,
     justifyContent: 'center',
     alignItems: 'center',
  },
  connName: {
     fontSize: 14,
     fontWeight: '800',
     color: '#1e293b',
  },
  connBtn: {
     backgroundColor: '#fff',
     paddingHorizontal: 15,
     paddingVertical: 8,
     borderRadius: 12,
     borderWidth: 1,
     borderColor: '#e2e8f0',
  },
  connBtnText: {
     fontSize: 12,
     fontWeight: '700',
     color: '#741ce9',
  },
  supportBox: {
     backgroundColor: '#f8fafc',
     borderRadius: 32,
     overflow: 'hidden',
     maxWidth: 600,
  },
  supportGradient: {
     padding: 40,
     alignItems: 'center',
     gap: 15,
  },
  supportHeroText: {
     fontSize: 22,
     fontWeight: '900',
     color: '#fff',
     textAlign: 'center',
  },
  supportSubText: {
     fontSize: 14,
     color: 'rgba(255,255,255,0.8)',
     textAlign: 'center',
     lineHeight: 22,
  },
  supportChatSim: {
     padding: 20,
     flexDirection: 'row',
     alignItems: 'center',
     gap: 15,
  },
  supportInput: {
     flex: 1,
     backgroundColor: '#fff',
     padding: 15,
     borderRadius: 16,
     fontSize: 14,
  },
  sendIconBox: {
     width: 44,
     height: 44,
     backgroundColor: '#fff',
     borderRadius: 22,
     justifyContent: 'center',
     alignItems: 'center',
  }
});
