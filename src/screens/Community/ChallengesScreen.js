import React, { useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchActiveChallenges, joinChallenge } from '../../store/slices/challengesSlice';
import { BADGES, evaluateBadges } from '../../utils/badges';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

function ChallengeCard({ challenge, joined, progress, onJoin, onOpen }) {
  const { t } = useTranslation();
  const daysLeft = Math.ceil((challenge.endDate - Date.now()) / 86_400_000);
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={onOpen} activeOpacity={0.85}>
        <View style={styles.cardHead}>
          <Text style={styles.cardIcon}>{challenge.icon || '🏆'}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{challenge.title || t('challenges.default')}</Text>
            <Text style={styles.cardMeta}>
              {t('challenges.participantCount', { count: challenge.participantCount || 0 })} ·{' '}
              {daysLeft > 0
                ? t('challenges.daysLeft', { count: daysLeft })
                : t('challenges.lastDay')}
            </Text>
          </View>
        </View>
        <Text style={styles.cardDesc}>{challenge.description || t('challenges.goalComplete')}</Text>

        {joined ? (
          <>
            <View style={styles.bar}>
              <View style={[styles.barFill, { width: `${Math.min(100, progress)}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {t('challenges.progress', { percent: Math.round(progress) })}
            </Text>
          </>
        ) : (
          <TouchableOpacity onPress={onJoin} style={styles.joinBtn}>
            <Text style={styles.joinBtnText}>{t('challenges.joinBtn')}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Card>
  );
}

function BadgeChip({ badge, owned }) {
  return (
    <View style={[styles.badgeChip, !owned && { opacity: 0.4 }]}>
      <Text style={styles.badgeIcon}>{badge.icon}</Text>
      <Text style={styles.badgeName}>{badge.name}</Text>
    </View>
  );
}

export default function ChallengesScreen({ navigation }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { challenges, userParticipation, loading } = useAppSelector((s) => s.challenges);
  const { stats } = useAppSelector((s) => s.user);

  useEffect(() => {
    if (user?.uid) dispatch(fetchActiveChallenges(user.uid));
  }, [user?.uid, dispatch]);

  const ownedBadgeIds = evaluateBadges(stats || {});

  const openDetail = (challenge) => {
    if (navigation?.navigate) {
      navigation.navigate('Leaderboard', { challengeId: challenge.id });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
        <View style={styles.header}>
          {navigation && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{t('challenges.title')}</Text>
            <Text style={styles.subtitle}>
              {t('community.title')} · {t('challenges.activeCount', { count: challenges.length })}
            </Text>
          </View>
        </View>

        {loading && challenges.length === 0 ? (
          <ActivityIndicator color={colors.cyan} style={{ marginTop: 40 }} />
        ) : challenges.length === 0 ? (
          <Card style={styles.empty}>
            <Text style={styles.emptyText}>{t('challenges.empty')}</Text>
            <Text style={styles.emptySub}>{t('challenges.emptySub')}</Text>
          </Card>
        ) : (
          challenges.map((c) => {
            const p = userParticipation[c.id];
            const progress = c.targetValue ? ((p?.currentProgress || 0) / c.targetValue) * 100 : 0;
            return (
              <ChallengeCard
                key={c.id}
                challenge={c}
                joined={!!p}
                progress={progress}
                onJoin={() =>
                  user?.uid && dispatch(joinChallenge({ challengeId: c.id, uid: user.uid }))
                }
                onOpen={() => openDetail(c)}
              />
            );
          })
        )}

        <Text style={styles.sectionTitle}>{t('challenges.badges')}</Text>
        <View style={styles.badgeGrid}>
          {BADGES.map((b) => (
            <BadgeChip key={b.id} badge={b} owned={ownedBadgeIds.includes(b.id)} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 18 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: colors.textPrimary, fontSize: 18 },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },

  card: {
    marginBottom: 12,
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    backgroundColor: 'rgba(201, 150, 26, 0.06)',
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIcon: { fontSize: 26 },
  cardTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 14 },
  cardMeta: { color: colors.textTertiary, fontSize: 11, marginTop: 2 },
  cardDesc: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  bar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: { height: '100%', backgroundColor: colors.gold },
  progressText: { color: colors.gold, fontSize: 11, fontWeight: '600' },
  joinBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.cyan,
    borderRadius: 999,
  },
  joinBtnText: { color: colors.navy, fontWeight: '700', fontSize: 12 },

  empty: { alignItems: 'center', padding: 24, gap: 6 },
  emptyText: { color: colors.textPrimary, fontWeight: '600' },
  emptySub: { color: colors.textTertiary, fontSize: 12 },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badgeChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeIcon: { fontSize: 16 },
  badgeName: { color: colors.textSecondary, fontSize: 11, fontWeight: '600' },
});
