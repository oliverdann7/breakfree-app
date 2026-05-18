import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { updatePreferences } from '../../store/slices/userSlice';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

function SettingRow({ icon, label, value, onPress, rightElement, isDestructive }) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={[styles.settingLabel, isDestructive && { color: colors.error }]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {rightElement}
        {!rightElement && <Text style={styles.chevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { preferences, profile } = useAppSelector((state) => state.user);

  // Prefer persisted profile over auth user (edit profile updates profile slice)
  const displayData = profile || user || {};

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabından çıkmak istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  const toggleLanguage = () => {
    const next = preferences.language === 'tr' ? 'en' : 'tr';
    dispatch(updatePreferences({ language: next }));
    i18n.changeLanguage(next);
  };

  const displayName = displayData.displayName || 'Kullanıcı';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayData.email || user?.email}</Text>
          {displayData.bio ? <Text style={styles.userBio}>{displayData.bio}</Text> : null}

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { label: 'Talk', value: '12' },
              { label: 'Gün', value: '47' },
              { label: 'Puan', value: '890' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editBtnText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>

        {/* Goals */}
        <Card style={styles.goalsCard}>
          <Text style={styles.sectionTitle}>Hedeflerim</Text>
          <View style={styles.goalsRow}>
            {(displayData.goals?.length
              ? displayData.goals
              : ['sleep', 'fitness', 'mindfulness']
            ).map((g) => (
              <View key={g} style={styles.goalChip}>
                <Text style={styles.goalChipText}>{g}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Settings */}
        <Text style={styles.settingsSectionTitle}>Ayarlar</Text>
        <Card style={styles.settingsCard}>
          <SettingRow
            icon="🌍"
            label="Dil"
            value={preferences.language === 'tr' ? 'Türkçe' : 'English'}
            onPress={toggleLanguage}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🔔"
            label="Bildirimler"
            value={preferences.notifications ? 'Açık' : 'Kapalı'}
            onPress={() =>
              dispatch(updatePreferences({ notifications: !preferences.notifications }))
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📏"
            label="Birimler"
            value={preferences.units === 'metric' ? 'Metrik' : 'Imperial'}
            onPress={() =>
              dispatch(
                updatePreferences({ units: preferences.units === 'metric' ? 'imperial' : 'metric' })
              )
            }
          />
        </Card>

        <Text style={styles.settingsSectionTitle}>Hesap</Text>
        <Card style={styles.settingsCard}>
          <SettingRow icon="🔒" label="Şifre Değiştir" onPress={() => Alert.alert('Yakında')} />
          <View style={styles.divider} />
          <SettingRow icon="📱" label="Cihazları Yönet" onPress={() => Alert.alert('Yakında')} />
          <View style={styles.divider} />
          <SettingRow
            icon="📄"
            label="Gizlilik Politikası"
            onPress={() => Alert.alert('Yakında')}
          />
          <View style={styles.divider} />
          <SettingRow icon="🚪" label="Çıkış Yap" onPress={handleLogout} isDestructive />
        </Card>

        <Text style={styles.version}>BreakFree v1.0.0</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.royal,
  },
  avatarInitials: { fontSize: 32, fontWeight: '800', color: colors.navy },
  userName: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  userEmail: { fontSize: 13, color: colors.textTertiary, marginTop: 2 },
  userBio: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 12,
    marginBottom: 20,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textTertiary },
  editBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.cyan,
  },
  editBtnText: { color: colors.cyan, fontSize: 13, fontWeight: '600' },
  goalsCard: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 10 },
  goalsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goalChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(20,184,212,0.12)',
    borderWidth: 1,
    borderColor: colors.cyan + '40',
  },
  goalChipText: { fontSize: 12, color: colors.cyan },
  settingsSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  settingsCard: { marginHorizontal: 20, marginBottom: 20, padding: 0, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  settingIcon: { fontSize: 20, width: 28 },
  settingLabel: { flex: 1, fontSize: 15, color: colors.textPrimary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: 13, color: colors.textTertiary },
  chevron: { fontSize: 20, color: colors.textTertiary },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 56 },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 8,
  },
});
