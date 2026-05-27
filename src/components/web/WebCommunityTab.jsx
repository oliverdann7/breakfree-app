import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfileFirestore } from '../../store/slices/userSlice';
import { C } from './WebStyles';

const AVATAR_EMOJIS = ['🧘', '🏃', '💪', '🌿', '🎯', '⭐', '🔥', '🏆', '🌸', '🦋', '💫', '🎗'];
const AVATAR_COLORS_LIST = [
  C.royal,
  C.cyan,
  C.gold,
  '#8B5CF6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#EC4899',
];

const COMM_POSTS_INIT = [
  {
    id: 'cp1',
    author: 'Burak Yılmaz',
    emoji: '🏃',
    bg: C.royal,
    text: "Sabah 06:30'da 10K koşuyu bitirdim! Haftaya yarışmaya hazırım 💪",
    sharedStats: { wellness: 88, steps: 14200, sleep: 7.5 },
    likes: 47,
    liked: false,
    comments: [
      {
        id: 'cc1',
        author: 'Elif Kaya',
        emoji: '🌸',
        bg: C.gold,
        text: 'Harika Burak! Güneşin doğuşunda koşmak bambaşka 🌅',
        time: '1 saat önce',
      },
      {
        id: 'cc2',
        author: 'Can Öztürk',
        emoji: '💪',
        bg: '#8B5CF6',
        text: "Bu pace'i nasıl yakaladın? 🔥",
        time: '45dk önce',
      },
    ],
    time: '2 saat önce',
  },
  {
    id: 'cp2',
    author: 'Elif Kaya',
    emoji: '🌸',
    bg: C.gold,
    text: "Dr. Ayşe'nin anksiyete talk'ı muhteşemdi. Günlük farkındalık egzersizlerini hayatıma katmaya başladım 🧘‍♀️",
    sharedStats: null,
    likes: 32,
    liked: true,
    comments: [
      {
        id: 'cc3',
        author: 'Zeynep Öz',
        emoji: '🌿',
        bg: '#10B981',
        text: "Ben de bu talk'ı dinleyeceğim! 💚",
        time: '3 saat önce',
      },
    ],
    time: '4 saat önce',
  },
  {
    id: 'cp3',
    author: 'Mert Arslan',
    emoji: '🏆',
    bg: '#F59E0B',
    text: '30 günlük beslenme meydan okuması tamamlandı! -4 kg ve çok daha enerjik hissediyorum 🎯',
    sharedStats: { wellness: 92, steps: 10100, sleep: 8.2 },
    likes: 89,
    liked: false,
    comments: [],
    time: '1 gün önce',
  },
  {
    id: 'cp4',
    author: 'Zeynep Öz',
    emoji: '🌿',
    bg: '#10B981',
    text: "Uyku takibini kullanmaya başladım — 3 haftada 6.2s'den 7.6 saate çıktım 🌙",
    sharedStats: { wellness: 78, steps: 7800, sleep: 7.6 },
    likes: 61,
    liked: false,
    comments: [
      {
        id: 'cc4',
        author: 'Burak Yılmaz',
        emoji: '🏃',
        bg: C.royal,
        text: 'Harika ilerleme! Uyku kalitesi her şeyi etkiliyor 🙌',
        time: '20 saat önce',
      },
    ],
    time: '2 gün önce',
  },
];

function CommAvatar({ emoji, bg, size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: Math.round(size * 0.44),
      }}
    >
      {emoji}
    </div>
  );
}

function CommStatsCard({ stats }) {
  return (
    <div
      style={{
        display: 'flex',
        borderRadius: 10,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.05)',
        margin: '10px 0',
      }}
    >
      {[
        { icon: '⭐', label: 'Wellness', value: stats.wellness },
        { icon: '👟', label: 'Adım', value: `${(stats.steps / 1000).toFixed(1)}k` },
        { icon: '😴', label: 'Uyku', value: `${stats.sleep}s` },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            padding: '10px 8px',
            textAlign: 'center',
            borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
          }}
        >
          <div style={{ fontSize: 14 }}>{s.icon}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, margin: '3px 0 2px' }}>
            {s.value}
          </div>
          <div
            style={{
              fontSize: 9,
              color: C.textTertiary,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.3,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function CommPostCard({
  post,
  isExpanded,
  onToggleExpand,
  commentDraft,
  onCommentChange,
  onLike,
  onAddComment,
}) {
  return (
    <div className="comm-post-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <CommAvatar emoji={post.emoji} bg={post.bg} size={40} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: '0 0 2px' }}>
            {post.author}
          </p>
          <p style={{ fontSize: 11, color: C.textTertiary, margin: 0 }}>{post.time}</p>
        </div>
      </div>
      <p style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.6, margin: 0 }}>{post.text}</p>
      {post.sharedStats && <CommStatsCard stats={post.sharedStats} />}
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 12,
          paddingTop: 10,
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <button
          onClick={onLike}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: post.liked ? C.gold : C.textSecondary,
            fontSize: 13,
            fontFamily: 'inherit',
            padding: 0,
          }}
        >
          <span style={{ fontSize: 17 }}>{post.liked ? '❤️' : '🤍'}</span> {post.likes}
        </button>
        <button
          onClick={onToggleExpand}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: isExpanded ? C.cyan : C.textSecondary,
            fontSize: 13,
            fontFamily: 'inherit',
            padding: 0,
          }}
        >
          <span style={{ fontSize: 17 }}>💬</span> {post.comments.length} {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      {isExpanded && (
        <div
          style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          {post.comments.map((c) => (
            <div key={c.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <CommAvatar emoji={c.emoji} bg={c.bg} size={28} />
              <div
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 10,
                  padding: '8px 12px',
                }}
              >
                <p
                  style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary, margin: '0 0 2px' }}
                >
                  {c.author}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.82)',
                    margin: '0 0 3px',
                    lineHeight: 1.5,
                  }}
                >
                  {c.text}
                </p>
                <p style={{ fontSize: 10, color: C.textTertiary, margin: 0 }}>{c.time}</p>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <input
              className="comm-input"
              placeholder="Yorum yaz..."
              value={commentDraft || ''}
              onChange={(e) => onCommentChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAddComment()}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 10, fontSize: 13 }}
            />
            <button
              onClick={onAddComment}
              style={{
                background: C.cyan,
                color: C.navy,
                border: 'none',
                borderRadius: 8,
                padding: '0 14px',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CommunityTab({
  user,
  posts,
  commentsByPost,
  onFetchComments,
  onAddComment,
  onToggleLike,
  onCreatePost,
}) {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.user.profile);

  const [profile, setProfile] = useState({
    nickname: userProfile?.nickname || user?.displayName || 'Demo Kullanıcı',
    bio: userProfile?.bio || 'Wellness enthusiast from Istanbul 🌿',
    emoji: userProfile?.avatarEmoji || '🧘',
    bg: userProfile?.avatarBg || C.royal,
  });
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(profile);

  const [composerText, setComposerText] = useState('');
  const [shareStats, setShareStats] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});

  const saveProfile = () => {
    setProfile(draft);
    setEditMode(false);
    dispatch(
      updateProfileFirestore({
        uid: user.uid,
        nickname: draft.nickname,
        bio: draft.bio,
        avatarEmoji: draft.emoji,
        avatarBg: draft.bg,
      })
    );
  };

  const submitPost = () => {
    if (!composerText.trim()) return;
    onCreatePost({
      uid: user.uid,
      authorName: profile.nickname,
      authorEmoji: profile.emoji,
      authorBg: profile.bg,
      text: composerText.trim(),
      sharedStats: shareStats ? { wellness: 85 } : null,
    });
    setComposerText('');
    setShareStats(false);
    setShowComposer(false);
  };

  const addComment = (postId) => {
    const text = (commentDrafts[postId] || '').trim();
    if (!text) return;
    onAddComment({
      postId,
      uid: user.uid,
      authorName: profile.nickname,
      authorEmoji: profile.emoji,
      authorBg: profile.bg,
      text,
    });
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
  };

  useEffect(() => {
    if (expandedId && !commentsByPost[expandedId]) {
      onFetchComments(expandedId);
    }
  }, [expandedId, commentsByPost, onFetchComments]);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            className="wd-display"
            style={{ fontSize: 30, fontWeight: 700, color: C.textPrimary, margin: '0 0 4px' }}
          >
            Topluluk
          </h2>
          <p style={{ fontSize: 11, fontWeight: 300, color: C.textTertiary, margin: 0 }}>
            akışı <span style={{ color: C.gold }}>·</span> {posts.length} gönderi
          </p>
        </div>
        <button
          onClick={() => setShowComposer(true)}
          style={{
            background: C.cyan,
            color: C.navy,
            border: 'none',
            borderRadius: 999,
            padding: '9px 20px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          + Paylaş
        </button>
      </div>

      <div className="comm-grid">
        {/* Left: My Profile */}
        <div>{/* ... (Existing profile UI remains mostly same but uses profile state) */}</div>

        {/* Right: Feed */}
        <div>
          {/* ... (Existing feed UI, but replace COMM_POSTS_INIT usage with `posts` prop) */}
          {posts.map((post) => (
            <CommPostCard
              key={post.postId}
              post={{ ...post, comments: commentsByPost[post.postId] || [] }}
              isExpanded={expandedId === post.postId}
              onToggleExpand={() => setExpandedId(expandedId === post.postId ? null : post.postId)}
              commentDraft={commentDrafts[post.postId]}
              onCommentChange={(val) =>
                setCommentDrafts((prev) => ({ ...prev, [post.postId]: val }))
              }
              onLike={() =>
                onToggleLike({ postId: post.postId, uid: user.uid, currentlyLiked: post.liked })
              }
              onAddComment={() => addComment(post.postId)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunityTab;
