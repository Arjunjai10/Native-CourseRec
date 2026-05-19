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
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingSetting, setEditingSetting] = useState(null);
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [courseSearch, setCourseSearch] = useState('');

  useEffect(() => {
    // Rely on global layout guard for basic auth, but still check role here
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        loadData();
      } else {
        router.replace('/home');
      }
    }
  }, []);


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
      alert(`⚠️ Connection Error: Failed to reach the API server. Please check your internet connection or server status.`);
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

  const handleSaveCourse = async () => {
    try {
      if (editingCourse._id) {
        await adminAPI.updateCourse(editingCourse._id, editingCourse);
        alert('Course updated successfully');
      } else {
        await adminAPI.createCourse(editingCourse);
        alert('Course created successfully');
      }
      setEditingCourse(null);
      loadData();
    } catch (err) {
      alert('Failed to save course');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await adminAPI.deleteCourse(id);
        alert('Course deleted');
        loadData();
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.category?.toLowerCase().includes(courseSearch.toLowerCase())
  );


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

  const handleDeleteSetting = async (id) => {
    if (window.confirm('Are you sure you want to delete this configuration?')) {
      try {
        await adminAPI.deleteSetting(id);
        alert('Setting deleted');
        loadData();
      } catch (err) {
        alert('Failed to delete setting');
      }
    }
  };

  const handleSaveConnection = async (platform, keys) => {
    try {
      setLoading(true);
      await adminAPI.updateSetting(`${platform.toUpperCase()}_API_CONFIG`, JSON.stringify(keys));
      alert(`${platform} connection configuration saved successfully!`);
      setConnectingPlatform(null);
      loadData();
    } catch (err) {
      alert(`Failed to save ${platform} configuration`);
    } finally {
      setLoading(false);
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
    { id: 'connections', label: 'Connections', icon: 'link-outline' }
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
                  <TextInput style={styles.input} value={editingUser.fullName} onChangeText={(t) => setEditingUser({ ...editingUser, fullName: t })} />

                  <Text style={styles.label}>ROLE (student | instructor | admin)</Text>
                  <TextInput style={styles.input} value={editingUser.role} onChangeText={(t) => setEditingUser({ ...editingUser, role: t })} />

                  <Text style={styles.label}>STATUS (active | blocked)</Text>
                  <TextInput style={styles.input} value={editingUser.status} onChangeText={(t) => setEditingUser({ ...editingUser, status: t })} />

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
                <Text style={styles.subtitle}>Direct system override for the platform's course library.</Text>
              </View>

              <View style={[styles.actionRow, { marginBottom: 20 }]}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Search courses by title or category..."
                  value={courseSearch}
                  onChangeText={setCourseSearch}
                />
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={() => setEditingCourse({ title: '', category: '', description: '', level: 'Beginner', rating: 4.5, studentsEnrolled: 0 })}
                >
                  <Text style={styles.btnPrimaryText}>Add Course</Text>
                </TouchableOpacity>
              </View>

              {editingCourse ? (
                <View style={styles.editBox}>
                  <Text style={styles.editTitle}>{editingCourse._id ? 'Edit Course' : 'Create New Course'}</Text>

                  <Text style={styles.label}>Course Title</Text>
                  <TextInput
                    style={styles.input}
                    value={editingCourse.title}
                    onChangeText={t => setEditingCourse({ ...editingCourse, title: t })}
                  />

                  <View style={{ flexDirection: 'row', gap: 15 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Category</Text>
                      <TextInput
                        style={styles.input}
                        value={editingCourse.category}
                        onChangeText={t => setEditingCourse({ ...editingCourse, category: t })}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Level</Text>
                      <TextInput
                        style={styles.input}
                        value={editingCourse.level}
                        onChangeText={t => setEditingCourse({ ...editingCourse, level: t })}
                      />
                    </View>
                  </View>

                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    multiline
                    value={editingCourse.description}
                    onChangeText={t => setEditingCourse({ ...editingCourse, description: t })}
                  />

                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveCourse}>
                      <Text style={styles.btnPrimaryText}>Save Course</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary} onPress={() => setEditingCourse(null)}>
                      <Text style={styles.btnSecondaryText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.th, { flex: 3 }]}>Title</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Category</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Level</Text>
                    <Text style={[styles.th, { flex: 1 }]}>Rating</Text>
                    <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Actions</Text>
                  </View>
                  {filteredCourses.slice(0, 50).map(course => (
                    <View key={course._id} style={styles.tr}>
                      <Text style={[styles.td, { flex: 3 }]} numberOfLines={1}>{course.title}</Text>
                      <Text style={[styles.td, { flex: 1 }]} numberOfLines={1}>{course.category}</Text>
                      <Text style={[styles.td, { flex: 1 }]}>{course.level}</Text>
                      <Text style={[styles.td, { flex: 1 }]}>⭐ {course.rating}</Text>
                      <View style={[styles.td, { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }]}>
                        <TouchableOpacity onPress={() => setEditingCourse(course)}>
                          <Ionicons name="create-outline" size={20} color="#3B82F6" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteCourse(course._id)}>
                          <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                  {filteredCourses.length > 50 && (
                    <View style={{ padding: 15, alignItems: 'center' }}>
                      <Text style={{ color: '#94a3b8', fontSize: 12 }}>Showing first 50 courses of {filteredCourses.length}</Text>
                    </View>
                  )}
                </View>
              )}
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
                  <Text style={styles.editTitle}>{editingSetting._id ? 'Edit Setting' : 'Create New Setting'}</Text>

                  <Text style={styles.label}>CONFIGURATION KEY</Text>
                  <TextInput style={styles.input} value={editingSetting.key} onChangeText={(t) => setEditingSetting({ ...editingSetting, key: t })} placeholder="e.g. HERO_BANNER_TEXT" />

                  <Text style={styles.label}>CONFIGURATION VALUE</Text>
                  <TextInput style={styles.input} value={editingSetting.value} onChangeText={(t) => setEditingSetting({ ...editingSetting, value: t })} placeholder="Value string or JSON" />

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
                <View>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                    <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '700', width: '100%', marginBottom: 5 }}>QUICK PRESETS:</Text>
                    {[
                      { k: 'PLATFORM_NAME', v: 'EduLearn Pro' },
                      { k: 'HERO_TITLE', v: 'Master Your Future' },
                      { k: 'MAINTENANCE_MODE', v: 'false' },
                      { k: 'THEME_COLOR', v: '#7C3AED' }
                    ].map(preset => (
                      <TouchableOpacity
                        key={preset.k}
                        style={{ backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}
                        onPress={() => setEditingSetting({ key: preset.k, value: preset.v })}
                      >
                        <Text style={{ color: '#475569', fontSize: 12, fontWeight: '800' }}>+ {preset.k}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={[styles.table, { marginTop: 20 }]}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.th, { flex: 1 }]}>Key</Text>
                      <Text style={[styles.th, { flex: 2 }]}>Value</Text>
                      <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Actions</Text>
                    </View>
                    {settings.length === 0 && (
                      <View style={{ padding: 40, alignItems: 'center' }}>
                        <Ionicons name="settings-outline" size={40} color="#e2e8f0" />
                        <Text style={{ color: '#94a3b8', marginTop: 10 }}>No custom settings configured yet.</Text>
                      </View>
                    )}
                    {settings.map(s => (
                      <View key={s._id} style={styles.tr}>
                        <Text style={[styles.td, { flex: 1, fontWeight: 'bold' }]}>{s.key}</Text>
                        <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>{String(s.value)}</Text>
                        <View style={[styles.td, { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }]}>
                          <TouchableOpacity onPress={() => setEditingSetting(s)}>
                            <Ionicons name="create-outline" size={20} color="#3B82F6" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDeleteSetting(s._id)}>
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
          {/* CONNECTIONS TAB */}
          {activeTab === 'connections' && (
            <View>
              <View style={styles.header}>
                <Text style={styles.title}>External Ecosphere</Text>
                <Text style={styles.subtitle}>Connect global learning platforms to enable cross-platform discovery.</Text>
              </View>

              {connectingPlatform ? (
                <View style={styles.editBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: connectingPlatform.color, justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
                      <Ionicons name={connectingPlatform.icon} size={20} color="#fff" />
                    </View>
                    <Text style={styles.editTitle}>Configure {connectingPlatform.name}</Text>
                  </View>

                  <Text style={styles.label}>CLIENT ID / API KEY</Text>
                  <TextInput style={styles.input} placeholder="Enter platform API key" />

                  <Text style={styles.label}>CLIENT SECRET</Text>
                  <TextInput style={styles.input} secureTextEntry placeholder="Enter platform secret" />

                  <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: connectingPlatform.color }]} onPress={() => handleSaveConnection(connectingPlatform.name, { apiKey: '...', secret: '...' })}>
                      <Text style={styles.btnPrimaryText}>Save Connection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary} onPress={() => setConnectingPlatform(null)}>
                      <Text style={styles.btnSecondaryText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>
                  {[
                    { name: 'Coursera', color: '#0056D2', icon: 'school' },
                    { name: 'Udemy', color: '#A435F0', icon: 'play-circle' },
                    { name: 'YouTube Learning', color: '#FF0000', icon: 'logo-youtube' },
                    { name: 'LinkedIn Learning', color: '#0077B5', icon: 'logo-linkedin' },
                  ].map(plat => {
                    const isConnected = settings.some(s => s.key === `${plat.name.toUpperCase()}_API_CONFIG`);
                    return (
                      <View key={plat.name} style={{ flex: 1, minWidth: 220, backgroundColor: '#fff', borderRadius: 24, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: isConnected ? plat.color : '#e2e8f0', shadowColor: isConnected ? plat.color : '#000', shadowOpacity: 0.05, shadowRadius: 10 }}>
                        <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: plat.color, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                          <Ionicons name={plat.icon} size={35} color="#fff" />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 5 }}>{plat.name}</Text>
                        <Text style={{ fontSize: 12, color: isConnected ? '#10B981' : '#94a3b8', fontWeight: '700', marginBottom: 20 }}>{isConnected ? '● CONNECTED' : '○ DISCONNECTED'}</Text>
                        <TouchableOpacity style={[styles.btnSecondary, isConnected && { borderColor: plat.color }]} onPress={() => setConnectingPlatform(plat)}>
                          <Text style={[styles.btnSecondaryText, isConnected && { color: plat.color }]}>{isConnected ? 'Update API' : 'Connect API'}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
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
