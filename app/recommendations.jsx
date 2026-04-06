import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { userAPI, courseAPI } from './utils/api';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export default function Recommendations() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [recentLearning, setRecentLearning] = useState([]);
  const [availableCoursesText, setAvailableCoursesText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm your EduLearn AI assistant. I can help you discover courses in programming, design, data science, business, and more. What would you like to learn today?",
    },
  ]);


  useEffect(() => {
    const initializeChat = async () => {
      try {
        let storedUser = null;
        let userId = null;
        if (Platform.OS === 'web') {
          const userStr = localStorage.getItem('user');
          if (!userStr) {
            router.replace('/signin');
            return;
          }
          storedUser = JSON.parse(userStr);
          setUser(storedUser);
          userId = storedUser.id;
        }

        const promises = [courseAPI.getAll()];
        if (userId) promises.push(userAPI.getProfile(userId));

        const results = await Promise.all(promises);
        const coursesData = results[0].data;
        setAllCourses(coursesData);

        if (userId && results[1]) {
          const userData = results[1].data;
          setUser(userData);
          // Set recent learning from enrolled courses, or default to recommended if none
          if (userData.enrolledCourses && userData.enrolledCourses.length > 0) {
            setRecentLearning(userData.enrolledCourses.map(c => ({ id: c._id, title: c.title, active: false })));
          } else {
            // Fallback to top few courses if no enrollments
            setRecentLearning(coursesData.slice(0, 4).map((c, i) => ({ id: c._id, title: c.title, active: i === 0 })));
          }
        } else {
          setRecentLearning(coursesData.slice(0, 4).map((c, i) => ({ id: c._id, title: c.title, active: i === 0 })));
        }

        // Build dynamic course catalog string for Gemini
        const catalogString = coursesData.reduce((acc, course) => {
          const category = course.category || 'Uncategorized';
          if (!acc[category]) acc[category] = [];
          acc[category].push(`- ${course.title} (${course.level || 'All Levels'})`);
          return acc;
        }, {});

        const formattedCatalog = Object.entries(catalogString)
          .map(([category, courses]) => `${category}:\n${courses.slice(0, 5).join('\n')}`) // limit to 5 per category to save tokens
          .join('\n\n');

        setAvailableCoursesText(formattedCatalog);

      } catch (error) {
        console.error("Failed to initialize course assistant data:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChat();
  }, []);


  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        text: "Hello! I'm your EduLearn AI assistant. I can help you discover courses in programming, design, data science, business, and more. What would you like to learn today?",
      },
    ]);
    setMessage('');
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    const userMessageObj = {
      id: Date.now(),
      type: 'user',
      text: userMessage
    };

    setMessages(prev => [...prev, userMessageObj]);
    setMessage('');
    setIsLoading(true);

    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined' || GEMINI_API_KEY === 'your_gemini_api_key_here') {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        text: "It looks like the AI API Key is missing. Please ask your developer to set 'EXPO_PUBLIC_GEMINI_API_KEY' in the project's .env file.",
      }]);
      setIsLoading(false);
      return;
    }

    try {
      const conversationHistory = messages
        .slice(-6)
        .map(msg => `${msg.type === 'user' ? 'Student' : 'EduLearn AI'}: ${msg.text}`)
        .join('\n');

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI course recommendation assistant for EduLearn, an online learning platform.

AVAILABLE COURSES ON EDULEARN:
${availableCoursesText}

YOUR ROLE:
- Help students find the perfect courses from the catalog above
- ALWAYS recommend specific courses by name when appropriate
- Be friendly, concise, and actionable
- After 1-2 clarifying questions, START RECOMMENDING specific courses from the catalog
- Format course recommendations clearly with bullet points

CONVERSATION HISTORY:
${conversationHistory}

STUDENT'S NEW MESSAGE: ${userMessage}

INSTRUCTIONS:
1. If this is their first meaningful query about what they want to learn, ask ONE clarifying question about their experience level or goals
2. If you already have enough context (e.g., they said "full stack developer" or "beginner"), immediately recommend 2-3 SPECIFIC courses from the catalog above
3. Use the exact course names from the catalog
4. Keep responses under 150 words
5. Be encouraging and specific

Respond now:`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;

        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          text: aiResponse,
        }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. In the meantime, you can browse our course catalog or check your profile!",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#741ce9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={28} color="#741ce9" />
            <View>
              <Text style={styles.logoText}>EduLearn</Text>
              <Text style={styles.logoSubtext}>AI Course Assistant</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.newChatButtonText}>New Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentChats}>
          <Text style={styles.sectionTitle}>RECENT LEARNING</Text>
          {recentLearning.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={[styles.chatItem, chat.active && styles.chatItemActive]}
            >
              <Ionicons
                name="chatbubble"
                size={20}
                color={chat.active ? '#741ce9' : '#666'}
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
            <View style={styles.userAvatarCircle}>
              <Text style={{ color: '#741ce9', fontWeight: 'bold' }}>{user ? user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{user ? user.fullName : 'Guest User'}</Text>
              <Text style={styles.userStatus}>{user ? 'Premium Member' : 'Sign in to save'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="sparkles" size={24} color="#741ce9" />
            <Text style={styles.headerTitle}>AI Course Assistant</Text>
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

        <ScrollView
          style={styles.chatArea}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
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

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.aiAvatar}>
                <Ionicons name="school" size={24} color="white" />
              </View>
              <View style={styles.loadingContent}>
                <Text style={styles.aiLabel}>EDULEARN AI</Text>
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color="#741ce9" />
                  <Text style={styles.typingText}>Thinking...</Text>
                </View>
              </View>
            </View>
          )}
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

        <Text style={styles.aiFooter}>Powered by Google Gemini AI</Text>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#741ce9',
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
    color: '#741ce9',
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
  userAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#741ce9',
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
    backgroundColor: '#741ce9',
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
    color: '#741ce9',
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
    backgroundColor: '#741ce9',
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
    backgroundColor: '#741ce9',
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
  loadingContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  loadingContent: {
    flex: 1,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});
