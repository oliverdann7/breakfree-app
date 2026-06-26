import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { useAppSelector } from '../../store/hooks';
import { db } from '../../services/firebase';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

// Dev-only seed so the screen renders before the `recomputeLeaderboard` Cloud
// Function has populated `leaderboards/{challengeId}`. Production shows a real
// empty state instead of fake rankings.
const SEED_LEADERBOARD = [
  { rank: 1, uid: 'seed1', name: 'Ayşe K.', value: 52340, emoji: '🌸', bg: '#EC4899' },
  { rank: 2, uid: 'seed2', name: 'Burak Y.', value: 51200, emoji: '🔥', bg: '#EF4444' },
  { rank: 3, uid: 'seed3', name: 'Elif M.', value: 49875, emoji: '🦋', bg: '#8B5CF6' },
  { rank: 4, uid: 'seed4', name: 'Mert C.', value: 48910, emoji: '⭐', bg: '#F59E0B' },
  { rank: 5, uid: 'seed5', name: 'Ceren A.', value: 47220, emoji: '🌿', bg: '#10B981' },
];

export default function LeaderboardScreen({ navigation, route }) {
  const { t } = useTranslation();
  const challengeId = route?.params?.challengeId;
  const { challenges } = useAppSelector((s) => s.challenges);
  const { user } = useAppSelector((s) => s.auth);
  const challenge = useMemo(
    () => challenges.find((c) => c.id === challengeId),
    [challenges, challengeId]
  );

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!db || !challengeId) {
          if (!cancelled) setEntries(__DEV__ ? SEED_LEADERBOARD : []);
          return;
        }
        const snap = await getDoc(doc(db, 'leaderboards', challengeId));
        const list = snap.exists() ? snap.data().entries || [] : [];
        if (!cancelled) setEntries(list.length ? list : __DEV__ ? SEED_LEADERBOARD : []);
      } catch (e) {
        if (!cancelled) setError(e.message || t('leaderboard.error'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [challengeId]);

  // Mark the signed-in user's own row.
  const ranked = useMemo(
    () => entries.map((e) => ({ ...e, isMe: user?.uid && e.uid === user.uid })),
    [entries, user?.uid]
  );
  const myEntry = ranked.find((e) => e.isMe);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        <View style={styles.header}>
          {navigation && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.back}
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>{t('leaderboard.titleLabel')}</Text>
            <Text style={styles.title}>{challenge?.title || t('leaderboard.challenge')}</Text>
            {challenge?.description && <Text style={styles.subtitle}>{challenge.description}</Text>}
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.cyan} style={{ marginTop: 60 }} />
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateText}>{error}</Text>
          </View>
        ) : ranked.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateEmoji}>🏁</Text>
            <Text style={styles.stateText}>{t('leaderboard.noRanking')}</Text>
          </View>
        ) : (
          <>
            {myEntry && (
              <Card style={styles.myCard}>
                <View style={styles.podiumRow}>
                  <Text style={styles.rankBig}>#{myEntry.rank}</Text>
                  <View style={[styles.avatar, { backgroundColor: myEntry.bg }]}>
                    <Text style={styles.avatarEmoji}>{myEntry.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.myName}>{myEntry.name}</Text>
                    <Text style={styles.myValue}>{myEntry.value.toLocaleString('tr-TR')}</Text>
                  </View>
                </View>
              </Card>
            )}

            <Text style={styles.sectionTitle}>{t('leaderboard.rank')}</Text>

            {ranked.map((entry) => (
              <View
                key={entry.uid || entry.rank}
                style={[styles.entryRow, entry.isMe && styles.entryRowMe]}
              >
                <Text style={[styles.entryRank, entry.rank <= 3 && styles.entryRankTop]}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
                </Text>
                <View style={[styles.avatar, { backgroundColor: entry.bg, width: 32, height: 32 }]}>
                  <Text style={{ fontSize: 14 }}>{entry.emoji}</Text>
                </View>
                <Text style={[styles.entryName, entry.isMe && { color: colors.cyan }]}>
                  {entry.name}
                </Text>
                <Text style={styles.entryValue}>{entry.value.toLocaleString('tr-TR')}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 16 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: colors.textPrimary, fontSize: 18 },
  kicker: { color: colors.gold, fontSize: 10, letterSpacing: 2, fontWeight: '700' },
  title: { color: colors.textPrimary, fontSize: 22, fontWeight: '700', marginTop: 4 },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 17 },

  stateBox: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 24, gap: 12 },
  stateEmoji: { fontSize: 36 },
  stateText: { color: colors.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 19 },

  myCard: {
    backgroundColor: 'rgba(20, 184, 212, 0.1)',
    borderColor: colors.cyan,
    borderWidth: 1,
    marginBottom: 18,
  },
  podiumRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rankBig: { color: colors.cyan, fontSize: 24, fontWeight: '800', width: 50 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 20 },
  myName: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 },
  myValue: { color: colors.cyan, fontSize: 18, fontWeight: '800', marginTop: 2 },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 6,
  },
  entryRowMe: { backgroundColor: 'rgba(20, 184, 212, 0.08)' },
  entryRank: { width: 36, color: colors.textSecondary, fontWeight: '700', fontSize: 13 },
  entryRankTop: { fontSize: 18 },
  entryName: { flex: 1, color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  entryValue: { color: colors.textPrimary, fontWeight: '700', fontSize: 13 },
});
