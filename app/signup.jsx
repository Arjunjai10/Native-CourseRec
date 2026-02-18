import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const INTERESTS = [
  { id: 'data-science', label: 'Data Science', icon: 'analytics' },
  { id: 'design', label: 'Design', icon: 'color-palette' },
  { id: 'business', label: 'Business', icon: 'briefcase' },
  { id: 'development', label: 'Development', icon: 'code-slash' },
];

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [error, setError] = useState('');

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSignUp = async () => {
    try {
      setError('');
      
      if (!fullName || !email || !password) {
        setError('Please fill all fields');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        fullName,
        email,
        password,
        interests: selectedInterests,
      });
      
      if (response.data.token) {
        router.push('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#9333EA', '#7C3AED']}
          style={styles.leftPanel}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="book" size={48} color="white" />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Start your learning{'\n'}journey.</Text>
            <Text style={styles.heroSubtitle}>
              Join 10,000+ learners today and access thousands of courses from industry experts. Your future starts here.
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1k+</Text>
                <Text style={styles.statLabel}>Verified Tutors</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5k+</Text>
                <Text style={styles.statLabel}>Active Courses</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.rightPanel}>
          <View style={styles.formContainer}>
            <View style={styles.header}>
              <Ionicons name="school" size={32} color="#7C3AED" />
              <Text style={styles.logoText}>EduLearn</Text>
              <TouchableOpacity onPress={() => router.push('/signin')} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Log in</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>Join the community and start learning today.</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.interestsContainer}>
              <Text style={styles.label}>Select your interests</Text>
              <View style={styles.interestsGrid}>
                {INTERESTS.map(interest => (
                  <TouchableOpacity
                    key={interest.id}
                    style={[
                      styles.interestChip,
                      selectedInterests.includes(interest.id) && styles.interestChipSelected
                    ]}
                    onPress={() => toggleInterest(interest.id)}
                  >
                    <Ionicons
                      name={interest.icon}
                      size={20}
                      color={selectedInterests.includes(interest.id) ? '#7C3AED' : '#666'}
                    />
                    <Text style={[
                      styles.interestText,
                      selectedInterests.includes(interest.id) && styles.interestTextSelected
                    ]}>
                      {interest.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleSignUp}>
              <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By signing up, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  leftPanel: {
    flex: 1,
    padding: 40,
    justifyContent: 'space-between',
    minHeight: Platform.OS === 'web' ? 'auto' : 300,
  },
  logoContainer: {
    alignItems: 'center',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'white',
    lineHeight: 28,
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'white',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
    flex: 1,
    marginLeft: 8,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loginButtonText: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    marginBottom: 24,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  interestsContainer: {
    marginBottom: 24,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  interestChipSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
  },
  interestText: {
    color: '#333',
  },
  interestTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  terms: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 16,
  },
  termsLink: {
    color: '#7C3AED',
  },
});
