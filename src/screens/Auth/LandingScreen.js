import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import BreakFreeLogo from '../../components/branding/BreakFreeLogo';
import Button from '../../components/common/Button';
import { colors } from '../../constants/designTokens';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <BreakFreeLogo variant="full" size="large" />
          </View>

          <Text style={styles.heroTitle}>Sağlıklı Yaşamın Yolculuğuna Başla</Text>
          <Text style={styles.heroSubtitle}>
            BreakFree ile kişisel gelişimini hızlandır, toplulukla bağlan ve hedeflerine ulaş
          </Text>

          <View style={styles.ctaButtons}>
            <Button
              title="Kayıt Ol"
              onPress={() => navigation.navigate('Signup')}
              style={styles.primaryBtn}
            />
            <Button
              title="Giriş Yap"
              variant="outline"
              onPress={() => navigation.navigate('Login')}
              style={styles.secondaryBtn}
            />
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Neden BreakFree?</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconBg}>
                <Text style={styles.featureIcon}>💪</Text>
              </View>
              <Text style={styles.featureName}>Kişisel Gelişim</Text>
              <Text style={styles.featureDesc}>
                Alışkanlıklarını izle, ilerlemenizi ölçü ve hedeflerine odaklan
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconBg}>
                <Text style={styles.featureIcon}>🤝</Text>
              </View>
              <Text style={styles.featureName}>Topluluk Desteği</Text>
              <Text style={styles.featureDesc}>
                Aynı amaçlarını paylaşan kişilerle bağlan ve birbirini destekle
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconBg}>
                <Text style={styles.featureIcon}>📊</Text>
              </View>
              <Text style={styles.featureName}>İlerleme Takibi</Text>
              <Text style={styles.featureDesc}>
                Detaylı istatistikler ve grafiklerle gelişimini görselleştir
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconBg}>
                <Text style={styles.featureIcon}>🎯</Text>
              </View>
              <Text style={styles.featureName}>Hedef Yönetimi</Text>
              <Text style={styles.featureDesc}>
                Gerçekçi hedefler belirle ve adım adım başarı doğru ilerle
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconBg}>
                <Text style={styles.featureIcon}>🎓</Text>
              </View>
              <Text style={styles.featureName}>Wellness İçeriği</Text>
              <Text style={styles.featureDesc}>
                Uzmanlardan öğretici konuşmalar ve wellness rehberleri
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconBg}>
                <Text style={styles.featureIcon}>🔔</Text>
              </View>
              <Text style={styles.featureName}>Motivasyon Desteği</Text>
              <Text style={styles.featureDesc}>
                Günlük reminders ve topluluk önerileri seni motive tutsun
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Topluluk Üyesi</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1M+</Text>
            <Text style={styles.statLabel}>Hedef Başarısı</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8★</Text>
            <Text style={styles.statLabel}>Kullanıcı Puanı</Text>
          </View>
        </View>

        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>Kullanıcılarımızdan Haberler</Text>

          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              {`'BreakFree benim yaşamı değiştirdi. Artık sabahları kalkarken hedefli hissediyorum.'`}
            </Text>
            <Text style={styles.testimonialAuthor}>— Ayşe K., İstanbul</Text>
          </View>

          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              {`'Topluluk desteği bana güç veriyor. Hiç yalnız hissetmiyorum artık.'`}
            </Text>
            <Text style={styles.testimonialAuthor}>— Mehmet T., Ankara</Text>
          </View>

          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              {`'İlerleme takibi sayesinde gerçekten ne kadar ilerlediğimi görebiliyorum.'`}
            </Text>
            <Text style={styles.testimonialAuthor}>— Fatih D., İzmir</Text>
          </View>
        </View>

        {/* CTA Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>Bugün Başlayın</Text>
          <Text style={styles.footerDesc}>
            Ücretsiz hesap oluştur ve sağlıklı yaşamın yolculuğuna başla
          </Text>

          <Button
            title="Şimdi Kayıt Ol"
            onPress={() => navigation.navigate('Signup')}
            style={styles.footerBtn}
          />

          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Zaten üye misin? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Section
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  ctaButtons: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    marginBottom: 0,
  },
  secondaryBtn: {
    marginBottom: 0,
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    backgroundColor: 'rgba(20, 184, 212, 0.05)',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresList: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: 'rgba(20, 184, 212, 0.08)',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.cyan,
  },
  featureIconBg: {
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.cyan,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },

  // Testimonials Section
  testimonialsSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  testimonialCard: {
    backgroundColor: 'rgba(20, 184, 212, 0.08)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  testimonialText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 12,
  },
  testimonialAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Footer Section
  footerSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    backgroundColor: 'rgba(20, 184, 212, 0.08)',
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  footerDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  footerBtn: {
    marginBottom: 0,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  loginLinkText: {
    fontSize: 13,
    color: colors.cyan,
    fontWeight: '600',
  },
});
