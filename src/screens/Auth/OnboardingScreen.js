import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateProfile,
  updateProfileFirestore,
  setHasCompletedOnboarding,
} from '../../store/slices/userSlice';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import BreakFreeLogo from '../../components/branding/BreakFreeLogo';
import { colors } from '../../constants/designTokens';

const { width } = Dimensions.get('window');

const GOAL_IDS = ['sleep', 'fitness', 'mindfulness', 'nutrition', 'community', 'stress'];
const GOAL_EMOJIS = {
  sleep: '😴',
  fitness: '💪',
  mindfulness: '🧘',
  nutrition: '🥗',
  community: '🤝',
  stress: '🌿',
};

export default function OnboardingScreen({ _navigation }) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const auth = useAppSelector((state) => state.auth);

  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [name, setName] = useState(auth.user?.displayName || '');
  const [bio, setBio] = useState('');

  const toggleGoal = (id) => {
    setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  const handleComplete = () => {
    const uid = auth.user?.uid;
    const profileData = { displayName: name, bio, goals: selectedGoals };
    dispatch(updateProfile(profileData));
    if (uid) {
      dispatch(updateProfileFirestore({ uid, ...profileData }));
    }
    dispatch(setHasCompletedOnboarding(true));
  };

  const steps = [
    // Step 0: Welcome
    <View key="welcome" style={styles.stepContainer}>
      <Text style={styles.welcomeEmoji}>🌟</Text>
      <Text style={styles.stepTitle}>{t('onboarding.welcome')}</Text>
      <Text style={styles.stepDesc}>{t('onboarding.welcomeDesc')}</Text>
      <View style={styles.featureList}>
        {[
          { emoji: '🎙', text: t('talks.title') },
          { emoji: '📊', text: t('health.title') },
          { emoji: '👥', text: t('community.title') },
        ].map((f) => (
          <View key={f.emoji} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
          </View>
        ))}
      </View>
    </View>,

    // Step 1: Goals
    <View key="goals" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('onboarding.goals')}</Text>
      <Text style={styles.stepDesc}>{t('onboarding.goalsDesc')}</Text>
      <View style={styles.goalsGrid}>
        {GOAL_IDS.map((id) => {
          const selected = selectedGoals.includes(id);
          return (
            <TouchableOpacity
              key={id}
              style={[styles.goalCard, selected && styles.goalCardSelected]}
              onPress={() => toggleGoal(id)}
              activeOpacity={0.7}
            >
              <Text style={styles.goalEmoji}>{GOAL_EMOJIS[id]}</Text>
              <Text style={[styles.goalLabel, selected && styles.goalLabelSelected]}>
                {t(`goals.${id}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>,

    // Step 2: Profile
    <View key="profile" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>{t('onboarding.profile')}</Text>
      <Text style={styles.stepDesc}>{t('onboarding.profileDesc')}</Text>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : '?'}</Text>
      </View>
      <Input
        label={t('auth.displayName')}
        value={name}
        onChangeText={setName}
        placeholder={t('auth.namePlaceholder')}
        autoCapitalize="words"
        style={styles.profileInput}
      />
      <Input
        label={t('profile.bio')}
        value={bio}
        onChangeText={setBio}
        placeholder={t('community.bioPlaceholder')}
        autoCapitalize="sentences"
        style={styles.profileInput}
      />
    </View>,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BreakFreeLogo variant="symbol" size="small" />
      </View>
      <View style={styles.progressBar}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.progressDot, i <= step && styles.progressDotActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {steps[step]}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <Button
            title={t('common.back')}
            variant="ghost"
            onPress={() => setStep((s) => s - 1)}
            style={styles.backBtn}
          />
        )}
        <Button
          title={step === 2 ? t('onboarding.start') : t('onboarding.next')}
          onPress={() => {
            if (step < 2) setStep((s) => s + 1);
            else handleComplete();
          }}
          style={styles.nextBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    alignItems: 'center',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 12,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  progressDotActive: { backgroundColor: colors.cyan, width: 24 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 20 },
  stepContainer: { paddingBottom: 24 },
  welcomeEmoji: { fontSize: 64, textAlign: 'center', marginBottom: 24 },
  stepTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 40,
  },
  stepDesc: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  featureList: { gap: 12 },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  featureEmoji: { fontSize: 24 },
  featureText: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  goalCard: {
    width: (width - 58) / 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  goalCardSelected: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(20,184,212,0.08)',
  },
  goalEmoji: { fontSize: 28, marginBottom: 8 },
  goalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  goalLabelSelected: { color: colors.cyan },
  goalDesc: { fontSize: 12, color: colors.textSecondary },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: colors.navy },
  profileInput: { marginBottom: 12 },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    gap: 12,
  },
  backBtn: { flex: 1 },
  nextBtn: { flex: 2 },
});
