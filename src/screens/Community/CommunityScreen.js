import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfile, updateProfileFirestore } from '../../store/slices/userSlice';
import {
  subscribeToPosts,
  unsubscribeFromPosts,
  createPost,
  toggleLike,
  fetchComments,
  addComment,
} from '../../store/slices/communitySlice';
import { fetchActiveChallenges, joinChallenge } from '../../store/slices/challengesSlice';
import Card from '../../components/common/Card';
import HealthStatusCard from '../../components/features/HealthStatusCard';
import LeaderboardCard from '../../components/features/LeaderboardCard';
import { colors } from '../../constants/designTokens';

const AVATAR_EMOJIS = ['🧘', '🏃', '💪', '🌿', '🎯', '⭐', '🔥', '🏆', '🌸', '🦋', '💫', '🎗'];
const AVATAR_COLORS = [
  colors.royal,
  colors.cyan,
  colors.gold,
  '#8B5CF6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#EC4899',
];

const FILTER_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'health_checkin', label: '💚 Sağlık' },
  { key: 'text', label: '📝 Gönderi' },
];

function Avatar({ emoji, bg, size = 40 }) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={{ fontSize: size * 0.44 }}>{emoji}</Text>
    </View>
  );
}

function StatsRow({ stats }) {
  return (
    <View style={styles.statsRow}>
      {[
        { icon: '⭐', label: 'Wellness', value: stats.wellness },
        { icon: '👟', label: 'Adım', value: `${(stats.steps / 1000).toFixed(1)}k` },
        { icon: '😴', label: 'Uyku', value: `${stats.sleep}s` },
      ].map((s, i) => (
        <React.Fragment key={s.label}>
          {i > 0 && <View style={styles.statsDivider} />}
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

function PostCard({ post, onLike, onAddComment, onFetchComments, comments = [], myProfile }) {
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) onFetchComments(post.postId);
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(post.postId, commentText.trim());
    setCommentText('');
  };

  const timeStr = post.createdAt
    ? new Date(post.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <Card style={styles.postCard}>
      {post.type === 'health_checkin' && post.sharedStats ? (
        <HealthStatusCard
          name={post.author || post.authorName}
          emoji={post.emoji || post.authorEmoji}
          bg={post.bg || post.authorBg}
          wellnessScore={post.sharedStats.wellness || 0}
          steps={post.sharedStats.steps}
          sleep={post.sharedStats.sleep}
          heartRate={post.sharedStats.heartRate}
          calories={post.sharedStats.calories}
          streak={post.sharedStats.streak}
          message={post.text}
          time={timeStr}
          compact
        />
      ) : (
        <>
          <View style={styles.postHeader}>
            <Avatar
              emoji={post.emoji || post.authorEmoji}
              bg={post.bg || post.authorBg}
              size={40}
            />
            <View style={styles.postMeta}>
              <Text style={styles.postAuthor}>{post.author || post.authorName}</Text>
              <Text style={styles.postTime}>{timeStr}</Text>
            </View>
          </View>
          <Text style={styles.postText}>{post.text}</Text>
          {post.sharedStats && <StatsRow stats={post.sharedStats} />}
        </>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
          <Text style={styles.actionIcon}>{post.liked ? '❤️' : '🤍'}</Text>
          <Text style={[styles.actionCount, post.liked && { color: colors.gold }]}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleExpand}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={[styles.actionCount, expanded && { color: colors.cyan }]}>
            {comments.length} {expanded ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {expanded && (
        <View style={styles.commentsSection}>
          {comments.map((c) => (
            <View key={c.commentId || c.id} style={styles.commentRow}>
              <Avatar emoji={c.authorEmoji || c.emoji} bg={c.authorBg || c.bg} size={28} />
              <View style={styles.commentBubble}>
                <Text style={styles.commentAuthor}>{c.authorName || c.author}</Text>
                <Text style={styles.commentText}>{c.text}</Text>
                <Text style={styles.commentTime}>
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : c.time}
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.commentInput}>
            <Avatar emoji={myProfile.emoji} bg={myProfile.bg} size={28} />
            <TextInput
              style={styles.commentField}
              placeholder="Yorum yaz..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              value={commentText}
              onChangeText={setCommentText}
              onSubmitEditing={submitComment}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={submitComment} style={styles.commentSend}>
              <Text style={styles.commentSendText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Card>
  );
}

export default function CommunityScreen({ route }) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile: reduxProfile } = useAppSelector((state) => state.user);
  const { dailyMetrics, wellnessScore } = useAppSelector((state) => state.metrics);
  const { posts, commentsByPost } = useAppSelector((state) => state.community);
  const { challenges, userParticipation } = useAppSelector((state) => state.challenges);

  const initProfile = {
    nickname:
      reduxProfile?.nickname || reduxProfile?.displayName || user?.displayName || 'Kullanıcı',
    bio: reduxProfile?.bio || '',
    emoji: reduxProfile?.avatarEmoji || '🧘',
    bg: reduxProfile?.avatarBg || colors.royal,
  };

  const [myProfile, setMyProfile] = useState(initProfile);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const unsub = dispatch(subscribeToPosts(user?.uid));
    dispatch(fetchActiveChallenges(user?.uid));
    return () => {
      unsubscribeFromPosts();
    };
  }, [user?.uid]);

  // Open check-in modal if navigated here with openCheckIn param
  useEffect(() => {
    if (route?.params?.openCheckIn) {
      setCheckInVisible(true);
    }
  }, [route?.params?.openCheckIn]);

  // Profile edit modal
  const [profileVisible, setProfileVisible] = useState(false);
  const [draft, setDraft] = useState(initProfile);

  // Text post modal
  const [postVisible, setPostVisible] = useState(false);
  const [postText, setPostText] = useState('');
  const [shareStats, setShareStats] = useState(false);

  // Health check-in modal
  const [checkInVisible, setCheckInVisible] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState('');

  // FAB menu
  const [fabOpen, setFabOpen] = useState(false);

  const filteredPosts =
    activeFilter === 'all' ? posts : posts.filter((p) => (p.type || 'text') === activeFilter);

  const openProfileEdit = () => {
    setDraft({ ...myProfile });
    setProfileVisible(true);
  };

  const saveProfile = () => {
    setMyProfile(draft);
    setProfileVisible(false);
    const profileData = {
      nickname: draft.nickname,
      displayName: draft.nickname,
      bio: draft.bio,
      avatarEmoji: draft.emoji,
      avatarBg: draft.bg,
    };
    dispatch(updateProfile(profileData));
    if (user?.uid) dispatch(updateProfileFirestore({ uid: user.uid, ...profileData }));
  };

  const submitPost = () => {
    if (!postText.trim()) return;
    const dm = dailyMetrics;
    dispatch(
      createPost({
        uid: user?.uid,
        authorName: myProfile.nickname,
        authorEmoji: myProfile.emoji,
        authorBg: myProfile.bg,
        text: postText.trim(),
        type: 'text',
        sharedStats:
          shareStats && dm
            ? { wellness: wellnessScore, steps: dm.steps, sleep: dm.sleep?.hours }
            : null,
      })
    );
    setPostText('');
    setShareStats(false);
    setPostVisible(false);
  };

  const submitCheckIn = () => {
    const dm = dailyMetrics;
    dispatch(
      createPost({
        uid: user?.uid,
        authorName: myProfile.nickname,
        authorEmoji: myProfile.emoji,
        authorBg: myProfile.bg,
        text: checkInMessage.trim(),
        type: 'health_checkin',
        sharedStats: {
          wellness: wellnessScore || 0,
          steps: dm?.steps || 0,
          sleep: dm?.sleep?.hours || 0,
          heartRate: dm?.heartRate || 0,
          calories: dm?.calories || 0,
        },
      })
    );
    setCheckInMessage('');
    setCheckInVisible(false);
  };

  const handleToggleLike = (postId, currentlyLiked) => {
    if (!user?.uid) return;
    dispatch(toggleLike({ postId, uid: user.uid, currentlyLiked }));
  };

  const handleAddComment = (postId, text) => {
    if (!user?.uid) return;
    dispatch(
      addComment({
        postId,
        uid: user.uid,
        authorName: myProfile.nickname,
        authorEmoji: myProfile.emoji,
        authorBg: myProfile.bg,
        text,
      })
    );
  };

  const activeChallenge = challenges[0] || null;
  const dm = dailyMetrics;

  const ListHeader = () => (
    <>
      {/* My profile banner */}
      <TouchableOpacity style={styles.profileBanner} onPress={openProfileEdit} activeOpacity={0.85}>
        <View
          style={[
            styles.profileAvatarLg,
            { backgroundColor: myProfile.bg, shadowColor: myProfile.bg },
          ]}
        >
          <Text style={styles.profileAvatarEmoji}>{myProfile.emoji}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{myProfile.nickname}</Text>
          <Text style={styles.profileBio} numberOfLines={2}>
            {myProfile.bio}
          </Text>
          <View style={styles.profileStats}>
            {[
              { label: 'Wellness', value: wellnessScore || '—', color: colors.cyan },
              { label: 'Gönderi', value: posts.length, color: colors.gold },
              {
                label: 'Check-in',
                value: posts.filter((p) => p.authorUid === user?.uid && p.type === 'health_checkin')
                  .length,
                color: colors.success,
              },
            ].map((s) => (
              <View key={s.label} style={styles.profileStat}>
                <Text style={[styles.profileStatVal, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.profileStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.editChevron}>✎</Text>
      </TouchableOpacity>

      {/* Leaderboard */}
      <LeaderboardCard />

      {/* Active challenge */}
      {activeChallenge ? (
        <Card style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>
              {activeChallenge.icon || '🏆'} {activeChallenge.title}
            </Text>
            <Text style={styles.challengeDays}>
              {Math.max(0, Math.ceil((activeChallenge.endDate - Date.now()) / 86400000))} gün kaldı
            </Text>
          </View>
          <Text style={styles.challengeDesc}>{activeChallenge.description}</Text>
          <View style={styles.challengeFooter}>
            <Text style={styles.challengeProgress}>
              {activeChallenge.participantCount || 0} katılımcı
            </Text>
            {!userParticipation[activeChallenge.id] && user?.uid && (
              <TouchableOpacity
                style={styles.joinBtn}
                onPress={() =>
                  dispatch(joinChallenge({ challengeId: activeChallenge.id, uid: user.uid }))
                }
              >
                <Text style={styles.joinBtnText}>Katıl</Text>
              </TouchableOpacity>
            )}
            {userParticipation[activeChallenge.id] && (
              <Text style={styles.joinedBadge}>✓ Katıldın</Text>
            )}
          </View>
        </Card>
      ) : null}

      {/* Header row */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Topluluk</Text>
          <Text style={styles.subtitle}>
            {filteredPosts.length > 0 ? `${filteredPosts.length} gönderi` : 'yükleniyor...'}
          </Text>
        </View>
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabsRow}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, activeFilter === tab.key && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab.key)}
          >
            <Text
              style={[styles.filterTabText, activeFilter === tab.key && styles.filterTabTextActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            myProfile={myProfile}
            onLike={() => handleToggleLike(item.postId, item.liked)}
            onAddComment={handleAddComment}
            onFetchComments={(id) => dispatch(fetchComments(id))}
            comments={commentsByPost[item.postId] || []}
          />
        )}
      />

      {/* FAB */}
      {fabOpen && (
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setFabOpen(false)}
        />
      )}
      <View style={styles.fabContainer}>
        {fabOpen && (
          <View style={styles.fabMenu}>
            <TouchableOpacity
              style={styles.fabMenuItem}
              onPress={() => {
                setFabOpen(false);
                setCheckInVisible(true);
              }}
            >
              <Text style={styles.fabMenuIcon}>💚</Text>
              <Text style={styles.fabMenuText}>Sağlık Check-in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fabMenuItem}
              onPress={() => {
                setFabOpen(false);
                setPostVisible(true);
              }}
            >
              <Text style={styles.fabMenuIcon}>📝</Text>
              <Text style={styles.fabMenuText}>Metin Paylaş</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={[styles.fab, fabOpen && styles.fabOpen]}
          onPress={() => setFabOpen((v) => !v)}
          activeOpacity={0.85}
        >
          <Text style={styles.fabIcon}>{fabOpen ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Profile Edit Modal ── */}
      <Modal visible={profileVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalSheet}
          >
            <View style={styles.modalHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Profili Düzenle</Text>
              <View style={styles.previewRow}>
                <View style={[styles.previewAvatar, { backgroundColor: draft.bg }]}>
                  <Text style={styles.previewEmoji}>{draft.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.previewName}>{draft.nickname || 'Kullanıcı adın'}</Text>
                  <Text style={styles.previewHint}>Önizleme</Text>
                </View>
              </View>
              <Text style={styles.pickerLabel}>Emoji</Text>
              <View style={styles.emojiGrid}>
                {AVATAR_EMOJIS.map((em) => (
                  <TouchableOpacity
                    key={em}
                    style={[
                      styles.emojiBtn,
                      draft.emoji === em && {
                        borderColor: colors.cyan,
                        backgroundColor: 'rgba(20,184,212,0.15)',
                      },
                    ]}
                    onPress={() => setDraft((d) => ({ ...d, emoji: em }))}
                  >
                    <Text style={styles.emojiBtnText}>{em}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.pickerLabel}>Renk</Text>
              <View style={styles.colorRow}>
                {AVATAR_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorDot,
                      { backgroundColor: color },
                      draft.bg === color && styles.colorDotSelected,
                    ]}
                    onPress={() => setDraft((d) => ({ ...d, bg: color }))}
                  />
                ))}
              </View>
              <Text style={styles.pickerLabel}>Kullanıcı adı</Text>
              <TextInput
                style={styles.textField}
                value={draft.nickname}
                onChangeText={(v) => setDraft((d) => ({ ...d, nickname: v }))}
                placeholder="Kullanıcı adın..."
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
              <Text style={styles.pickerLabel}>Bio</Text>
              <TextInput
                style={[styles.textField, { height: 80 }]}
                value={draft.bio}
                onChangeText={(v) => setDraft((d) => ({ ...d, bio: v }))}
                placeholder="Kendini tanıt..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                textAlignVertical="top"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
                  <Text style={styles.saveBtnText}>Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setProfileVisible(false)}>
                  <Text style={styles.cancelBtnText}>İptal</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 24 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ── New Text Post Modal ── */}
      <Modal visible={postVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalSheet}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>📝 Gönderi Paylaş</Text>
            <View style={styles.composerRow}>
              <Avatar emoji={myProfile.emoji} bg={myProfile.bg} size={40} />
              <TextInput
                style={[styles.textField, { flex: 1, marginBottom: 0 }]}
                value={postText}
                onChangeText={setPostText}
                placeholder="Bir şeyler paylaş..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                autoFocus
              />
            </View>
            <TouchableOpacity
              style={[styles.statsToggle, shareStats && styles.statsToggleOn]}
              onPress={() => setShareStats((s) => !s)}
            >
              <View style={[styles.toggleCheck, shareStats && styles.toggleCheckOn]}>
                {shareStats && <Text style={styles.toggleCheckMark}>✓</Text>}
              </View>
              <Text style={[styles.statsToggleText, shareStats && { color: colors.gold }]}>
                Wellness istatistiklerimi ekle
              </Text>
            </TouchableOpacity>
            {shareStats && dm && (
              <StatsRow
                stats={{ wellness: wellnessScore, steps: dm.steps, sleep: dm.sleep?.hours }}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.saveBtn, !postText.trim() && { opacity: 0.4 }]}
                onPress={submitPost}
                disabled={!postText.trim()}
              >
                <Text style={styles.saveBtnText}>Paylaş</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setPostVisible(false);
                  setPostText('');
                  setShareStats(false);
                }}
              >
                <Text style={styles.cancelBtnText}>İptal</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 24 }} />
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ── Health Check-In Modal ── */}
      <Modal visible={checkInVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalSheet}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>💚 Sağlık Check-in</Text>

            {/* Preview card */}
            <HealthStatusCard
              name={myProfile.nickname}
              emoji={myProfile.emoji}
              bg={myProfile.bg}
              wellnessScore={wellnessScore || 0}
              steps={dm?.steps}
              sleep={dm?.sleep?.hours}
              heartRate={dm?.heartRate}
              calories={dm?.calories}
              message={checkInMessage || undefined}
              compact
            />

            <Text style={[styles.pickerLabel, { marginTop: 16 }]}>Mesaj (isteğe bağlı)</Text>
            <TextInput
              style={[styles.textField, { height: 72 }]}
              value={checkInMessage}
              onChangeText={setCheckInMessage}
              placeholder="Bugün nasılsın?"
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              textAlignVertical="top"
            />

            {(!dm || wellnessScore === 0) && (
              <Text style={styles.noMetricsHint}>
                💡 Sağlık sekmesinden metrik girerek daha zengin bir check-in paylaşabilirsin.
              </Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={submitCheckIn}>
                <Text style={styles.saveBtnText}>Paylaş</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setCheckInVisible(false);
                  setCheckInMessage('');
                }}
              >
                <Text style={styles.cancelBtnText}>İptal</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 24 }} />
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },

  // Profile banner
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 14,
  },
  profileAvatarLg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  profileAvatarEmoji: { fontSize: 26 },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  profileBio: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
  profileStats: { flexDirection: 'row', gap: 16, marginTop: 6 },
  profileStat: { alignItems: 'center' },
  profileStatVal: { fontSize: 14, fontWeight: '700' },
  profileStatLabel: { fontSize: 9, color: colors.textTertiary, fontWeight: '600' },
  editChevron: { fontSize: 16, color: colors.textTertiary },

  // Challenge
  challengeCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
    borderWidth: 0,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    backgroundColor: 'rgba(201, 150, 26, 0.06)',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  challengeDays: { fontSize: 11, color: colors.gold },
  challengeDesc: { fontSize: 12, color: colors.textSecondary },
  challengeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  challengeProgress: { fontSize: 10, color: colors.textTertiary },
  joinBtn: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: colors.gold,
    borderRadius: 999,
  },
  joinBtnText: { fontSize: 11, fontWeight: '700', color: colors.navy },
  joinedBadge: { fontSize: 11, color: colors.success, fontWeight: '600' },

  // Header + filter
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  filterTabsRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterTabActive: { backgroundColor: colors.cyan, borderColor: colors.cyan },
  filterTabText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  filterTabTextActive: { color: colors.navy, fontWeight: '700' },

  // Avatar
  avatar: { alignItems: 'center', justifyContent: 'center' },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  statIcon: { fontSize: 14 },
  statValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginTop: 3 },
  statLabel: {
    fontSize: 9,
    color: colors.textTertiary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statsDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)' },

  // Post card
  postCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.cyan,
    backgroundColor: 'rgba(20, 184, 212, 0.06)',
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  postMeta: { gap: 2 },
  postAuthor: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  postTime: { fontSize: 10, color: colors.textTertiary },
  postText: { fontSize: 13, color: colors.textPrimary, lineHeight: 19 },
  postActions: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionIcon: { fontSize: 16 },
  actionCount: { fontSize: 13, color: colors.textSecondary },

  // Comments
  commentsSection: {
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  commentRow: { flexDirection: 'row', gap: 8 },
  commentBubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 10,
  },
  commentAuthor: { fontSize: 11, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  commentText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 17, marginBottom: 3 },
  commentTime: { fontSize: 9, color: colors.textTertiary },
  commentInput: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  commentField: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.textPrimary,
    fontSize: 12,
  },
  commentSend: {
    backgroundColor: colors.cyan,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentSendText: { color: colors.navy, fontWeight: '700', fontSize: 14 },

  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    alignItems: 'flex-end',
    gap: 10,
  },
  fabMenu: { gap: 8, alignItems: 'flex-end' },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bgSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabMenuIcon: { fontSize: 18 },
  fabMenuText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  fabOpen: { backgroundColor: colors.gold },
  fabIcon: { fontSize: 24, color: colors.navy, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
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

  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    marginBottom: 20,
  },
  previewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  previewEmoji: { fontSize: 22 },
  previewName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  previewHint: { fontSize: 10, color: colors.textTertiary, marginTop: 2 },
  pickerLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '600', marginBottom: 10 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  emojiBtnText: { fontSize: 20 },
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  colorDot: { width: 30, height: 30, borderRadius: 15, borderWidth: 3, borderColor: 'transparent' },
  colorDotSelected: { borderColor: colors.white },
  textField: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: 16,
  },
  composerRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 14 },
  statsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 14,
  },
  statsToggleOn: { backgroundColor: 'rgba(201,150,26,0.1)' },
  toggleCheck: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleCheckOn: { backgroundColor: colors.gold },
  toggleCheckMark: { fontSize: 12, color: colors.navy, fontWeight: '800' },
  statsToggleText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  noMetricsHint: {
    fontSize: 12,
    color: colors.textTertiary,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    lineHeight: 18,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  saveBtn: {
    flex: 1,
    backgroundColor: colors.cyan,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnText: { color: colors.navy, fontWeight: '700', fontSize: 14 },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelBtnText: { color: colors.textSecondary, fontWeight: '600', fontSize: 14 },
});
