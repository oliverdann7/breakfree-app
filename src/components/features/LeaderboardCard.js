import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchLeaderboard } from '../../store/slices/communitySlice';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import { colors } from '../../constants/designTokens';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardCard() {
  const dispatch = useAppDispatch();
  const { leaderboard, leaderboardLoading } = useAppSelector((s) => s.community);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, []);

  if (leaderboardLoading || leaderboard.length === 0) return null;

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>🏆 Wellness Liderler</Text>
        <Text style={styles.subtitle}>Bu hafta</Text>
      </View>
      {leaderboard.slice(0, 5).map((u, i) => {
        const scoreColor =
          u.wellnessScore >= 75
            ? colors.success
            : u.wellnessScore >= 45
              ? colors.cyan
              : colors.gold;
        return (
          <View key={u.uid} style={styles.row}>
            <Text style={styles.rank}>{MEDALS[i] || `${i + 1}.`}</Text>
            <Avatar
              emoji={u.avatarEmoji || '🧘'}
              bg={u.avatarBg || colors.royal}
              size={30}
              label={u.displayName || 'Kullanıcı'}
            />
            <Text style={styles.name} numberOfLines={1}>
              {u.displayName || 'Kullanıcı'}
            </Text>
            <Text style={[styles.score, { color: scoreColor }]}>{u.wellnessScore}</Text>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
    backgroundColor: 'rgba(201, 150, 26, 0.06)',
    borderWidth: 0,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 11, color: colors.gold },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rank: { width: 24, fontSize: 16, textAlign: 'center' },
  name: { flex: 1, fontSize: 13, color: colors.textPrimary },
  score: { fontSize: 14, fontWeight: '700' },
});
