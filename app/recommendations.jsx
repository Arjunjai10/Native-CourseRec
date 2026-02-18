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

const RECENT_CHATS = [
  { id: 1, title: 'UI/UX Design Path', active: true },
  { id: 2, title: 'Data Science Basics', active: false },
  { id: 3, title: 'Graphic Design 101', active: false },
  { id: 4, title: 'Python for Beginners', active: false },
];

const SAMPLE_COURSES = [
  {
    id: 1,
    title: 'Introduction to Figma Masterclass',
    instructor: 'Jane Doe, Senior Designer',
    rating: 4.9,
    category: 'FIGMA',
    thumbnail: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'UX Fundamentals & Accessibility',
    instructor: 'Google Design Team',
    rating: 4.8,
    category: 'FUNDAMENTALS',
    thumbnail: 'https://via.placeholder.com/300x200',
  },
];

export default function Recommendations() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello Alex! I'm your EduLearn assistant. What would you like to learn today?",
    },
    {
      id: 2,
      type: 'user',
      text: "I'm looking for a beginner-level course on UI/UX design. I'm specifically interested in Figma and accessibility fundamentals.",
    },
    {
      id: 3,
      type: 'ai',
      text: 'Great choice! Based on your interest in design and accessibility, I found these top-rated courses that are perfect for beginners:',
      courses: SAMPLE_COURSES,
    },
    {
      id: 4,
      type: 'ai',
      text: 'The Figma course is hands-on and will get you building prototypes by day 3. The Google course is exceptional for learning inclusive design principles. Which one sounds more interesting?',
    },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), type: 'user', text: message }]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={28} color="#7C3AED" />
            <View>
              <Text style={styles.logoText}>EduLearn</Text>
              <Text style={styles.logoSubtext}>AI Course Assistant</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.newChatButton}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.newChatButtonText}>New Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentChats}>
          <Text style={styles.sectionTitle}>RECENT LEARNING</Text>
          {RECENT_CHATS.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={[styles.chatItem, chat.active && styles.chatItemActive]}
            >
              <Ionicons
                name="chatbubble"
                size={20}
                color={chat.active ? '#7C3AED' : '#666'}
              />
              <Text style={[styles.chatItemText, chat.active && styles.chatItemTextActive]}>
                {chat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings-outline" size={20} color="#666" />
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: 'https://via.placeholder.com/40' }}
              style={styles.userAvatar}
            />
            <View>
              <Text style={styles.userName}>Alex Johnson</Text>
              <Text style={styles.userStatus}>Premium Member</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="sparkles" size={24} color="#7C3AED" />
            <Text style={styles.headerTitle}>UI/UX Design Path</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="help-circle-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.userButton}>
              <Text style={styles.userButtonText}>AJ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.chatArea}>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageContainer}>
              {msg.type === 'ai' ? (
                <View style={styles.aiMessage}>
                  <View style={styles.aiAvatar}>
                    <Ionicons name="school" size={24} color="white" />
                  </View>
                  <View style={styles.messageContent}>
                    <Text style={styles.aiLabel}>EDULEARN AI</Text>
                    <Text style={styles.messageText}>{msg.text}</Text>
                    
                    {msg.courses && (
                      <View style={styles.coursesContainer}>
                        {msg.courses.map((course) => (
                          <TouchableOpacity
                            key={course.id}
                            style={styles.courseCard}
                            onPress={() => router.push(`/course/${course.id}`)}
                          >
                            <Image
                              source={{ uri: course.thumbnail }}
                              style={styles.courseThumbnail}
                            />
                            <View style={styles.courseInfo}>
                              <View style={styles.courseCategory}>
                                <Text style={styles.courseCategoryText}>{course.category}</Text>
                              </View>
                              <Text style={styles.courseTitle}>{course.title}</Text>
                              <Text style={styles.courseInstructor}>{course.instructor}</Text>
                              <View style={styles.courseRating}>
                                <Ionicons name="star" size={16} color="#F59E0B" />
                                <Text style={styles.ratingText}>{course.rating}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ) : (
                <View style={styles.userMessage}>
                  <View style={styles.userMessageBubble}>
                    <Text style={styles.userLabel}>YOU</Text>
                    <Text style={styles.userMessageText}>{msg.text}</Text>
                  </View>
                  <View style={styles.userAvatarContainer}>
                    <Ionicons name="person" size={20} color="white" />
                  </View>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask EduLearn anything about your learning path..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.voiceButton}>
            <Ionicons name="mic" size={20} color="#666" />
            <Text style={styles.voiceText}>VOICE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaButton}>
            <Ionicons name="images" size={20} color="#666" />
            <Text style={styles.mediaText}>MEDIA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.aiFooter}>Powered by EduLearn AI 4.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
  },
  sidebar: {
    width: 280,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
  },
  sidebarHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoSubtext: {
    fontSize: 12,
    color: '#666',
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    padding: 12,
  },
  newChatButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  recentChats: {
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  chatItemActive: {
    backgroundColor: '#F3E8FF',
  },
  chatItemText: {
    fontSize: 14,
    color: '#666',
  },
  chatItemTextActive: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginBottom: 12,
  },
  settingsText: {
    fontSize: 14,
    color: '#666',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  userStatus: {
    fontSize: 12,
    color: '#666',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  userButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  chatArea: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 24,
  },
  aiMessage: {
    flexDirection: 'row',
    gap: 12,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContent: {
    flex: 1,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  coursesContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  courseCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  courseThumbnail: {
    width: '100%',
    height: 150,
  },
  courseInfo: {
    padding: 12,
  },
  courseCategory: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  courseCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7C3AED',
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  courseRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  userMessage: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  userMessageBubble: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    maxWidth: '70%',
  },
  userLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  userMessageText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'white',
  },
  userAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    gap: 12,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    fontSize: 14,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  voiceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  mediaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiFooter: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    padding: 12,
    backgroundColor: 'white',
  },
});
