import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import BreakFreeLogo from '../../components/branding/BreakFreeLogo';
import Button from '../../components/common/Button';
import { colors } from '../../constants/designTokens';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={false}>
        <View style={styles.header}>
          <BreakFreeLogo variant="full" size="large" />
        </View>

        <View style={styles.content}>
          <Text style={styles.mainTitle}>BreakFree Türkiye'ye Hoş Geldin</Text>
          <Text style={styles.subtitle}>Sağlıklı bir yaşam topluluğu</Text>

          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💪</Text>
              <Text style={styles.featureText}>Kişisel Gelişim</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🤝</Text>
              <Text style={styles.featureText}>Topluluk Desteği</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>İlerleme Takibi</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Hedef Belirleme</Text>
            </View>
          </View>

          <Text style={styles.description}>
            Sağlıklı alışkanlıklar geliştir, toplulukla bağlan ve yaşam kaliteni iyileştir.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Başla"
            onPress={() => navigation.navigate('Login')}
            style={styles.startBtn}
          />

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  content: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  features: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(20, 184, 212, 0.08)',
    borderRadius: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    marginTop: 40,
  },
  startBtn: {
    marginBottom: 20,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: colors.cyan,
    fontWeight: '600',
  },
});
