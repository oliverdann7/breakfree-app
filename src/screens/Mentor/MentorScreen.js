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
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMentorData } from '../../store/slices/mentorSlice';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

function formatSessionDate(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  return {
    day: days[d.getDay()],
    date: d.getDate(),
    time: `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`,
  };
}

function timeAgo(ts) {
  if (!ts) return '';
  const h = Math.floor((Date.now() - ts) / 3600000);
  if (h < 1) return 'Az önce';
  if (h < 24) return `${h}sa önce`;
  return `${Math.floor(h / 24)}g önce`;
}

export default function MentorScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { mentor, weeklyFocus, weeklyGoals, nextSession, lastMessage, loading } = useAppSelector(
    (state) => state.mentor
  );

  useEffect(() => {
    if (user?.uid) dispatch(fetchMentorData(user.uid));
  }, [user?.uid]);

  const sessionDate = formatSessionDate(nextSession?.scheduledAt);
  const completedGoals = weeklyGoals.filter((g) => g.done).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerGradient}>
          <View style={styles.headerOverlay} />
          <View style={styles.mentorSection}>
            {loading && !mentor ? (
              <ActivityIndicator color={colors.cyan} style={{ marginBottom: 20 }} />
            ) : mentor ? (
              <>
                <View style={styles.mentorAvatar}>
                  <Text style={styles.avatarText}>
                    {mentor.avatarInitial || mentor.name?.[0] || 'M'}
                  </Text>
                  <View style={styles.onlineBadge} />
                </View>
                <View style={styles.mentorInfo}>
                  <Text style={styles.mentorLabel}>Mentörün</Text>
                  <Text style={styles.mentorName}>{mentor.name}</Text>
                  <Text style={styles.mentorRole}>
                    {mentor.role} · {mentor.yearsExperience} yıl deneyim
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.mentorInfo}>
                <Text style={styles.mentorLabel}>Mentör</Text>
                <Text style={styles.mentorName}>Henüz atanmadı</Text>
                <Text style={styles.mentorRole}>Yakında bir mentör atanacak</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { label: 'Sohbet', icon: '💬' },
            { label: 'Görüşme', icon: '📹' },
            { label: 'Planla', icon: '📅' },
          ].map((action) => (
            <TouchableOpacity key={action.label} style={styles.actionBtn}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Focus */}
        <Card style={styles.focusCard}>
          <View style={styles.focusHeader}>
            <Text style={styles.focusIcon}>🎯</Text>
            <Text style={styles.focusTitle}>Bu hafta odak</Text>
          </View>
          {weeklyFocus ? (
            <Text style={styles.focusGoal}>{weeklyFocus}</Text>
          ) : (
            <Text style={styles.emptyText}>Mentörün henüz bir odak belirlemedi.</Text>
          )}
          {weeklyGoals.length > 0 && (
            <>
              <View style={styles.goalsList}>
                {weeklyGoals.map((goal, i) => (
                  <View key={i} style={styles.goalItem}>
                    <Text style={styles.goalCheckbox}>{goal.done ? '✓' : '○'}</Text>
                    <Text style={[styles.goalText, goal.done && styles.goalTextDone]}>
                      {goal.label}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.round((completedGoals / weeklyGoals.length) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {completedGoals}/{weeklyGoals.length}
                </Text>
              </View>
            </>
          )}
        </Card>

        {/* Latest Message */}
        <Card style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <Text style={styles.messageLabel}>Son mesaj</Text>
            {lastMessage && (
              <Text style={styles.messageTime}>{timeAgo(lastMessage.createdAt)}</Text>
            )}
          </View>
          {lastMessage ? (
            <View style={styles.messageBubble}>
              <View style={styles.senderAvatar}>
                <Text style={styles.senderInitial}>
                  {mentor?.avatarInitial || mentor?.name?.[0] || 'M'}
                </Text>
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.messageText}>{lastMessage.text}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>Henüz mesaj yok.</Text>
          )}
        </Card>

        {/* Next Session */}
        {nextSession && sessionDate && (
          <TouchableOpacity style={styles.sessionCard}>
            <View style={styles.dateBox}>
              <Text style={styles.dayLabel}>{sessionDate.day}</Text>
              <Text style={styles.dayNumber}>{sessionDate.date}</Text>
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>
                {nextSession.sessionType || 'Görüntülü görüşme'}
              </Text>
              <Text style={styles.sessionTime}>
                {sessionDate.time} · {nextSession.durationMinutes || 30}dk
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollContent: { paddingBottom: 20 },
  headerGradient: { height: 160, backgroundColor: colors.royal, overflow: 'hidden' },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: colors.bgPrimary,
    opacity: 0.9,
  },
  mentorSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  mentorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bgPrimary,
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: colors.navy },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.cyan,
    borderWidth: 2,
    borderColor: colors.bgPrimary,
  },
  mentorInfo: { flex: 1, justifyContent: 'flex-end', paddingBottom: 4 },
  mentorLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  mentorName: { fontSize: 16, fontWeight: '500', color: colors.textPrimary, marginBottom: 2 },
  mentorRole: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginTop: -20,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    gap: 6,
  },
  actionIcon: { fontSize: 16 },
  actionLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  focusCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(230,181,48,0.2)',
    backgroundColor: 'rgba(230,181,48,0.08)',
    gap: 12,
  },
  focusHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  focusIcon: { fontSize: 14 },
  focusTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.gold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  focusGoal: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, lineHeight: 19 },
  goalsList: { gap: 8 },
  goalItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  goalCheckbox: { fontSize: 14, color: colors.gold, fontWeight: '600', width: 14 },
  goalText: { fontSize: 12, color: colors.textPrimary, flex: 1 },
  goalTextDone: { color: 'rgba(255,255,255,0.3)', textDecorationLine: 'line-through' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 2 },
  progressText: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '500' },
  messageCard: { marginHorizontal: 20, marginBottom: 12, padding: 12, gap: 8 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  messageLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  messageTime: { fontSize: 9, color: 'rgba(255,255,255,0.3)' },
  messageBubble: { flexDirection: 'row', gap: 8, marginTop: 4 },
  senderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  senderInitial: { fontSize: 12, fontWeight: '600', color: colors.navy },
  messageContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 10,
  },
  messageText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 17 },
  emptyText: { fontSize: 13, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' },
  sessionCard: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(20,184,212,0.08)',
    gap: 12,
  },
  dateBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(20,184,212,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayLabel: { fontSize: 9, color: colors.cyan, fontWeight: '600', textTransform: 'uppercase' },
  dayNumber: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  sessionInfo: { flex: 1, gap: 2 },
  sessionTitle: { fontSize: 11, fontWeight: '500', color: colors.textPrimary },
  sessionTime: { fontSize: 9, color: 'rgba(255,255,255,0.5)' },
  chevron: { fontSize: 18, color: 'rgba(255,255,255,0.3)' },
});
