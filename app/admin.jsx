import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { adminAPI } from './utils/adminAPI';
import Navbar from './components/Navbar';
import { LinearGradient } from 'expo-linear-gradient';
import { switchBackend, getActiveBackend } from './utils/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState([]);

  // Modal/Edit states
  const [editingUser, setEditingUser] = useState(null);
  const [editingSetting, setEditingSetting] = useState(null);
  
  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = () => {
    if (Platform.OS === 'web') {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        router.replace('/signin');
        return;
      }
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        alert('Access Denied. Super Admin privileges required.');
        router.replace('/home');
        return;
      }
      loadData();
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes, settingsRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getUsers(),
        adminAPI.getSettings()
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      alert(error.response?.data?.message || 'Failed to connect to Admin API');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // User Management
  const handleUpdateUser = async () => {
    try {
      await adminAPI.updateUser(editingUser._id, editingUser);
      alert('User updated successfully');
      setEditingUser(null);
      loadData();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        alert('User deleted');
        loadData();
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  // Settings Management
  const handleSaveSetting = async () => {
    try {
      await adminAPI.updateSetting(editingSetting.key, editingSetting.value);
      alert('Setting updated');
      setEditingSetting(null);
      loadData();
    } catch (err) {
      alert('Failed to save setting');
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
    { id: 'users', label: 'User Management', icon: 'people-outline' },
    { id: 'courses', label: 'Course Management', icon: 'book-outline' },
    { id: 'settings', label: 'System Settings', icon: 'settings-outline' },
    { id: 'payment', label: 'Connections', icon: 'link-outline' },
    { id: 'dev', label: 'Developer', icon: 'code-working-outline' }
  ];

  return (
    <View style={styles.container}>
      <Navbar />
      
      <View style={[styles.main, isMobile && styles.mainMobile]}>
        {/* Sidebar */}
        <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
          {!isMobile && <Text style={styles.sidebarTitle}>Super Admin</Text>}
          <ScrollView horizontal={isMobile} showsHorizontalScrollIndicator={false} contentContainerStyle={isMobile ? styles.tabsMobile : styles.tabs}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive, isMobile && styles.tabItemMobile]}
                onPress={() => setActiveTab(tab.id)}
              >
                <View style={[styles.tabIconBox, activeTab === tab.id && styles.tabIconBoxActive]}>
                  <Ionicons name={tab.icon} size={20} color={activeTab === tab.id ? '#7C3AED' : '#64748b'} />
                </View>
                {!isMobile && <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Area */}
        <ScrollView style={styles.content} contentContainerStyle={{ padding: isMobile ? 20 : 40 }}>
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && analytics && (
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>System Overview</Text>
                <Text style={styles.subtitle}>Real-time analytics and platform metrics.</Text>
              </View>

              <View style={styles.statsGrid}>
                <LinearGradient colors={['#7C3AED', '#6D28D9']} style={styles.statCard}>
                  <Ionicons name="people" size={32} color="#fff" style={styles.statIcon} />
                  <Text style={styles.statLabel}>Total Users</Text>
                  <Text style={styles.statValue}>{analytics.totalUsers}</Text>
                  <Text style={styles.statSub}>{analytics.activeUsers} Active</Text>
                </LinearGradient>
                
                <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.statCard}>
                  <Ionicons name="book" size={32} color="#fff" style={styles.statIcon} />
                  <Text style={styles.statLabel}>Total Courses</Text>
                  <Text style={styles.statValue}>{analytics.totalCourses}</Text>
                  <Text style={styles.statSub}>Published Library</Text>
                </LinearGradient>




              </View>

              {/* CHARTS SECTION */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 40 }}>
                {/* User Growth Chart */}
                <View style={{ flex: 2, minWidth: 300, backgroundColor: '#fff', borderRadius: 24, padding: 25, borderWidth: 1, borderColor: '#e2e8f0' }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 25 }}>7-Day User Growth</Text>
                  <View style={{ height: 180, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 20 }}>
                    {analytics.growthData?.map((d, i) => (
                      <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                        <View style={{ width: '60%', height: Math.max((d.count / (Math.max(...analytics.growthData.map(gd => gd.count)) || 1)) * 120, 10), backgroundColor: '#7C3AED', borderRadius: 4 }} />
                        <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 10 }}>{d.date.split('-')[2]}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Category Distribution */}
                <View style={{ flex: 1, minWidth: 250, backgroundColor: '#fff', borderRadius: 24, padding: 25, borderWidth: 1, borderColor: '#e2e8f0' }}>
                   <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 25 }}>Top Categories</Text>
                   {analytics.categoryDistribution?.map((cat, i) => (
                     <View key={i} style={{ marginBottom: 15 }}>
                       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                         <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748b' }}>{cat.name}</Text>
                         <Text style={{ fontSize: 13, fontWeight: '800', color: '#1e293b' }}>{cat.value}</Text>
                       </View>
                       <View style={{ height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                         <View style={{ width: `${(cat.value / analytics.totalCourses) * 100}%`, height: '100%', backgroundColor: '#3B82F6' }} />
                       </View>
                     </View>
                   ))}
                </View>
              </View>
            </View>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>User Management</Text>
                <Text style={styles.subtitle}>Manage accounts, roles, and access control.</Text>
              </View>

              {editingUser ? (
                <View style={styles.editBox}>
                  <Text style={styles.editTitle}>Edit User: {editingUser.email}</Text>
                  
                  <Text style={styles.label}>FULL NAME</Text>
                  <TextInput style={styles.input} value={editingUser.fullName} onChangeText={(t) => setEditingUser({...editingUser, fullName: t})} />
                  
                  <Text style={styles.label}>ROLE (student | instructor | admin)</Text>
                  <TextInput style={styles.input} value={editingUser.role} onChangeText={(t) => setEditingUser({...editingUser, role: t})} />
                  
                  <Text style={styles.label}>STATUS (active | blocked)</Text>
                  <TextInput style={styles.input} value={editingUser.status} onChangeText={(t) => setEditingUser({...editingUser, status: t})} />

                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={handleUpdateUser}>
                      <Text style={styles.btnPrimaryText}>Save Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary} onPress={() => setEditingUser(null)}>
                      <Text style={styles.btnSecondaryText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 2 }]}>Name</Text>
                    <Text style={[styles.th, { flex: 2 }]}>Email</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Role</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Status</Text>
                    <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Actions</Text>
                  </View>
                  {users.map(user => (
                    <View key={user._id} style={styles.tr}>
                      <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>{user.fullName}</Text>
                      <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>{user.email}</Text>
                      <Text style={[styles.td, { flex: 1, textTransform: 'capitalize', fontWeight: 'bold', color: user.role === 'admin' ? '#7C3AED' : '#64748b' }]}>{user.role || 'Student'}</Text>
                      <Text style={[styles.td, { flex: 1, color: user.status === 'blocked' ? '#EF4444' : '#10B981' }]}>{user.status || 'Active'}</Text>
                      <View style={[styles.td, { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }]}>
                        <TouchableOpacity onPress={() => setEditingUser(user)}>
                          <Ionicons name="create-outline" size={20} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteUser(user._id)}>
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>Course Content Management</Text>
                <Text style={styles.subtitle}>Super Admin direct content override system.</Text>
              </View>
              
              <View style={styles.emptyState}>
                <Ionicons name="construct" size={48} color="#94a3b8" />
                <Text style={styles.emptyText}>Course Editor Interface</Text>
                <Text style={styles.emptySub}>Full course CMS is being migrated to the new schema.</Text>
                <TouchableOpacity style={[styles.btnPrimary, { marginTop: 20 }]}>
                  <Text style={styles.btnPrimaryText}>Add New Course</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>System Configuration</Text>
                <Text style={styles.subtitle}>Global platform settings, UI configurations, and API keys.</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => setEditingSetting({ key: '', value: '' })}>
                  <Text style={styles.btnPrimaryText}>+ New Setting</Text>
                </TouchableOpacity>
              </View>

              {editingSetting ? (
                <View style={[styles.editBox, { marginTop: 20 }]}>
                  <Text style={styles.label}>CONFIGURATION KEY</Text>
                  <TextInput style={styles.input} value={editingSetting.key} onChangeText={(t) => setEditingSetting({...editingSetting, key: t})} placeholder="e.g. HERO_BANNER_TEXT" />
                  
                  <Text style={styles.label}>CONFIGURATION VALUE</Text>
                  <TextInput style={styles.input} value={editingSetting.value} onChangeText={(t) => setEditingSetting({...editingSetting, value: t})} placeholder="Value string or JSON" />
                  
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveSetting}>
                      <Text style={styles.btnPrimaryText}>Save Setting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary} onPress={() => setEditingSetting(null)}>
                      <Text style={styles.btnSecondaryText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={[styles.table, { marginTop: 20 }]}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 1 }]}>Key</Text>
                    <Text style={[styles.th, { flex: 2 }]}>Value</Text>
                    <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Actions</Text>
                  </View>
                  {settings.length === 0 && (
                     <View style={{ padding: 20, alignItems: 'center' }}><Text style={{color: '#94a3b8'}}>No custom settings configured yet.</Text></View>
                  )}
                  {settings.map(s => (
                    <View key={s._id} style={styles.tr}>
                      <Text style={[styles.td, { flex: 1, fontWeight: 'bold' }]}>{s.key}</Text>
                      <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>{String(s.value)}</Text>
                      <View style={[styles.td, { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }]}>
                        <TouchableOpacity onPress={() => setEditingSetting(s)}>
                          <Ionicons name="create-outline" size={20} color="#3B82F6" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
          {/* CONNECTIONS TAB */}
          {activeTab === 'payment' && (
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>External Ecosphere</Text>
                <Text style={styles.subtitle}>Connect global learning platforms to enable cross-platform discovery.</Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
                {[
                  { name: 'Coursera', color: '#0056D2', icon: 'logo-google' },
                  { name: 'Udemy', color: '#A435F0', icon: 'play-circle' },
                  { name: 'YouTube Learning', color: '#FF0000', icon: 'logo-youtube' },
                  { name: 'LinkedIn Learning', color: '#0077B5', icon: 'logo-linkedin' },
                ].map(plat => (
                  <View key={plat.name} style={{ flex: 1, minWidth: 200, backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' }}>
                    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: plat.color, justifyContent: 'center', alignItems: 'center', marginBottom: 15 }}>
                      <Ionicons name={plat.icon} size={30} color="#fff" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 15 }}>{plat.name}</Text>
                    <TouchableOpacity style={styles.btnSecondary}>
                      <Text style={styles.btnSecondaryText}>Connect API</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* DEVELOPER TAB */}
          {activeTab === 'dev' && (
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>Server Orchestration</Text>
                <Text style={styles.subtitle}>Switch between backend instances for scaling tests.</Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
                <TouchableOpacity 
                  onPress={() => switchBackend('node')}
                  style={[styles.statCard, { backgroundColor: getActiveBackend().includes('Node') ? '#7C3AED' : '#fff', borderWidth: 1, borderColor: '#e2e8f0' }]}
                >
                  <Ionicons name="logo-nodejs" size={24} color={getActiveBackend().includes('Node') ? '#fff' : '#7C3AED'} />
                  <Text style={[styles.statLabel, { marginTop: 15, color: getActiveBackend().includes('Node') ? '#fff' : '#1e293b' }]}>Node.js Backend</Text>
                  <Text style={[styles.statSub, { color: getActiveBackend().includes('Node') ? 'rgba(255,255,255,0.8)' : '#64748b' }]}>Port 5000 • Express</Text>
                  {getActiveBackend().includes('Node') && <View style={{ position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>ACTIVE</Text></View>}
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => switchBackend('java')}
                  style={[styles.statCard, { backgroundColor: getActiveBackend().includes('Java') ? '#7C3AED' : '#fff', borderWidth: 1, borderColor: '#e2e8f0' }]}
                >
                  <Ionicons name="cafe" size={24} color={getActiveBackend().includes('Java') ? '#fff' : '#7C3AED'} />
                  <Text style={[styles.statLabel, { marginTop: 15, color: getActiveBackend().includes('Java') ? '#fff' : '#1e293b' }]}>Java Backend</Text>
                  <Text style={[styles.statSub, { color: getActiveBackend().includes('Java') ? 'rgba(255,255,255,0.8)' : '#64748b' }]}>Port 8080 • Spring Boot</Text>
                  {getActiveBackend().includes('Java') && <View style={{ position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>ACTIVE</Text></View>}
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>* Switching triggers a platform reload.</Text>
            </View>
          )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  main: { flex: 1, flexDirection: 'row' },
  mainMobile: { flexDirection: 'column' },
  sidebar: { width: 280, backgroundColor: '#fff', borderRightWidth: 1, borderColor: '#e2e8f0', padding: 24 },
  sidebarMobile: { width: '100%', padding: 15, borderRightWidth: 0, borderBottomWidth: 1 },
  sidebarTitle: { fontSize: 20, fontWeight: '900', color: '#1e293b', marginBottom: 30, letterSpacing: -0.5 },
  tabs: { gap: 10 },
  tabsMobile: { flexDirection: 'row', gap: 10 },
  tab: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12 },
  tabActive: { backgroundColor: '#f1f5f9' },
  tabItemMobile: { paddingHorizontal: 15, paddingVertical: 10 },
  tabIconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  tabIconBoxActive: { backgroundColor: '#eef2ff' },
  tabText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#1e293b', fontWeight: '700' },
  content: { flex: 1 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', color: '#1e293b', letterSpacing: -1 },
  subtitle: { fontSize: 15, color: '#64748b', marginTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  statCard: { flex: 1, minWidth: 200, padding: 24, borderRadius: 20, position: 'relative', overflow: 'hidden' },
  statIcon: { position: 'absolute', right: 20, top: 20, opacity: 0.2 },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  statValue: { color: '#fff', fontSize: 36, fontWeight: '900', marginTop: 10 },
  statSub: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 5, fontWeight: '500' },
  table: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  th: { fontSize: 12, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },
  tr: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9', alignItems: 'center' },
  td: { fontSize: 14, color: '#1e293b', fontWeight: '500' },
  editBox: { backgroundColor: '#fff', padding: 30, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  editTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', padding: 14, borderRadius: 12, fontSize: 15, marginBottom: 20, color: '#1e293b', fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 15 },
  btnPrimary: { backgroundColor: '#7C3AED', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  btnSecondary: { backgroundColor: '#f1f5f9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  btnSecondaryText: { color: '#475569', fontWeight: '800', fontSize: 14 },
  emptyState: { backgroundColor: '#fff', padding: 40, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginTop: 15 },
  emptySub: { fontSize: 14, color: '#64748b', marginTop: 5 }
});
