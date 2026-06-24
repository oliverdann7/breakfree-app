import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchMentorAssignment,
  fetchMentorProfile,
  fetchLatestMessage,
  sendMessage,
  toggleGoal,
  seedMentorProfile,
} from '../../store/slices/mentorSlice';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

export default function MentorScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { assignment, mentorProfile, latestMessage, goals, focusTitle, nextSession } =
    useAppSelector((state) => state.mentor);

  const [chatVisible, setChatVisible] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    if (user?.uid) {
      dispatch(seedMentorProfile());
      dispatch(fetchMentorAssignment(user.uid));
      dispatch(fetchLatestMessage(user.uid));
    }
  }, [user?.uid, dispatch]);

  useEffect(() => {
    const mentorId = assignment?.mentorId;
    if (mentorId && !mentorProfile) {
      dispatch(fetchMentorProfile(mentorId));
    }
  }, [assignment?.mentorId, mentorProfile, dispatch]);

  const profile = mentorProfile || {
    name: 'Dr. Ayşe Demir',
    role: 'Wellness · 8 yıl deneyim',
    avatarEmoji: '🌿',
    avatarBg: colors.gold,
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !user?.uid) return;
    dispatch(sendMessage({ uid: user.uid, text: messageText.trim() }));
    setMessageText('');
  };

  const handleAction = (label) => {
    if (label === 'Sohbet') {
      setChatVisible(true);
      return;
    }
    // Görüşme (video meeting) and Planla (schedule) both require a booked
    // session — route to the mentor directory where the user picks a slot.
    const mentorId = assignment?.mentorId;
    if (navigation?.navigate) {
      if (mentorId) {
        navigation.navigate('MentorDetail', { mentorId });
      } else {
        navigation.navigate('MentorDirectory');
      }
    }
  };

  const completedCount = goals.filter((g) => g.done).length;
  const progressPct = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header with Mentor */}
        <View style={styles.headerGradient}>
          <View style={styles.headerOverlay} />
          <View style={styles.mentorSection}>
            <View style={[styles.mentorAvatar, { backgroundColor: profile.avatarBg }]}>
              <Text style={styles.avatarText}>{profile.avatarEmoji}</Text>
              <View style={styles.onlineBadge} />
            </View>
            <View style={styles.mentorInfo}>
              <Text style={styles.mentorLabel}>Mentörün</Text>
              <Text style={styles.mentorName}>{profile.name}</Text>
              <Text style={styles.mentorRole}>{profile.role}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { label: 'Sohbet', icon: '💬' },
            { label: 'Görüşme', icon: '📹' },
            { label: 'Planla', icon: '📅' },
          ].map((action, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionBtn}
              onPress={() => handleAction(action.label)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* This Week's Focus */}
        <Card style={styles.focusCard}>
          <View style={styles.focusHeader}>
            <Text style={styles.focusIcon}>🎯</Text>
            <Text style={styles.focusTitle}>Bu hafta odak</Text>
          </View>
          <Text style={styles.focusGoal}>
            {focusTitle || 'Akşam rutini ve '}
            {focusTitle?.includes('uyku') ? (
              ''
            ) : (
              <Text style={styles.focusHighlight}>uyku kalitesi</Text>
            )}
          </Text>

          <View style={styles.goalsList}>
            {goals.map((goal, i) => (
              <TouchableOpacity
                key={i}
                style={styles.goalItem}
                onPress={() => {
                  if (user?.uid) dispatch(toggleGoal({ uid: user.uid, goalIndex: i }));
                }}
              >
                <Text style={styles.goalCheckbox}>{goal.done ? '✓' : '○'}</Text>
                <Text style={[styles.goalText, goal.done && styles.goalTextDone]}>{goal.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {completedCount}/{goals.length}
            </Text>
          </View>
        </Card>

        {/* Latest Message */}
        {latestMessage && (
          <Card style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageLabel}>Son mesaj</Text>
              <Text style={styles.messageTime}>{latestMessage.timeAgo}</Text>
            </View>
            <View style={styles.messageBubble}>
              <View style={[styles.senderAvatar, { backgroundColor: profile.avatarBg }]}>
                <Text style={styles.senderInitial}>{profile.avatarEmoji}</Text>
              </View>
              <View style={styles.messageContent}>
                <Text style={styles.messageText}>{latestMessage.text}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Next Session */}
        {nextSession && (
          <TouchableOpacity style={styles.sessionCard}>
            <View style={styles.dateBox}>
              <Text style={styles.dayLabel}>{nextSession.day}</Text>
              <Text style={styles.dayNumber}>{nextSession.date}</Text>
            </View>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>{nextSession.title}</Text>
              <Text style={styles.sessionTime}>
                {nextSession.time} · {nextSession.duration}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Chat Modal */}
      <Modal visible={chatVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalSheet}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{profile.name} ile Sohbet</Text>

            <ScrollView style={styles.chatArea} showsVerticalScrollIndicator={false}>
              {latestMessage && (
                <View style={styles.chatMessage}>
                  <View style={[styles.senderAvatar, { backgroundColor: profile.avatarBg }]}>
                    <Text style={styles.senderInitial}>{profile.avatarEmoji}</Text>
                  </View>
                  <View style={styles.chatBubble}>
                    <Text style={styles.chatText}>{latestMessage.text}</Text>
                    <Text style={styles.chatTime}>{latestMessage.timeAgo}</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Mesaj yaz..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
              />
              <TouchableOpacity
                style={[styles.sendBtn, !messageText.trim() && { opacity: 0.4 }]}
                onPress={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Text style={styles.sendBtnText}>→</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.closeChatBtn} onPress={() => setChatVisible(false)}>
              <Text style={styles.closeChatText}>Kapat</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  scrollContent: { paddingBottom: 20 },
  headerGradient: {
    height: 160,
    backgroundColor: colors.royal,
    overflow: 'hidden',
  },
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
  avatarText: { fontSize: 28 },
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
  focusHighlight: { color: colors.gold, fontStyle: 'italic' },
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
  messageCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    gap: 8,
  },
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
  senderInitial: { fontSize: 14 },
  messageContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 10,
  },
  messageText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 17 },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 20 },
  chatArea: { maxHeight: 300, marginBottom: 12 },
  chatMessage: { flexDirection: 'row', gap: 8, marginBottom: 12, alignItems: 'flex-end' },
  chatBubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 10,
  },
  chatText: { fontSize: 13, color: colors.textPrimary, lineHeight: 18 },
  chatTime: { fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 4 },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  chatInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
    maxHeight: 80,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: { color: colors.navy, fontWeight: '700', fontSize: 18 },
  closeChatBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
  },
  closeChatText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
});
