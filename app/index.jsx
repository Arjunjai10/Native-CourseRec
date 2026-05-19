import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Check if user is already logged in
    if (Platform.OS === 'web') {
      const token = localStorage.getItem('token');
      if (token) {
        // Optional: you might want to redirect to home if already logged in
        // router.replace('/home');
      }
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const FeatureCard = ({ icon, title, description }) => (
    <View style={styles.featureCard}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={32} color="#7C3AED" />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#7C3AED', '#3B82F6']}
            style={styles.logoIcon}
          >
            <Ionicons name="school" size={20} color="white" />
          </LinearGradient>
          <Text style={styles.logoText}>EduLearn</Text>
        </View>
        <View style={styles.navLinks}>
          {Platform.OS === 'web' && (
            <>
              <TouchableOpacity style={styles.navLink}><Text style={styles.navLinkText}>Courses</Text></TouchableOpacity>
              <TouchableOpacity style={styles.navLink}><Text style={styles.navLinkText}>About</Text></TouchableOpacity>
              <TouchableOpacity style={styles.navLink}><Text style={styles.navLinkText}>Contact</Text></TouchableOpacity>
            </>
          )}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/signin')}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.heroContent}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✨ The Future of Learning</Text>
            </View>
            <Text style={styles.heroTitle}>
              Master Any Skill with{'\n'}
              <Text style={styles.gradientText}>AI-Powered</Text> Learning
            </Text>
            <Text style={styles.heroSubtitle}>
              Experience a personalized learning journey. Our AI analyzes your goals and finds the best courses across the web, tailored just for you.
            </Text>
            <View style={styles.ctaButtons}>
              <TouchableOpacity 
                style={styles.primaryCta}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.primaryCtaText}>Get Started Free</Text>
                <Ionicons name="arrow-forward" size={18} color="white" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryCta}
                onPress={() => router.push('/courses')}
              >
                <Text style={styles.secondaryCtaText}>Explore Courses</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50k+</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1200+</Text>
                <Text style={styles.statLabel}>Courses</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>98%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroImageContainer}>
            <Image 
              source={require('../assets/landing_hero.png')} 
              style={styles.heroImage}
              resizeMode="contain"
            />
            <LinearGradient
              colors={['transparent', 'rgba(248, 250, 252, 0.8)', '#F8FAFC']}
              style={styles.imageOverlay}
            />
          </View>
        </Animated.View>

        {/* Features Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTag}>FEATURES</Text>
            <Text style={styles.sectionTitle}>Everything you need to succeed</Text>
          </View>
          <View style={styles.featuresGrid}>
            <FeatureCard 
              icon="rocket-outline"
              title="Personalized Paths"
              description="Customized learning journeys based on your skills, goals, and interests."
            />
            <FeatureCard 
              icon="chatbubble-ellipses-outline"
              title="AI Tutor"
              description="Our AI assistant is available 24/7 to answer your questions and guide you."
            />
            <FeatureCard 
              icon="stats-chart-outline"
              title="Smart Analytics"
              description="Track your progress with detailed insights and skill level tracking."
            />
          </View>
        </View>

        {/* Call to Action Section */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#7C3AED', '#4F46E5']}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.ctaTitle}>Ready to start your journey?</Text>
            <Text style={styles.ctaSubtitle}>Join thousands of students who are already learning with EduLearn.</Text>
            <TouchableOpacity 
              style={styles.ctaWhiteButton}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.ctaWhiteButtonText}>Create Account Now</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View style={styles.footerBrand}>
              <View style={styles.logoContainer}>
                <LinearGradient colors={['#7C3AED', '#3B82F6']} style={styles.logoIcon}>
                  <Ionicons name="school" size={16} color="white" />
                </LinearGradient>
                <Text style={styles.logoTextSmall}>EduLearn</Text>
              </View>
              <Text style={styles.footerDesc}>Making quality education accessible to everyone through AI.</Text>
            </View>
            <View style={styles.footerLinksGrid}>
              <View style={styles.footerLinkCol}>
                <Text style={styles.footerLinkTitle}>Platform</Text>
                <TouchableOpacity><Text style={styles.footerLinkText}>Browse Courses</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLinkText}>Pricing</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLinkText}>Features</Text></TouchableOpacity>
              </View>
              <View style={styles.footerLinkCol}>
                <Text style={styles.footerLinkTitle}>Company</Text>
                <TouchableOpacity><Text style={styles.footerLinkText}>About Us</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLinkText}>Careers</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.footerLinkText}>Blog</Text></TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.footerBottom}>
            <Text style={styles.copyright}>© 2024 EduLearn Inc. All rights reserved.</Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon}><Ionicons name="logo-twitter" size={20} color="#64748B" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}><Ionicons name="logo-github" size={20} color="#64748B" /></TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}><Ionicons name="logo-linkedin" size={20} color="#64748B" /></TouchableOpacity>
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 80 : 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    position: Platform.OS === 'web' ? 'fixed' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    ...Platform.select({
      web: { backdropFilter: 'blur(10px)', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }
    }),
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  logoTextSmall: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  navLink: {
    paddingVertical: 8,
  },
  navLinkText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },
  loginButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  heroSection: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    paddingHorizontal: Platform.OS === 'web' ? 80 : 20,
    paddingTop: Platform.OS === 'web' ? 140 : 100,
    paddingBottom: 80,
    alignItems: 'center',
  },
  heroContent: {
    flex: 1,
    paddingRight: Platform.OS === 'web' ? 40 : 0,
  },
  badge: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  badgeText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 64 : 40,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: Platform.OS === 'web' ? 72 : 48,
    letterSpacing: -1.5,
    marginBottom: 24,
  },
  gradientText: {
    color: '#7C3AED',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#64748B',
    lineHeight: 28,
    marginBottom: 40,
    maxWidth: 540,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 60,
  },
  primaryCta: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    ...Platform.select({
      web: { boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)' }
    }),
  },
  primaryCtaText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryCta: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  secondaryCtaText: {
    color: '#1E293B',
    fontSize: 17,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  heroImageContainer: {
    flex: 1,
    height: Platform.OS === 'web' ? 500 : 300,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  section: {
    paddingHorizontal: Platform.OS === 'web' ? 80 : 20,
    paddingVertical: 100,
    backgroundColor: 'white',
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 60,
  },
  sectionTag: {
    fontSize: 13,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 2,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 30,
  },
  featureCard: {
    flex: 1,
    padding: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      web: { boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }
    }),
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  ctaSection: {
    paddingHorizontal: Platform.OS === 'web' ? 80 : 20,
    paddingVertical: 60,
  },
  ctaGradient: {
    padding: 60,
    borderRadius: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
    textAlign: 'center',
    maxWidth: 600,
  },
  ctaWhiteButton: {
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 16,
  },
  ctaWhiteButtonText: {
    color: '#7C3AED',
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: Platform.OS === 'web' ? 80 : 20,
    paddingVertical: 60,
    backgroundColor: '#0F172A',
  },
  footerTop: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 40,
    marginBottom: 40,
    gap: 40,
  },
  footerBrand: {
    flex: 1,
    maxWidth: 300,
  },
  footerDesc: {
    color: '#94A3B8',
    fontSize: 15,
    marginTop: 20,
    lineHeight: 24,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    gap: 60,
  },
  footerLinkCol: {
    gap: 16,
  },
  footerLinkTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  footerLinkText: {
    color: '#94A3B8',
    fontSize: 15,
  },
  footerBottom: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  copyright: {
    color: '#64748B',
    fontSize: 14,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
