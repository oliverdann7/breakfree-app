import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfile, updateProfileFirestore } from '../../store/slices/userSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

const AVATAR_COLORS = [
  colors.cyan,
  colors.royal,
  colors.gold,
  colors.success,
  '#8B5CF6',
  '#EC4899',
  '#F97316',
  '#06B6D4',
];

const GOAL_IDS = ['sleep', 'fitness', 'mindfulness', 'nutrition', 'community', 'stress'];
const GOAL_EMOJIS = {
  sleep: '😴',
  fitness: '💪',
  mindfulness: '🧘',
  nutrition: '🥗',
  community: '🤝',
  stress: '🌿',
};

export default function EditProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);

  const current = profile || user || {};

  const [displayName, setDisplayName] = useState(current.displayName || '');
  const [bio, setBio] = useState(current.bio || '');
  const [selectedGoals, setSelectedGoals] = useState(current.goals || []);
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const initials = displayName
    ? displayName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const toggleGoal = (id) =>
    setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const validate = () => {
    const e = {};
    if (!displayName.trim()) e.displayName = t('profile.nameRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const profileData = {
        displayName: displayName.trim(),
        bio: bio.trim(),
        goals: selectedGoals,
        avatar: avatarColor,
      };
      dispatch(updateProfile(profileData));
      const uid = user?.uid;
      if (uid) {
        await dispatch(updateProfileFirestore({ uid, ...profileData })).unwrap();
      }
      navigation.goBack();
    } catch {
      Alert.alert(t('common.error'), t('profile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profile.editProfile')}</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveText, saving && { opacity: 0.5 }]}>{t('common.save')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <Text style={styles.avatarLabel}>{t('profile.avatarColor')}</Text>
            <View style={styles.colorRow}>
              {AVATAR_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    avatarColor === c && styles.colorDotSelected,
                  ]}
                  onPress={() => setAvatarColor(c)}
                />
              ))}
            </View>
          </View>

          {/* Fields */}
          <Card style={styles.fieldsCard}>
            <Input
              label={t('auth.displayName')}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder={t('auth.namePlaceholder')}
              autoCapitalize="words"
              error={errors.displayName}
            />
            <Input
              label={t('profile.bio')}
              value={bio}
              onChangeText={setBio}
              placeholder={t('community.bioPlaceholder')}
              autoCapitalize="sentences"
              multiline
              numberOfLines={3}
              style={{ height: 80 }}
            />
          </Card>

          {/* Goals */}
          <Text style={styles.sectionTitle}>{t('profile.myGoals')}</Text>
          <View style={styles.goalsGrid}>
            {GOAL_IDS.map((id) => {
              const selected = selectedGoals.includes(id);
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.goalChip, selected && styles.goalChipSelected]}
                  onPress={() => toggleGoal(id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.goalEmoji}>{GOAL_EMOJIS[id]}</Text>
                  <Text style={[styles.goalLabel, selected && { color: colors.cyan }]}>
                    {t(`goals.${id}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Button
            title={t('common.save')}
            onPress={handleSave}
            loading={saving}
            style={styles.saveBtn}
          />

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelText: { color: colors.textSecondary, fontSize: 15 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  saveText: { color: colors.cyan, fontSize: 15, fontWeight: '600' },
  scroll: { paddingHorizontal: 20, paddingTop: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitials: { fontSize: 36, fontWeight: '800', color: colors.navy },
  avatarLabel: { fontSize: 12, color: colors.textTertiary, marginBottom: 10 },
  colorRow: { flexDirection: 'row', gap: 10 },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: colors.white,
    transform: [{ scale: 1.15 }],
  },
  fieldsCard: { marginBottom: 24, gap: 0 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  goalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  goalChipSelected: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(20,184,212,0.1)',
  },
  goalEmoji: { fontSize: 16 },
  goalLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  saveBtn: { marginTop: 4 },
});
