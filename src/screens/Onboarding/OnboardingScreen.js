import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { colors } from '../../constants/designTokens';

const { height, width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      icon: '✨',
      title: 'Özgürlüğüne',
      subtitle: 'hoş geldin.',
      description: 'Türkiye\'nin en bağlı wellness topluluğu cebinde.',
      tags: [
        { icon: '❤️', label: 'Sağlık' },
        { icon: '👥', label: 'Topluluk' },
        { icon: '🧠', label: 'Zihin' },
      ],
    },
    {
      icon: '🎯',
      title: 'Hedeflerin',
      subtitle: 'gerçek olsun.',
      description: 'Wellness uzmanlarıyla birlikte kişisel yolculuğunu başlat.',
      tags: [
        { icon: '📊', label: 'Takip et' },
        { icon: '🏆', label: 'Başar' },
        { icon: '💪', label: 'Gelişim' },
      ],
    },
    {
      icon: '🌟',
      title: 'Topluluğa',
      subtitle: 'katıl.',
      description: 'Türkiye\'nin wellness liderleriyle bağlantı kur ve inspir ol.',
      tags: [
        { icon: '🎙', label: 'Sunumlar' },
        { icon: '💬', label: 'Mentorlar' },
        { icon: '🤝', label: 'Ağ' },
      ],
    },
  ];

  const handleStart = () => {
    navigation?.navigate('Auth', { screen: 'Login' }) || console.log('Navigate to Login');
  };

  const handleSignUp = () => {
    navigation?.navigate('Auth', { screen: 'Register' }) || console.log('Navigate to Register');
  };

  const page = pages[currentPage];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoBadge}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.logoText}>
            BreakFree<Text style={styles.logoDot}>.</Text>
          </Text>
        </View>

        {/* Illustration Area */}
        <View style={styles.illustrationArea}>
          <View style={styles.orbitalContainer}>
            <View style={styles.orbit1} />
            <View style={styles.orbit2} />
            <View style={styles.centerCircle}>
              <Text style={styles.centerIcon}>{page.icon}</Text>
            </View>

            {/* Floating Tags */}
            <View style={styles.tagTopLeft}>
              <Text style={styles.tagIcon}>{page.tags[0].icon}</Text>
              <Text style={styles.tagLabel}>{page.tags[0].label}</Text>
            </View>
            <View style={styles.tagTopRight}>
              <Text style={styles.tagIcon}>{page.tags[1].icon}</Text>
              <Text style={styles.tagLabel}>{page.tags[1].label}</Text>
            </View>
            <View style={styles.tagBottom}>
              <Text style={styles.tagIcon}>{page.tags[2].icon}</Text>
              <Text style={styles.tagLabel}>{page.tags[2].label}</Text>
            </View>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textSection}>
          <Text style={styles.title}>
            {page.title}{'\n'}
            <Text style={styles.titleAccent}>{page.subtitle}</Text>
          </Text>
          <Text style={styles.description}>{page.description}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleStart}>
            <Text style={styles.primaryBtnText}>Başla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleSignUp}>
            <Text style={styles.secondaryBtnText}>Hesabım var</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Dots */}
        <View style={styles.dotsSection}>
          {pages.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentPage ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoSection: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  logoDot: {
    color: colors.gold,
  },
  illustrationArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  orbitalContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(230,181,48,0.2)',
  },
  orbit2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(20,184,212,0.15)',
  },
  centerCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerIcon: {
    fontSize: 48,
  },
  tagTopLeft: {
    position: 'absolute',
    top: 0,
    left: -40,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagTopRight: {
    position: 'absolute',
    top: 20,
    right: -40,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagBottom: {
    position: 'absolute',
    bottom: 10,
    left: -25,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagIcon: {
    fontSize: 12,
  },
  tagLabel: {
    fontSize: 10,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  textSection: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
  },
  titleAccent: {
    color: colors.gold,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonSection: {
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: colors.gold,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.navy,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  dotsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.gold,
  },
  dotInactive: {
    width: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
