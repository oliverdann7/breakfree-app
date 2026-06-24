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
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  query,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateProfile,
  updateProfileFirestore,
  fetchUserStats,
} from '../../store/slices/userSlice';
import {
  fetchPosts,
  createPost,
  toggleLike,
  fetchComments,
  addComment,
  realtimePostsUpdate,
  requestMorePosts,
  POSTS_PAGE_SIZE,
} from '../../store/slices/communitySlice';
import { fetchActiveChallenges, joinChallenge } from '../../store/slices/challengesSlice';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import LeaderboardCard from '../../components/features/LeaderboardCard';
import HealthStatusCard from '../../components/features/HealthStatusCard';
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

  return (
    <Card style={styles.postCard}>
      <View style={styles.postHeader}>
        <Avatar emoji={post.emoji} bg={post.bg} size={40} label={post.author} />
        <View style={styles.postMeta}>
          <Text style={styles.postAuthor}>{post.author}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
      </View>

      <Text style={styles.postText}>{post.text}</Text>

      {post.sharedStats && <StatsRow stats={post.sharedStats} />}

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
              <Avatar
                emoji={c.authorEmoji || c.emoji}
                bg={c.authorBg || c.bg}
                size={28}
                label={c.authorName || c.author}
              />
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
            <Avatar
              emoji={myProfile.emoji}
              bg={myProfile.bg}
              size={28}
              label={myProfile.nickname}
            />
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

export default function CommunityScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { profile: reduxProfile } = useAppSelector((state) => state.user);
  const { dailyMetrics, wellnessScore } = useAppSelector((state) => state.metrics);
  const { posts, commentsByPost, loadingMorePosts, hasMorePosts } = useAppSelector(
    (state) => state.community
  );
  const { stats } = useAppSelector((state) => state.user);
  const {
    challenges,
    userParticipation,
    loading: challengesLoading,
  } = useAppSelector((state) => state.challenges);

  const initProfile = {
    nickname:
      reduxProfile?.nickname || reduxProfile?.displayName || user?.displayName || 'Kullanıcı',
    bio: reduxProfile?.bio || '',
    emoji: reduxProfile?.avatarEmoji || '🧘',
    bg: reduxProfile?.avatarBg || colors.royal,
  };

  const [myProfile, setMyProfile] = useState(initProfile);

  // Realtime feed window. Grows by POSTS_PAGE_SIZE each time the user scrolls
  // to the end; the listener re-subscribes with the larger limit.
  const [pageSize, setPageSize] = useState(POSTS_PAGE_SIZE);
  const unsubPostsRef = useRef(null);

  useEffect(() => {
    if (user?.uid) dispatch(fetchUserStats(user.uid));
    if (user?.uid) dispatch(fetchActiveChallenges(user.uid));
  }, [user?.uid, dispatch]);

  useEffect(() => {
    if (!db) {
      dispatch(fetchPosts({ uid: user?.uid, pageSize }));
      return;
    }

    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      firestoreLimit(pageSize)
    );
    const unsub = onSnapshot(q, async (snap) => {
      const uid = user?.uid;
      const posts = await Promise.all(
        snap.docs.map(async (d) => {
          const post = { postId: d.id, ...d.data() };
          if (uid) {
            const likeSnap = await getDoc(doc(db, 'liked_posts', `${uid}_${d.id}`));
            post.liked = likeSnap.exists();
          } else {
            post.liked = false;
          }
          return post;
        })
      );
      dispatch(realtimePostsUpdate({ posts, hasMore: snap.docs.length >= pageSize }));
    });
    unsubPostsRef.current = unsub;
    return () => unsub();
  }, [user?.uid, pageSize, dispatch]);

  const handleLoadMore = () => {
    if (loadingMorePosts || !hasMorePosts || posts.length === 0) return;
    dispatch(requestMorePosts());
    setPageSize((size) => size + POSTS_PAGE_SIZE);
  };

  // Profile edit modal
  const [profileVisible, setProfileVisible] = useState(false);
  const [draft, setDraft] = useState(initProfile);

  // Post create modal
  const [postVisible, setPostVisible] = useState(false);
  const [postText, setPostText] = useState('');
  const [shareStats, setShareStats] = useState(false);

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
    if (user?.uid) {
      dispatch(updateProfileFirestore({ uid: user.uid, ...profileData }));
    }
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

  const handleFetchComments = (postId) => {
    dispatch(fetchComments(postId));
  };

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
              { label: 'Seri', value: `${stats?.streak || 0}g`, color: colors.gold },
              { label: 'Talk', value: String(stats?.totalTalks || 0), color: colors.cyan },
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

      {/* Header row */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Topluluk</Text>
          <Text style={styles.subtitle}>
            akışı <Text style={{ color: colors.gold }}>·</Text>{' '}
            {posts.length > 0 ? `${posts.length} gönderi` : 'yükleniyor...'}
          </Text>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={() => setPostVisible(true)}>
          <Text style={styles.createBtnText}>+ Paylaş</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly challenge */}
      {challenges.length > 0 ? (
        challenges.slice(0, 3).map((challenge) => {
          const participation = userParticipation[challenge.id];
          const daysLeft = Math.ceil((challenge.endDate - Date.now()) / 86400000);
          const hasJoined = !!participation;
          const progress = challenge.targetMetric
            ? Math.min(100, ((participation?.currentProgress || 0) / challenge.targetValue) * 100)
            : 0;

          return (
            <Card key={challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeTitle}>🏆 {challenge.title || 'Meydan Okuma'}</Text>
                <Text style={styles.challengeDays}>
                  {daysLeft > 0 ? `${daysLeft} gün kaldı` : 'Son gün'}
                </Text>
              </View>
              <Text style={styles.challengeDesc}>
                {challenge.description || 'Hedefini tamamla!'}
              </Text>
              {hasJoined ? (
                <>
                  <View style={styles.challengeBar}>
                    <View style={[styles.challengeFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.challengeProgress}>
                    {participation.currentProgress || 0}/{challenge.targetValue}{' '}
                    {challenge.targetMetric} · {challenge.participantCount || 0} katılımcı
                  </Text>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.joinBtn}
                  onPress={() =>
                    dispatch(joinChallenge({ challengeId: challenge.id, uid: user?.uid }))
                  }
                >
                  <Text style={styles.joinBtnText}>Katıl →</Text>
                </TouchableOpacity>
              )}
            </Card>
          );
        })
      ) : challengesLoading ? null : (
        <Card style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>🏆 Aktif Meydan Okuma</Text>
          </View>
          <Text style={styles.challengeDesc}>Şu anda aktif bir meydan okuma bulunmuyor.</Text>
        </Card>
      )}

      {/* Leaderboard */}
      <LeaderboardCard />

      {/* My health status */}
      {dailyMetrics && (
        <HealthStatusCard
          name={myProfile.nickname}
          emoji={myProfile.emoji}
          bg={myProfile.bg}
          wellnessScore={wellnessScore}
          steps={dailyMetrics.steps}
          sleep={dailyMetrics.sleep?.hours}
          heartRate={dailyMetrics.heartRate}
          calories={dailyMetrics.calories}
          streak={stats?.streak}
          compact
        />
      )}

      <Text style={styles.feedTitle}>Son Paylaşımlar</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeader />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMorePosts ? (
            <ActivityIndicator
              color={colors.cyan}
              style={styles.feedFooter}
              accessibilityLabel="Daha fazla gönderi yükleniyor"
            />
          ) : !hasMorePosts && posts.length > 0 ? (
            <Text style={styles.feedEnd}>Akışın sonuna ulaştın</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            myProfile={myProfile}
            onLike={() => handleToggleLike(item.postId, item.liked)}
            onAddComment={handleAddComment}
            onFetchComments={handleFetchComments}
            comments={commentsByPost[item.postId] || []}
          />
        )}
      />

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

              {/* Preview */}
              <View style={styles.previewRow}>
                <View style={[styles.previewAvatar, { backgroundColor: draft.bg }]}>
                  <Text style={styles.previewEmoji}>{draft.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.previewName}>{draft.nickname || 'Kullanıcı adın'}</Text>
                  <Text style={styles.previewHint}>Önizleme</Text>
                </View>
              </View>

              {/* Emoji picker */}
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

              {/* Color picker */}
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

              {/* Nickname */}
              <Text style={styles.pickerLabel}>Kullanıcı adı</Text>
              <TextInput
                style={styles.textField}
                value={draft.nickname}
                onChangeText={(v) => setDraft((d) => ({ ...d, nickname: v }))}
                placeholder="Kullanıcı adın..."
                placeholderTextColor="rgba(255,255,255,0.3)"
              />

              {/* Bio */}
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

      {/* ── New Post Modal ── */}
      <Modal visible={postVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalSheet}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Paylaş</Text>

            <View style={styles.composerRow}>
              <Avatar
                emoji={myProfile.emoji}
                bg={myProfile.bg}
                size={40}
                label={myProfile.nickname}
              />
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

            {/* Share stats toggle */}
            <TouchableOpacity
              style={[styles.statsToggle, shareStats && styles.statsToggleOn]}
              onPress={() => setShareStats((s) => !s)}
            >
              <View style={[styles.toggleCheck, shareStats && styles.toggleCheckOn]}>
                {shareStats && <Text style={styles.toggleCheckMark}>✓</Text>}
              </View>
              <Text style={[styles.statsToggleText, shareStats && { color: colors.gold }]}>
                Wellness istatistiklerimi paylaş
              </Text>
            </TouchableOpacity>

            {shareStats && dailyMetrics && (
              <StatsRow
                stats={{
                  wellness: wellnessScore,
                  steps: dailyMetrics.steps,
                  sleep: dailyMetrics.sleep.hours,
                }}
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

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  createBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.cyan,
    borderRadius: 999,
  },
  createBtnText: { color: colors.navy, fontSize: 13, fontWeight: '600' },

  // Challenge
  challengeCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
    backgroundColor: 'rgba(201, 150, 26, 0.06)',
  },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  challengeTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  challengeDays: { fontSize: 11, color: colors.gold },
  challengeDesc: { fontSize: 12, color: colors.textSecondary },
  challengeBar: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  challengeFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 3 },
  challengeProgress: { fontSize: 10, color: colors.textTertiary },
  joinBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.cyan,
    borderRadius: 999,
  },
  joinBtnText: { color: colors.navy, fontSize: 12, fontWeight: '700' },
  feedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  feedFooter: { paddingVertical: 24 },
  feedEnd: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: 12,
    paddingVertical: 24,
  },

  // Stats row (shared stats card in post)
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

  // Profile modal
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

  // Post modal
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

  // Modal actions
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
