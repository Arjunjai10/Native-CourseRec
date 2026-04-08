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
import Navbar from './components/Navbar';
import { LinearGradient } from 'expo-linear-gradient';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export default function Recommendations() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [availableCoursesText, setAvailableCoursesText] = useState('');
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      type: 'ai',
      text: "Hello! I'm your EduLearn AI assistant. I'm ready to help you discover the perfect courses for your journey. What would you like to learn today?",
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
          userId = storedUser.id || storedUser._id;

          // Load chat history from localStorage
          const savedHistory = localStorage.getItem(`chat_history_${userId}`);
          if (savedHistory) {
              setChatHistory(JSON.parse(savedHistory));
          }
        }

        const results = await Promise.all([courseAPI.getAll(), userAPI.getProfile(userId)]);
        const coursesData = results[0].data;
        setAllCourses(coursesData);
        setUser(results[1].data);

        const catalogString = coursesData.reduce((acc, course) => {
          const category = course.category || 'Uncategorized';
          if (!acc[category]) acc[category] = [];
          acc[category].push(`- ${course.title} (${course.level || 'All Levels'})`);
          return acc;
        }, {});

        const formattedCatalog = Object.entries(catalogString)
          .map(([category, courses]) => `${category} (${courses.length} courses):\n${courses.slice(0, 40).join('\n')}`)
          .join('\n\n');

        setAvailableCoursesText(formattedCatalog);

        // Personalize the first message if it's a new session and user has interests
        if (!activeSessionId) {
          const interestsStr = (results[1].data.interests || []).join(', ');
          if (interestsStr) {
            setMessages(prev => [
              {
                ...prev[0],
                text: `Hello ${results[1].data.fullName.split(' ')[0]}! I see you're interested in ${interestsStr}. How can I help you build your custom learning path today?`
              }
            ]);
          }
        }

      } catch (error) {
        console.error("Failed to initialize assistant:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChat();
  }, []);

  const saveToHistory = (newMessages) => {
      if (Platform.OS !== 'web' || !user) return;
      const userId = user.id || user._id;
      const newHistory = [...chatHistory];
      const sessionIndex = newHistory.findIndex(h => h.id === activeSessionId);

      const firstUserMsg = newMessages.find(m => m.type === 'user')?.text || 'New Session';
      const sessionData = {
          id: activeSessionId || Date.now(),
          title: firstUserMsg.substring(0, 30) + (firstUserMsg.length > 30 ? '...' : ''),
          messages: newMessages,
          date: new Date().toISOString()
      };

      if (sessionIndex > -1) {
          newHistory[sessionIndex] = sessionData;
      } else {
          newHistory.unshift(sessionData);
          setActiveSessionId(sessionData.id);
      }

      setChatHistory(newHistory);
      localStorage.setItem(`chat_history_${userId}`, JSON.stringify(newHistory));
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([
      {
        id: Date.now(),
        type: 'ai',
        text: "Hello! I'm your EduLearn AI assistant. What would you like to discover today?",
      },
    ]);
    setMessage('');
  };

  const loadSession = (session) => {
      setActiveSessionId(session.id);
      setMessages(session.messages);
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    const userMessage = message.trim();
    const updatedMessages = [...messages, { id: Date.now(), type: 'user', text: userMessage }];
    setMessages(updatedMessages);
    setMessage('');
    setIsLoading(true);

    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      setMessages([...updatedMessages, { id: Date.now() + 1, type: 'ai', text: "⚠️ No Gemini API key found. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file and restart the server." }]);
      setIsLoading(false);
      return;
    }

    const systemPrompt = `You are the Senior EduTech Advisor at EduLearn. You have a deep catalog of courses: ${availableCoursesText}. 
    
The user has explicitly selected these career interests: ${user?.interests?.join(', ') || 'Not specified yet'}.

When a user asks for a recommendation or a career goal (like "fullstack developer" or "data scientist"), create a structured, multi-staged learning path using course titles from the catalog that align with their interests where possible. 

Format your response clearly with:
1. An encouraging introduction mentioning their known interests if relevant.
2. A clear learning path (numbered list).
3. Why you chose those specific courses based on their profile.

User says: "${userMessage}"`;

    const tryModel = async (modelName) => {
      // All Gemini models use v1beta for generateContent
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        }),
      });
      return resp;
    };

    try {
      // Use current stable models (v1beta endpoint)
      const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
      let response = null;
      let lastError = null;

      for (const model of modelsToTry) {
        try {
          response = await tryModel(model);
          console.log(`[AI] ${model} responded with status: ${response.status}`);
          if (response.ok) break;
          const errBody = await response.clone().json();
          lastError = errBody?.error?.message || `HTTP ${response.status}`;
          console.warn(`[AI] ${model} failed: ${lastError}`);
          response = null;
        } catch (e) {
          console.warn(`[AI] ${model} threw: ${e.message}`);
          lastError = e.message;
          response = null;
        }
      }

      if (!response || !response.ok) {
        throw new Error(lastError || 'All AI models failed');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again.";
      const finalMessages = [...updatedMessages, { id: Date.now() + 1, type: 'ai', text: aiResponse }];
      setMessages(finalMessages);
      saveToHistory(finalMessages);
    } catch (error) {
      console.error("AI Assistant Error:", error.message);
      setMessages([...updatedMessages, { 
        id: Date.now() + 1, 
        type: 'ai', 
        text: `⚠️ AI Error: ${error.message}. Please ensure your Gemini API key is enabled at aistudio.google.com.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };


  const scrollViewRef = useRef(null);

  const extractRecommendedCourses = (text) => {
    if (!text) return [];
    return allCourses.filter(course => text.toLowerCase().includes(course.title.toLowerCase())).slice(0, 4);
  };

  if (isInitializing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const renderMessageContent = (msg) => {
    const recommended = msg.type === 'ai' ? extractRecommendedCourses(msg.text) : [];
    
    return (
      <View key={msg.id} style={[styles.msgContainer, msg.type === 'user' ? styles.userMsgCont : styles.aiMsgCont]}>
        {msg.type === 'ai' && (
          <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={16} color="white" />
          </LinearGradient>
        )}
        <View style={msg.type === 'user' ? styles.userContainer : styles.aiContainer}>
          <View style={[styles.msgBubble, msg.type === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.msgText, msg.type === 'user' ? styles.userMsgText : styles.aiMsgText]}>{msg.text}</Text>
          </View>
          
          {recommended.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.recommendedScroll}
              contentContainerStyle={styles.recommendedContent}
            >
              {recommended.map(course => (
                <TouchableOpacity 
                  key={course._id || course.id} 
                  style={styles.recCard}
                  onPress={() => router.push(`/course/${course._id || course.id}`)}
                >
                  <View style={[styles.recIconBox, { backgroundColor: course.thumbnailColor || '#7C3AED' }]}>
                    <Ionicons name={course.thumbnail || 'book'} size={18} color="white" />
                  </View>
                  <View style={styles.recInfo}>
                    <Text style={styles.recTitle} numberOfLines={1}>{course.title}</Text>
                    <View style={styles.recMeta}>
                      <Text style={styles.recLevel}>{course.level}</Text>
                      <View style={styles.recDot} />
                      <Text style={styles.recRating}>★ {course.rating}</Text>
                    </View>
                  </View>
                  <Ionicons name="arrow-forward" size={14} color="#7C3AED" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.appArea}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
              <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.newChatGradient}>
                 <Ionicons name="add" size={20} color="white" />
                 <Text style={styles.newChatButtonText}>New Session</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.recentChats} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>SESSION HISTORY</Text>
            {chatHistory.map((chat) => (
              <TouchableOpacity 
                key={chat.id} 
                style={[styles.chatItem, activeSessionId === chat.id && styles.chatItemActive]}
                onPress={() => loadSession(chat)}
              >
                <View style={[styles.chatDot, activeSessionId === chat.id && styles.chatDotActive]} />
                <Text style={[styles.chatItemText, activeSessionId === chat.id && styles.chatItemTextActive]} numberOfLines={1}>{chat.title}</Text>
              </TouchableOpacity>
            ))}
            {chatHistory.length === 0 && (
                <Text style={styles.emptyHistory}>No previous sessions found.</Text>
            )}
          </ScrollView>

          <View style={styles.sidebarFooter}>
            <View style={styles.userPod}>
               <View style={styles.userDot} />
               <View>
                  <Text style={styles.userName}>{user ? user.fullName : 'Learner'}</Text>
                  <Text style={styles.userStatus}>Online Now</Text>
               </View>
            </View>
          </View>
        </View>

        <View style={styles.mainContent}>
            <ScrollView
              style={styles.chatArea}
              ref={scrollViewRef}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              contentContainerStyle={{ padding: 25 }}
            >
              {messages.map((msg) => renderMessageContent(msg))}
              {isLoading && (
               <View style={styles.loadingBox}>
                  <ActivityIndicator size="small" color="#7C3AED" />
                  <Text style={styles.loadingText}>Analyzing path...</Text>
               </View>
            )}
          </ScrollView>

          <View style={styles.inputArea}>
            <View style={styles.inputWrapper}>
               <TextInput
                 style={styles.input}
                 placeholder="Search for your ideal mastery path..."
                 placeholderTextColor="#94a3b8"
                 value={message}
                 onChangeText={setMessage}
                 onSubmitEditing={sendMessage}
               />
               <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                 <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.sendGradient}>
                    <Ionicons name="paper-plane" size={18} color="white" />
                 </LinearGradient>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appArea: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#f8fafc',
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  sidebarHeader: {
    padding: 24,
  },
  newChatGradient: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 14,
     gap: 10,
     borderRadius: 20,
  },
  newChatButtonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  recentChats: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94a3b8',
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 4,
  },
  chatItemActive: {
     backgroundColor: '#fff',
     ...Platform.select({
       ios: {
         shadowColor: '#000',
         shadowOpacity: 0.05,
         shadowRadius: 10,
         shadowOffset: { width: 0, height: 4 },
       },
       android: {
         elevation: 2,
       },
       web: {
         boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
       }
     }),
  },
  chatDot: {
     width: 8,
     height: 8,
     borderRadius: 4,
     backgroundColor: '#cbd5e1',
     marginRight: 12,
  },
  chatDotActive: {
     backgroundColor: '#7C3AED',
  },
  chatItemText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '700',
  },
  chatItemTextActive: {
     color: '#1E293B',
  },
  emptyHistory: {
     fontSize: 12,
     color: '#94a3b8',
     fontStyle: 'italic',
     textAlign: 'center',
     marginTop: 20,
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  userPod: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#fff',
     padding: 12,
     borderRadius: 20,
     borderWidth: 1,
     borderColor: '#f1f5f9',
  },
  userDot: {
     width: 10,
     height: 10,
     borderRadius: 5,
     backgroundColor: '#10b981',
     marginRight: 12,
     marginLeft: 4,
  },
  userName: {
     fontSize: 14,
     fontWeight: '800',
     color: '#1e293b',
  },
  userStatus: {
     fontSize: 12,
     color: '#94a3b8',
     fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatArea: {
    flex: 1,
  },
  msgContainer: {
     flexDirection: 'row',
     marginBottom: 25,
     alignItems: 'flex-end',
  },
  userMsgCont: {
     justifyContent: 'flex-end',
  },
  aiMsgCont: {
     justifyContent: 'flex-start',
  },
  aiAvatar: {
     width: 32,
     height: 32,
     borderRadius: 12,
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: 12,
  },
  msgBubble: {
     maxWidth: '80%',
     paddingHorizontal: 20,
     paddingVertical: 14,
     borderRadius: 24,
  },
  userBubble: {
     backgroundColor: '#7C3AED',
     borderBottomRightRadius: 4,
  },
  aiBubble: {
     backgroundColor: '#f1f5f9',
     borderBottomLeftRadius: 4,
  },
  userContainer: {
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  aiContainer: {
    alignItems: 'flex-start',
    maxWidth: '85%',
  },
  recommendedScroll: {
    marginTop: 12,
    flexDirection: 'row',
  },
  recommendedContent: {
    paddingRight: 20,
    gap: 12,
  },
  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: 240,
    ...Platform.select({
      web: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
    })
  },
  recIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recInfo: {
    flex: 1,
  },
  recTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  recMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recLevel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  recDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 6,
  },
  recRating: {
    fontSize: 10,
    color: '#f59e0b',
    fontWeight: '800',
  },
  msgText: {
     fontSize: 15,
     lineHeight: 22,
     fontWeight: '500',
  },
  userMsgText: {
     color: '#fff',
  },
  aiMsgText: {
     color: '#1e293b',
  },
  loadingBox: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: 20,
     gap: 10,
  },
  loadingText: {
     fontSize: 14,
     color: '#64748b',
     fontStyle: 'italic',
  },
  inputArea: {
     padding: 25,
     borderTopWidth: 1,
     borderTopColor: '#f1f5f9',
  },
  inputWrapper: {
     flexDirection: 'row',
     backgroundColor: '#f8fafc',
     borderRadius: 24,
     padding: 6,
     alignItems: 'center',
  },
  input: {
     flex: 1,
     height: 50,
     paddingHorizontal: 20,
     fontSize: 15,
     fontWeight: '600',
     color: '#1e293b',
  },
  sendBtn: {
     marginRight: 6,
  },
  sendGradient: {
     width: 44,
     height: 44,
     borderRadius: 22,
     justifyContent: 'center',
     alignItems: 'center',
  }
});
