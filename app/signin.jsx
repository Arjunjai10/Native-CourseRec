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
import { authAPI } from './utils/api';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      setError('');
      const response = await authAPI.login(email, password);

      if (response.data.token && response.data.user) {
        if (Platform.OS === 'web') {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        router.push('/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#7C3AED', '#3B82F6']}
          style={styles.leftPanel}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={32} color="white" />
            <Text style={styles.logoText}>EduLearn</Text>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Discover Your{'\n'}Future with EduLearn.</Text>
            <Text style={styles.heroSubtitle}>
              Intelligent course recommendations tailored to your career goals. We find the best content across the web so you don't have to.
            </Text>
          </View>

          <Text style={styles.copyright}>© 2024 EduLearn Inc. All rights reserved.</Text>
        </LinearGradient>

        <View style={styles.rightPanel}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign In</Text>
            <View style={styles.signupPrompt}>
              <Text style={styles.promptText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <Text style={styles.linkText}>Join for free.</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={20} color="#666" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={20} color="#0077B5" />
                <Text style={styles.socialButtonText}>LinkedIn</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Terms of Service</Text></TouchableOpacity>
              <TouchableOpacity><Text style={styles.footerLink}>Help Center</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  leftPanel: {
    flex: 1,
    padding: 48,
    justifyContent: 'space-between',
    minHeight: Platform.OS === 'web' ? 'auto' : 300,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: 'white',
    marginBottom: 20,
    lineHeight: 52,
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 28,
  },
  copyright: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  signupPrompt: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  promptText: {
    color: '#64748B',
    fontSize: 14,
  },
  linkText: {
    color: '#7C3AED',
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotText: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#FAFAFA',
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingRight: 14,
    backgroundColor: '#FAFAFA',
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#1E293B',
    ...Platform.select({ web: { outlineStyle: 'none' } }),
  },
  signInButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({ web: { boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)' } }),
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#94A3B8',
    fontSize: 13,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 13,
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 28,
  },
  footerLink: {
    color: '#94A3B8',
    fontSize: 13,
  },
});
