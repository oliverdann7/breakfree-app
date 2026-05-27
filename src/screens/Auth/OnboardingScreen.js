import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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

const GOALS = [
  { id: 'sleep', label: 'Uyku', emoji: '😴', desc: 'Uyku kaliteni artır' },
  { id: 'fitness', label: 'Fitness', emoji: '💪', desc: 'Formda kal' },
  { id: 'mindfulness', label: 'Zihin', emoji: '🧘', desc: 'Farkındalık geliştir' },
  { id: 'nutrition', label: 'Beslenme', emoji: '🥗', desc: 'Doğru beslen' },
  { id: 'community', label: 'Topluluk', emoji: '🤝', desc: 'Bağlantı kur' },
  { id: 'stress', label: 'Stres', emoji: '🌿', desc: 'Stresi yönet' },
];

export default function OnboardingScreen({ _navigation }) {
  const dispatch = useAppDispatch();
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
      <Text style={styles.stepTitle}>BreakFree&apos;ye{'\n'}Hoş Geldin!</Text>
      <Text style={styles.stepDesc}>
        Türkiye&apos;nin en iyi wellness topluluğuna katıldın. Hedeflerine ulaşman için buradayız.
      </Text>
      <View style={styles.featureList}>
        {[
          { emoji: '🎙', text: 'Uzman talk&apos;larına katıl' },
          { emoji: '📊', text: 'Sağlık metriklerini takip et' },
          { emoji: '👥', text: 'Toplulukla bağlantı kur' },
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
      <Text style={styles.stepTitle}>Hedeflerini{'\n'}Seç</Text>
      <Text style={styles.stepDesc}>
        Sana en uygun içerikleri gösterebilmemiz için hedeflerini belirt. Birden fazla seçebilirsin.
      </Text>
      <View style={styles.goalsGrid}>
        {GOALS.map((goal) => {
          const selected = selectedGoals.includes(goal.id);
          return (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalCard, selected && styles.goalCardSelected]}
              onPress={() => toggleGoal(goal.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <Text style={[styles.goalLabel, selected && styles.goalLabelSelected]}>
                {goal.label}
              </Text>
              <Text style={styles.goalDesc}>{goal.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>,

    // Step 2: Profile
    <View key="profile" style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Profilini{'\n'}Tamamla</Text>
      <Text style={styles.stepDesc}>
        Topluluk seni tanısın. Bunları daha sonra değiştirebilirsin.
      </Text>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : '?'}</Text>
      </View>
      <Input
        label="Ad Soyad"
        value={name}
        onChangeText={setName}
        placeholder="Adın Soyadın"
        autoCapitalize="words"
        style={styles.profileInput}
      />
      <Input
        label="Biyografi (isteğe bağlı)"
        value={bio}
        onChangeText={setBio}
        placeholder="Kendini kısaca tanıt..."
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
            title="Geri"
            variant="ghost"
            onPress={() => setStep((s) => s - 1)}
            style={styles.backBtn}
          />
        )}
        <Button
          title={step === 2 ? 'Başla 🚀' : 'İleri'}
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
