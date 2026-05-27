import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import MetricLoggerModal from './MetricLoggerModal';
import { fetchMetrics } from '../store/slices/metricsSlice';
import { seedTalks } from '../store/slices/talksSlice';
import { fetchTalks } from '../store/slices/talksSlice';
import {
  fetchPosts,
  createPost,
  toggleLike,
  fetchComments,
  addComment,
} from '../store/slices/communitySlice';
import { C, CSS, TABS } from './web/WebStyles';
import HomeTab from './web/WebHomeTab';
import TalksTab from './web/WebTalksTab';
import HealthTab from './web/WebHealthTab';
import CommunityTab from './web/WebCommunityTab';
import ProfileTab from './web/WebProfileTab';

const Logo = ({ size = 30 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 178.9 263.7"
    width={size}
    height={size}
    style={{ display: 'block', flexShrink: 0 }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#0072B0"
      d="M136.7,112.6c-23.8-35.8-85.4,9.4-61.6-82.3C65,50.5,58.4,72.5,56.1,95.8c3.5,13.7,10.8,27,19.3,37.7c1.4,1.8,2.9,3.6,4.6,5.4c8.5,9.3,18,16.3,26.6,20.1c2.4,1,4.7,1.8,6.8,2.2c-12.1-10.7-33.8-39.8-20.2-52.7C101.6,100.5,120,101.5,136.7,112.6L136.7,112.6z M62.8,166.6c6.1,20.7,15.7,40.1,28.3,57.5c-5.4-13.7-9.2-28.1-11.2-43c-4.2-3.2-8.5-6.6-12.7-10.3C65.7,169.4,64.2,168,62.8,166.6L62.8,166.6z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#0072B0"
      d="M89.2,53.6c6.6,0,12,5.4,12,12c0,6.7-5.4,12.1-12,12.1c-6.7,0-12.1-5.4-12.1-12.1C77.1,59,82.5,53.6,89.2,53.6L89.2,53.6z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#C9961A"
      d="M110.1,108.9c1.3,1.2,2.4,2.5,3.7,3.8c21,23.1,28.2,49.6,16.1,59.2C95.9,198.7,1.8,86.6,65.8,43.1c-33.7,26.7-14.9,74.5,9,100.8c17.8,19.7,40.1,29.3,49.8,21.7c9.7-7.7,3.2-29.8-14.7-49.4c-2.5-2.7-5.1-5.2-7.7-7.6c2.2-0.3,4.4-0.3,6.9,0.1C109.5,108.8,109.8,108.8,110.1,108.9L110.1,108.9z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#C9961A"
      d="M39.8,81.6c-1.3,0.8-2.6,1.7-3.7,2.8c-15.6,15-1.4,51.3,31.7,81c46.8,42.1,98,45.1,87.3,5.1c1,6.7-1.5,12.7-5.2,16.3c-12,11.9-45.6-0.6-75.1-27.7c-27.4-25.3-41.6-54.5-33.9-67.9C40.3,88,40,84.8,39.8,81.6L39.8,81.6z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#C9961A"
      d="M144.1,232.2c-22.7-9.1-92-5.5-113.7,6C63.5,216.7,109.1,214.3,144.1,232.2L144.1,232.2z"
    />
  </svg>
);

export default function WebDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { dailyMetrics, weeklyData, wellnessScore, loading } = useAppSelector(
    (state) => state.metrics
  );
  const { allTalks } = useAppSelector((state) => state.talks);
  const { posts, commentsByPost } = useAppSelector((state) => state.community);
  const [activeTab, setActiveTab] = useState('home');
  const [showLogger, setShowLogger] = useState(false);

  useEffect(() => {
    dispatch(fetchMetrics(user.uid));
    dispatch(fetchTalks());
    dispatch(fetchPosts(user.uid));
  }, [dispatch, user]);

  const handleLogout = () => {
    if (window.confirm('Hesabından çıkmak istediğine emin misin?')) {
      dispatch(logout());
    }
  };

  const metricsProps = { metrics: { dailyMetrics }, weeklyData, wellnessScore, loading };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab user={user} {...metricsProps} onLogMetrics={() => setShowLogger(true)} />;
      case 'talks':
        return (
          <TalksTab
            talks={allTalks}
            onSeed={() => dispatch(seedTalks()).then(() => dispatch(fetchTalks()))}
          />
        );
      case 'health':
        return <HealthTab {...metricsProps} />;
      case 'community':
        return (
          <CommunityTab
            user={user}
            posts={posts}
            commentsByPost={commentsByPost}
            onFetchComments={(postId) => dispatch(fetchComments(postId))}
            onAddComment={(data) => dispatch(addComment(data))}
            onToggleLike={(data) => dispatch(toggleLike(data))}
            onCreatePost={(data) => dispatch(createPost(data))}
          />
        );
      case 'profile':
        return <ProfileTab user={user} onLogout={handleLogout} weeklyData={weeklyData} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="wd-root"
      style={{ minHeight: '100vh', background: C.navyDeep, color: C.textPrimary }}
    >
      <style>{CSS}</style>

      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="wd-sidebar">
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 28px' }}>
          <Logo size={34} />
          <span
            className="wd-display"
            style={{ fontSize: 19, fontWeight: 500, color: C.textPrimary }}
          >
            Break<span style={{ color: C.gold, fontStyle: 'italic' }}>Free</span>
          </span>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1 }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`wd-nav-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User chip at bottom */}
        {user && (
          <div
            style={{
              padding: '16px 8px 0',
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: C.cyan,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${C.gold}`,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 800, color: C.navy }}>
                  {(user.displayName || 'U')
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.textPrimary,
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.displayName || 'Kullanıcı'}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: C.textTertiary,
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── Mobile header ───────────────────────────────────── */}
      <div
        className="wd-mobile-header"
        style={{
          borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)`,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={28} />
            <span
              className="wd-display"
              style={{ fontSize: 17, fontWeight: 500, color: C.textPrimary }}
            >
              Break<span style={{ color: C.gold, fontStyle: 'italic' }}>Free</span>
            </span>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 14 }}>🔔</span>
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────── */}
      <div className="wd-main-desktop">
        {/* Desktop top bar */}
        <div
          style={{
            borderBottom: `1px solid ${C.border}`,
            background: `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)`,
            padding: '0 32px',
          }}
          className="wd-desktop-topbar"
        >
          <style>{`.wd-desktop-topbar { display: none; } @media (min-width: 768px) { .wd-desktop-topbar { display: flex; align-items: center; justify-content: flex-end; padding: 14px 32px; gap: 14px; } }`}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: C.textTertiary }}>
              {new Date().toLocaleDateString('tr-TR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>
          <div style={{ width: 1, height: 16, background: C.border }} />
          <div
            style={{
              background: loading ? 'rgba(20,184,212,0.1)' : `rgba(20,184,212,0.12)`,
              border: `1px solid rgba(20,184,212,0.25)`,
              borderRadius: 999,
              padding: '5px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 10, color: C.cyan }}>●</span>
            <span style={{ fontSize: 12, color: C.cyan, fontWeight: 600 }}>
              Wellness: {loading ? '…' : wellnessScore}
            </span>
          </div>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 15 }}>🔔</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="wd-content-inner wd-scroll" style={{ overflowY: 'auto' }}>
          {renderContent()}
        </div>
      </div>

      {/* ── Mobile bottom nav ────────────────────────────────── */}
      <div className="wd-bottom-nav">
        <div style={{ display: 'flex' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`wd-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div style={{ fontSize: 20, marginBottom: 3 }}>{tab.icon}</div>
              <div>{tab.label}</div>
            </button>
          ))}
        </div>
      </div>

      {showLogger && <MetricLoggerModal uid={user.uid} onClose={() => setShowLogger(false)} />}
    </div>
  );
}
