import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { fetchMetrics } from '../store/slices/metricsSlice';
import { updateProfile } from '../store/slices/userSlice';

const C = {
  navyDeep: '#061829',
  navy: '#0A2540',
  royal: '#0072B0',
  cyan: '#14B8D4',
  gold: '#C9961A',
  green: '#00FF88',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textTertiary: 'rgba(255,255,255,0.35)',
  border: 'rgba(255,255,255,0.10)',
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,700;9..144,800&family=Manrope:wght@300;400;500;600;700;800&display=swap');
  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
  .wd-root { font-family: 'Manrope', system-ui, sans-serif; flex: 1; min-width: 0; width: 100%; }
  .wd-display { font-family: 'Fraunces', Georgia, serif; }

  /* Scrollbar */
  .wd-scroll::-webkit-scrollbar { width: 4px; }
  .wd-scroll::-webkit-scrollbar-track { background: transparent; }
  .wd-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

  /* Cards */
  .wd-card {
    background: rgba(20,184,212,0.07);
    border-left: 4px solid ${C.cyan};
    border-radius: 16px;
    padding: 20px;
    transition: transform 0.2s, border-color 0.2s;
  }
  .wd-card:hover { transform: translateY(-2px); }
  .wd-card-gold {
    background: rgba(201,150,26,0.07);
    border-left: 4px solid ${C.gold};
    border-radius: 16px;
    padding: 20px;
    transition: transform 0.2s;
  }
  .wd-card-gold:hover { transform: translateY(-2px); }
  .wd-card-green {
    background: rgba(0,255,136,0.05);
    border-left: 4px solid ${C.green};
    border-radius: 16px;
    padding: 20px;
  }

  /* Bottom tab nav (mobile) */
  .wd-tab-btn {
    flex: 1; padding: 12px 8px; text-align: center;
    background: none; border: none; border-bottom: 2px solid transparent;
    color: rgba(255,255,255,0.5); cursor: pointer;
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 11px; font-weight: 600;
    transition: all 0.2s;
  }
  .wd-tab-btn:hover { color: rgba(255,255,255,0.85); }
  .wd-tab-btn.active { border-bottom-color: ${C.gold}; color: ${C.gold}; }

  /* Sidebar nav item (desktop) */
  .wd-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 16px; border-radius: 12px;
    cursor: pointer; border: none; background: none; width: 100%;
    color: rgba(255,255,255,0.5);
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 14px; font-weight: 600;
    transition: all 0.2s; text-align: left; margin-bottom: 4px;
  }
  .wd-nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
  .wd-nav-item.active { background: rgba(201,150,26,0.12); color: ${C.gold}; }

  /* Misc */
  .wd-post-card {
    background: rgba(20,184,212,0.06);
    border-left: 4px solid ${C.cyan};
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 12px;
    transition: transform 0.2s;
  }
  .wd-post-card:hover { transform: translateY(-1px); }
  .wd-talk-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px; border-radius: 12px;
    margin-bottom: 10px; cursor: pointer;
    background: rgba(20,184,212,0.05);
    border-left: 3px solid ${C.cyan};
    transition: background 0.2s, transform 0.2s;
  }
  .wd-talk-item:hover { background: rgba(20,184,212,0.1); transform: translateX(2px); }
  .wd-metric-bar { height: 6px; background: rgba(255,255,255,0.10); border-radius: 3px; overflow: hidden; margin: 8px 0 4px; }
  .wd-setting-row {
    display: flex; align-items: center; gap: 14px;
    padding: 16px; cursor: pointer;
    transition: background 0.15s; border-radius: 8px;
  }
  .wd-setting-row:hover { background: rgba(255,255,255,0.04); }

  /* Responsive layout */
  .wd-layout { display: flex; min-height: 100vh; }
  .wd-sidebar {
    width: 220px; flex-shrink: 0;
    background: rgba(255,255,255,0.025);
    border-right: 1px solid ${C.border};
    position: fixed; top: 0; left: 0; bottom: 0;
    display: flex; flex-direction: column;
    padding: 24px 12px;
    z-index: 100;
  }
  .wd-main-desktop { margin-left: 220px; flex: 1; min-height: 100vh; }
  .wd-bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: rgba(10,37,64,0.96);
    backdrop-filter: blur(20px);
    border-top: 1px solid ${C.border};
    display: none; z-index: 100;
  }

  /* Desktop: show sidebar, hide bottom nav */
  @media (min-width: 768px) {
    .wd-sidebar { display: flex; }
    .wd-main-desktop { display: block; }
    .wd-bottom-nav { display: none !important; }
    .wd-mobile-header { display: none !important; }
  }

  /* Mobile: hide sidebar, show bottom nav */
  @media (max-width: 767px) {
    .wd-sidebar { display: none !important; }
    .wd-main-desktop { margin-left: 0; }
    .wd-bottom-nav { display: block; }
    .wd-stats-grid { grid-template-columns: 1fr 1fr !important; }
  }

  /* Content max-width varies by breakpoint */
  .wd-content-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 32px 100px;
  }
  @media (max-width: 767px) {
    .wd-content-inner { padding: 20px 18px 90px; }
  }

  /* Desktop grid layouts */
  @media (min-width: 900px) {
    .wd-home-grid { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
    .wd-health-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  }

  /* Community */
  .comm-grid { display: flex; flex-direction: column; gap: 20px; }
  @media (min-width: 900px) { .comm-grid { display: grid; grid-template-columns: 272px 1fr; gap: 24px; align-items: start; } }
  .comm-post-card { background: rgba(20,184,212,0.06); border-left: 3px solid ${C.cyan}; border-radius: 14px; padding: 16px; margin-bottom: 12px; transition: transform 0.2s; }
  .comm-post-card:hover { transform: translateY(-1px); }
  .comm-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 14px; color: #fff; font-family: 'Manrope', system-ui, sans-serif; font-size: 14px; outline: none; resize: vertical; box-sizing: border-box; }
  .comm-input:focus { border-color: rgba(20,184,212,0.5); }
  .comm-input::placeholder { color: rgba(255,255,255,0.3); }
  .comm-emoji-btn { background: rgba(255,255,255,0.05); border: 2px solid transparent; border-radius: 8px; padding: 6px 0; font-size: 18px; cursor: pointer; transition: all 0.15s; }
  .comm-emoji-btn.selected { background: rgba(20,184,212,0.15); border-color: ${C.cyan}; }
  .comm-color-btn { width: 26px; height: 26px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: border-color 0.15s; }
  .comm-color-btn.selected { border-color: #fff; }
`;

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

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

const TABS = [
  { id: 'home', label: 'Ana Sayfa', icon: '🏠' },
  { id: 'talks', label: 'Palestralar', icon: '🎧' },
  { id: 'health', label: 'Sağlık', icon: '❤️' },
  { id: 'community', label: 'Topluluk', icon: '👥' },
  { id: 'profile', label: 'Profil', icon: '👤' },
];

// Mini bar chart using real weekly data
function WeeklyChart({ data, metric, color, label, format }) {
  if (!data || data.length === 0) return null;
  const values = data.map((d) => d[metric]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return (
    <div>
      <p
        style={{
          fontSize: 11,
          color: C.textTertiary,
          fontWeight: 600,
          margin: '0 0 10px',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {label} — 7 gün
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 52 }}>
        {data.map((d, i) => {
          const pct = ((d[metric] - min) / range) * 0.75 + 0.25;
          const isToday = i === data.length - 1;
          return (
            <div
              key={d.day}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div style={{ width: '100%', height: 42, display: 'flex', alignItems: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${pct * 100}%`,
                    background: isToday ? color : `${color}55`,
                    borderRadius: '3px 3px 0 0',
                    transition: 'height 0.4s ease',
                    position: 'relative',
                  }}
                >
                  {isToday && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -18,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 9,
                        color,
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {format(d[metric])}
                    </div>
                  )}
                </div>
              </div>
              <span
                style={{
                  fontSize: 9,
                  color: isToday ? color : C.textTertiary,
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HomeTab({ user, metrics, weeklyData, wellnessScore, loading }) {
  const dm = metrics?.dailyMetrics;

  const metricCards = [
    {
      emoji: '😴',
      label: 'Uyku',
      value: dm ? `${dm.sleep.hours}s` : '—',
      sub: dm?.sleep.quality || '—',
      color: C.cyan,
    },
    {
      emoji: '❤️',
      label: 'Nabız',
      value: dm ? `${dm.heartRate} bpm` : '—',
      sub: 'Dinlenme',
      color: C.gold,
    },
    {
      emoji: '👟',
      label: 'Adım',
      value: dm ? `${(dm.steps / 1000).toFixed(1)}k` : '—',
      sub: dm ? `Hedef %${Math.min(100, Math.round(dm.steps / 100))}` : '—',
      color: C.cyan,
    },
    {
      emoji: '🔥',
      label: 'Kalori',
      value: dm ? `${dm.calories.toLocaleString()}` : '—',
      sub: 'Aktif',
      color: C.gold,
    },
  ];

  const plan = [
    { time: '07:00', title: 'Sabah meditasyonu', dur: '10dk', done: true, icon: '🧘' },
    { time: '17:30', title: 'Fitness · Üst beden', dur: '45dk', done: false, icon: '💪' },
    {
      time: '20:00',
      title: 'Wellness palestrası',
      dur: '30dk',
      done: false,
      icon: '🎙',
      live: true,
    },
  ];

  const score = wellnessScore || 0;

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 28 }}>
        <p
          style={{
            fontSize: 11,
            color: C.textTertiary,
            fontWeight: 600,
            letterSpacing: 0.3,
            marginBottom: 6,
          }}
        >
          {new Date()
            .toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })
            .toUpperCase()}
        </p>
        <h2
          className="wd-display"
          style={{
            fontSize: 30,
            fontWeight: 300,
            color: C.textPrimary,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {greeting()},{' '}
          <span style={{ fontWeight: 700, color: C.gold }}>{user?.displayName || 'Üye'}</span>
        </h2>
      </div>

      <div className="wd-home-grid">
        {/* Left column */}
        <div>
          {/* Wellness score */}
          <div
            className="wd-card-gold"
            style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: `conic-gradient(${C.gold} 0% ${score}%, rgba(255,255,255,0.10) ${score}% 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: C.navy,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: C.gold }}>
                  {loading ? '…' : score}
                </span>
              </div>
            </div>
            <div>
              <p
                style={{ fontSize: 10, color: C.textTertiary, fontWeight: 500, margin: '0 0 4px' }}
              >
                Wellness skorun
              </p>
              <p style={{ fontSize: 17, color: C.textPrimary, fontWeight: 300, margin: '0 0 6px' }}>
                Bugün{' '}
                <span style={{ color: C.gold, fontWeight: 700 }}>
                  {score >= 80 ? 'mükemmelsin' : score >= 65 ? 'hazırsın' : 'gelişme var'}
                </span>
                .
              </p>
              {weeklyData.length > 0 && (
                <p style={{ fontSize: 11, color: C.textTertiary, margin: 0 }}>
                  Haftalık ort:{' '}
                  {Math.round(
                    weeklyData.reduce((s, d) => s + d.wellnessScore, 0) / weeklyData.length
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Metrics grid */}
          <div
            className="wd-stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              marginBottom: 24,
            }}
          >
            {metricCards.map((m) => (
              <div
                key={m.label}
                style={{
                  background:
                    m.color === C.gold ? 'rgba(201,150,26,0.07)' : 'rgba(20,184,212,0.07)',
                  borderLeft: `3px solid ${m.color}`,
                  borderRadius: 14,
                  padding: '14px 12px 12px',
                }}
              >
                <span style={{ fontSize: 18 }}>{m.emoji}</span>
                <p
                  style={{
                    fontSize: 19,
                    fontWeight: 300,
                    color: C.textPrimary,
                    margin: '6px 0 2px',
                  }}
                >
                  {loading ? <span style={{ color: C.textTertiary }}>—</span> : m.value}
                </p>
                <p style={{ fontSize: 10, color: C.textTertiary, fontWeight: 600, margin: 0 }}>
                  {m.label}
                </p>
                <p style={{ fontSize: 9, color: C.textSecondary, margin: '2px 0 0' }}>{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Weekly steps chart */}
          {weeklyData.length > 0 && (
            <div
              style={{
                background: 'rgba(20,184,212,0.04)',
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <WeeklyChart
                data={weeklyData}
                metric="steps"
                color={C.cyan}
                label="Adım sayısı"
                format={(v) => `${(v / 1000).toFixed(1)}k`}
              />
            </div>
          )}
        </div>

        {/* Right column: Today's plan */}
        <div>
          <div style={{ background: 'rgba(20,184,212,0.03)', borderRadius: 16, padding: 20 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <p style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                Bugünkü plan
              </p>
              <span style={{ fontSize: 13, color: C.textTertiary }}>→</span>
            </div>
            <div
              style={{
                borderRadius: 14,
                border: `1px solid rgba(255,255,255,0.08)`,
                overflow: 'hidden',
              }}
            >
              {plan.map((item, i) => (
                <div key={item.time}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      background: item.live ? 'rgba(201,150,26,0.05)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: item.live
                          ? C.gold
                          : item.done
                            ? 'rgba(20,184,212,0.15)'
                            : 'rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.done ? (
                        <span style={{ color: C.cyan, fontWeight: 700, fontSize: 15 }}>✓</span>
                      ) : (
                        <span style={{ fontSize: 17 }}>{item.icon}</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: 13,
                          color: item.done ? C.textTertiary : C.textPrimary,
                          fontWeight: 500,
                          margin: '0 0 2px',
                          textDecoration: item.done ? 'line-through' : 'none',
                        }}
                      >
                        {item.title}
                      </p>
                      <p style={{ fontSize: 10, color: C.textTertiary, margin: 0 }}>
                        {item.time} · {item.dur}
                      </p>
                    </div>
                    {item.live && (
                      <span
                        style={{
                          background: C.gold,
                          color: C.navy,
                          fontSize: 8,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 999,
                        }}
                      >
                        CANLI
                      </span>
                    )}
                  </div>
                  {i < plan.length - 1 && (
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Sleep chart */}
            {weeklyData.length > 0 && (
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                <WeeklyChart
                  data={weeklyData}
                  metric="sleep"
                  color={C.gold}
                  label="Uyku (saat)"
                  format={(v) => `${v}s`}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TalksTab() {
  const talks = [
    {
      cat: 'Zihin',
      title: 'Anksiyeteyi anlamak',
      dur: '28dk',
      host: 'Dr. Ayşe Demir',
      color: C.cyan,
      listeners: 347,
    },
    {
      cat: 'Hareket',
      title: 'Koşunun bilimi',
      dur: '35dk',
      host: 'Mehmet Çelik',
      color: C.gold,
      listeners: 218,
    },
    {
      cat: 'Uyku',
      title: 'Derin uykuya yolculuk',
      dur: '22dk',
      host: 'Dr. Levent Arslan',
      color: C.royal,
      listeners: 189,
    },
    {
      cat: 'Beslenme',
      title: 'Sezgisel beslenme',
      dur: '42dk',
      host: 'Selin Kaya',
      color: C.cyan,
      listeners: 412,
    },
    {
      cat: 'Motivasyon',
      title: 'Küçük adımların gücü',
      dur: '31dk',
      host: 'Coach Burak',
      color: C.gold,
      listeners: 563,
    },
  ];

  return (
    <div>
      <h2
        className="wd-display"
        style={{ fontSize: 30, fontWeight: 700, color: C.textPrimary, margin: '0 0 6px' }}
      >
        Palestralar
      </h2>
      <p style={{ fontSize: 13, color: C.textSecondary, margin: '0 0 28px' }}>
        Türkiye&apos;nin en güçlü zihinleri
      </p>

      {/* Live card */}
      <div className="wd-card-gold" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span
            style={{
              background: C.gold,
              color: C.navy,
              fontSize: 9,
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 999,
            }}
          >
            ● CANLI
          </span>
          <span style={{ fontSize: 11, color: C.textTertiary }}>347 dinleyici şu an bağlı</span>
        </div>
        <p
          style={{
            fontSize: 20,
            fontWeight: 300,
            color: C.textPrimary,
            margin: '0 0 6px',
            lineHeight: 1.4,
          }}
        >
          Yorgunluğun ardındaki{' '}
          <span style={{ color: C.gold, fontStyle: 'italic' }}>gerçek hikaye</span>
        </p>
        <p style={{ fontSize: 11, color: C.textTertiary, margin: '0 0 16px' }}>
          Dr. Ayşe Demir · Coach Burak · 47:12
        </p>
        <button
          style={{
            width: '100%',
            background: C.gold,
            color: C.navy,
            border: 'none',
            borderRadius: 999,
            padding: '12px 0',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          🎧 Şimdi Dinle
        </button>
      </div>

      <p style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, margin: '0 0 14px' }}>
        Senin için
      </p>
      {talks.map((t, i) => (
        <div key={i} className="wd-talk-item" style={{ borderLeftColor: t.color }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: `${t.color}33`,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 22 }}>
              {t.cat === 'Zihin'
                ? '🧠'
                : t.cat === 'Hareket'
                  ? '🏃'
                  : t.cat === 'Uyku'
                    ? '🌙'
                    : t.cat === 'Beslenme'
                      ? '🥗'
                      : '🎯'}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 9,
                color: t.color,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                margin: '0 0 3px',
              }}
            >
              {t.cat}
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary, margin: '0 0 2px' }}>
              {t.title}
            </p>
            <p style={{ fontSize: 10, color: C.textTertiary, margin: 0 }}>
              {t.host} · {t.dur}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 10, color: C.textTertiary }}>
              {t.listeners.toLocaleString()}
            </span>
            <br />
            <span style={{ fontSize: 10, color: C.textTertiary }}>dinleyici</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HealthTab({ metrics, weeklyData, wellnessScore, loading }) {
  const dm = metrics?.dailyMetrics;
  const score = wellnessScore || 0;

  const breakdown = [
    {
      label: 'Uyku kalitesi',
      value: dm ? Math.round((dm.sleep.hours / 9) * 100) : 0,
      color: C.cyan,
      sub: dm ? `${dm.sleep.quality} · ${dm.sleep.hours}s uyku` : '—',
      icon: '😴',
    },
    {
      label: 'Hareket',
      value: dm ? Math.min(100, Math.round(dm.steps / 100)) : 0,
      color: C.gold,
      sub: dm ? `${(dm.steps / 1000).toFixed(1)}k adım` : '—',
      icon: '👟',
    },
    {
      label: 'Zihin & stres',
      value: dm ? Math.round(68 + (dm.heartRate < 70 ? 10 : 0)) : 0,
      color: C.royal,
      sub: '3 meditasyon',
      icon: '🧘',
    },
    {
      label: 'Kalori dengesi',
      value: dm ? Math.round((dm.calories / 2200) * 100) : 0,
      color: C.gold,
      sub: dm ? `${dm.calories.toLocaleString()} kcal aktif` : '—',
      icon: '🔥',
    },
  ];

  return (
    <div>
      <h2
        className="wd-display"
        style={{ fontSize: 30, fontWeight: 700, color: C.textPrimary, margin: '0 0 6px' }}
      >
        Sağlık <span style={{ color: C.gold, fontStyle: 'italic' }}>verilerin</span>
      </h2>
      <p
        style={{
          fontSize: 11,
          color: C.textTertiary,
          fontWeight: 600,
          letterSpacing: 0.2,
          margin: '0 0 28px',
        }}
      >
        DETAYLI ANALİZ · {dm ? new Date(dm.date).toLocaleDateString('tr-TR') : '—'}
      </p>

      <div className="wd-health-grid" style={{ marginBottom: 24 }}>
        {/* Wellness score */}
        <div className="wd-card">
          <p style={{ fontSize: 12, color: C.textTertiary, fontWeight: 500, margin: '0 0 6px' }}>
            Wellness skoru
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 48, fontWeight: 300, color: C.textPrimary, lineHeight: 1 }}>
              {loading ? '…' : score}
            </span>
            <span style={{ fontSize: 14, color: C.cyan, fontWeight: 500 }}>
              {weeklyData.length > 1
                ? `${score >= weeklyData[weeklyData.length - 2]?.wellnessScore ? '+' : ''}${score - (weeklyData[weeklyData.length - 2]?.wellnessScore || score)} puan`
                : ''}
            </span>
          </div>
          <div className="wd-metric-bar">
            <div
              style={{
                height: '100%',
                width: `${score}%`,
                background: C.cyan,
                borderRadius: 3,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
          <p style={{ fontSize: 11, color: C.textTertiary, margin: '4px 0 0' }}>
            Haftalık ort:{' '}
            {weeklyData.length > 0
              ? Math.round(weeklyData.reduce((s, d) => s + d.wellnessScore, 0) / weeklyData.length)
              : '—'}
          </p>
        </div>

        {/* Heart rate card */}
        <div className="wd-card-gold">
          <p style={{ fontSize: 12, color: C.textTertiary, fontWeight: 500, margin: '0 0 6px' }}>
            Nabız
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 48, fontWeight: 300, color: C.textPrimary, lineHeight: 1 }}>
              {loading ? '…' : (dm?.heartRate ?? '—')}
            </span>
            <span style={{ fontSize: 14, color: C.gold }}>bpm</span>
          </div>
          <div className="wd-metric-bar">
            <div
              style={{
                height: '100%',
                width: `${dm ? Math.min(100, (dm.heartRate / 100) * 100) : 0}%`,
                background: C.gold,
                borderRadius: 3,
              }}
            />
          </div>
          <p style={{ fontSize: 11, color: C.textTertiary, margin: '4px 0 0' }}>
            {dm?.heartRate < 65
              ? 'Mükemmel dinlenme nabzı'
              : dm?.heartRate < 75
                ? 'Normal dinlenme'
                : 'Yüksek — dinlen'}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div
        style={{
          background: 'rgba(20,184,212,0.03)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <p style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, margin: '0 0 16px' }}>
          Kategori detayı
        </p>
        <div className="wd-health-grid">
          {breakdown.map((m) => (
            <div
              key={m.label}
              style={{
                background:
                  m.color === C.cyan
                    ? 'rgba(20,184,212,0.06)'
                    : m.color === C.royal
                      ? 'rgba(0,114,176,0.06)'
                      : 'rgba(201,150,26,0.06)',
                borderLeft: `3px solid ${m.color}`,
                borderRadius: 12,
                padding: '14px 16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>
                  {m.icon} {m.label}
                </span>
                <span style={{ fontSize: 18, fontWeight: 600, color: C.textPrimary }}>
                  {m.value}
                </span>
              </div>
              <div className="wd-metric-bar">
                <div
                  style={{
                    height: '100%',
                    width: `${m.value}%`,
                    background: m.color,
                    borderRadius: 3,
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
              <p style={{ fontSize: 11, color: C.textTertiary, margin: 0 }}>{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly charts */}
      {weeklyData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: 'rgba(20,184,212,0.04)', borderRadius: 14, padding: 16 }}>
            <WeeklyChart
              data={weeklyData}
              metric="sleep"
              color={C.cyan}
              label="Uyku"
              format={(v) => `${v}s`}
            />
          </div>
          <div style={{ background: 'rgba(201,150,26,0.04)', borderRadius: 14, padding: 16 }}>
            <WeeklyChart
              data={weeklyData}
              metric="heartRate"
              color={C.gold}
              label="Nabız"
              format={(v) => `${v}`}
            />
          </div>
        </div>
      )}

      {/* AI Insight */}
      <div className="wd-card-green">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>✨</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>AI İçgörü</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
          {dm && dm.sleep.hours >= 7 ? (
            <>
              Uyku kalitenin{' '}
              <span style={{ color: C.gold, fontWeight: 600 }}>hedefin üzerinde</span>. Akşam
              meditasyonu rutinini sürdür — sonuçlar harika görünüyor.
            </>
          ) : (
            <>
              Uyku süren <span style={{ color: C.gold, fontWeight: 600 }}>hedefin altında</span>. Bu
              akşam erken yatmayı dene; 7+ saat hedefle.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Community helpers ────────────────────────────────────────────────────────

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

function CommunityTab({ user, metrics, weeklyData, wellnessScore, loading }) {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.user.profile);
  const dm = metrics?.dailyMetrics;

  const initProfile = {
    nickname: userProfile?.nickname || user?.displayName || 'Demo Kullanıcı',
    bio: userProfile?.bio || 'Wellness enthusiast from Istanbul 🌿',
    emoji: userProfile?.avatarEmoji || '🧘',
    bg: userProfile?.avatarBg || C.royal,
  };

  const [profile, setProfile] = React.useState(initProfile);
  const [editMode, setEditMode] = React.useState(false);
  const [draft, setDraft] = React.useState(initProfile);

  const [posts, setPosts] = React.useState(COMM_POSTS_INIT);
  const [composerText, setComposerText] = React.useState('');
  const [shareStats, setShareStats] = React.useState(false);
  const [showComposer, setShowComposer] = React.useState(false);
  const [expandedId, setExpandedId] = React.useState(null);
  const [commentDrafts, setCommentDrafts] = React.useState({});

  const openEdit = () => {
    setDraft({ ...profile });
    setEditMode(true);
  };
  const cancelEdit = () => setEditMode(false);
  const saveProfile = () => {
    setProfile(draft);
    setEditMode(false);
    dispatch(
      updateProfile({
        nickname: draft.nickname,
        bio: draft.bio,
        avatarEmoji: draft.emoji,
        avatarBg: draft.bg,
      })
    );
  };

  const submitPost = () => {
    if (!composerText.trim()) return;
    setPosts((prev) => [
      {
        id: Date.now().toString(),
        author: profile.nickname,
        emoji: profile.emoji,
        bg: profile.bg,
        text: composerText.trim(),
        sharedStats:
          shareStats && dm
            ? { wellness: wellnessScore, steps: dm.steps, sleep: dm.sleep.hours }
            : null,
        likes: 0,
        liked: false,
        comments: [],
        time: 'şimdi',
      },
      ...prev,
    ]);
    setComposerText('');
    setShareStats(false);
    setShowComposer(false);
  };

  const toggleLike = (id) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );

  const addComment = (postId) => {
    const text = (commentDrafts[postId] || '').trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: Date.now().toString(),
                  author: profile.nickname,
                  emoji: profile.emoji,
                  bg: profile.bg,
                  text,
                  time: 'şimdi',
                },
              ],
            }
          : p
      )
    );
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
  };

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
            akışı <span style={{ color: C.gold }}>·</span> 1,847 aktif üye
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
        {/* ── Left: My Profile ── */}
        <div>
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 16,
              padding: 20,
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: 16,
            }}
          >
            {!editMode ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: profile.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 32,
                      marginBottom: 12,
                      border: `3px solid ${C.gold}`,
                      boxShadow: `0 0 20px ${profile.bg}55`,
                    }}
                  >
                    {profile.emoji}
                  </div>
                  <p
                    style={{
                      fontSize: 17,
                      fontWeight: 700,
                      color: C.textPrimary,
                      margin: '0 0 6px',
                      textAlign: 'center',
                    }}
                  >
                    {profile.nickname}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: C.textSecondary,
                      margin: 0,
                      textAlign: 'center',
                      lineHeight: 1.6,
                    }}
                  >
                    {profile.bio}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: '12px 0',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: 16,
                  }}
                >
                  {[
                    { label: 'Wellness', value: wellnessScore || '—', color: C.cyan },
                    { label: 'Seri', value: '47g', color: C.gold },
                    { label: 'Talk', value: '12', color: C.cyan },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                      <p
                        style={{ fontSize: 20, fontWeight: 700, color: s.color, margin: '0 0 2px' }}
                      >
                        {s.value}
                      </p>
                      <p style={{ fontSize: 10, color: C.textTertiary, margin: 0 }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={openEdit}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: `1px solid ${C.cyan}`,
                    color: C.cyan,
                    borderRadius: 10,
                    padding: '9px 0',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Profili Düzenle
                </button>
              </>
            ) : (
              <>
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.gold,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    margin: '0 0 16px',
                  }}
                >
                  PROFİLİ DÜZENLE
                </p>

                {/* Avatar preview */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 16,
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: draft.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      border: `2px solid ${C.gold}`,
                    }}
                  >
                    {draft.emoji}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: C.textPrimary,
                        margin: '0 0 2px',
                      }}
                    >
                      {draft.nickname || 'Kullanıcı adın'}
                    </p>
                    <p style={{ fontSize: 11, color: C.textTertiary, margin: 0 }}>Önizleme</p>
                  </div>
                </div>

                {/* Emoji picker */}
                <p style={{ fontSize: 11, color: C.textTertiary, margin: '0 0 8px' }}>Emoji seç</p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: 6,
                    marginBottom: 14,
                  }}
                >
                  {AVATAR_EMOJIS.map((em) => (
                    <button
                      key={em}
                      className={`comm-emoji-btn${draft.emoji === em ? ' selected' : ''}`}
                      onClick={() => setDraft((d) => ({ ...d, emoji: em }))}
                    >
                      {em}
                    </button>
                  ))}
                </div>

                {/* Color picker */}
                <p style={{ fontSize: 11, color: C.textTertiary, margin: '0 0 8px' }}>Renk seç</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {AVATAR_COLORS_LIST.map((color) => (
                    <button
                      key={color}
                      className={`comm-color-btn${draft.bg === color ? ' selected' : ''}`}
                      style={{ background: color }}
                      onClick={() => setDraft((d) => ({ ...d, bg: color }))}
                    />
                  ))}
                </div>

                {/* Nickname */}
                <p style={{ fontSize: 11, color: C.textTertiary, margin: '0 0 6px' }}>
                  Kullanıcı adı
                </p>
                <input
                  className="comm-input"
                  value={draft.nickname}
                  onChange={(e) => setDraft((d) => ({ ...d, nickname: e.target.value }))}
                  placeholder="Kullanıcı adın..."
                  style={{ marginBottom: 12 }}
                />

                {/* Bio */}
                <p style={{ fontSize: 11, color: C.textTertiary, margin: '0 0 6px' }}>Bio</p>
                <textarea
                  className="comm-input"
                  value={draft.bio}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  placeholder="Kendini tanıt..."
                  rows={3}
                  style={{ marginBottom: 16 }}
                />

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={saveProfile}
                    style={{
                      flex: 1,
                      background: C.cyan,
                      color: C.navy,
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px 0',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.07)',
                      color: C.textSecondary,
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px 0',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    İptal
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Active members */}
          <div
            style={{
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.textTertiary,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                margin: '0 0 12px',
              }}
            >
              Şimdi aktif
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {COMM_POSTS_INIT.map((p) => (
                <div key={p.id} style={{ position: 'relative' }}>
                  <CommAvatar emoji={p.emoji} bg={p.bg} size={36} />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#00FF88',
                      border: '2px solid #061829',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Feed ── */}
        <div>
          {/* Composer */}
          {showComposer ? (
            <div
              style={{
                background: 'rgba(20,184,212,0.06)',
                border: '1px solid rgba(20,184,212,0.2)',
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <CommAvatar emoji={profile.emoji} bg={profile.bg} size={40} />
                <textarea
                  className="comm-input"
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  placeholder="Bir şeyler paylaş..."
                  rows={3}
                  style={{ flex: 1 }}
                  autoFocus
                />
              </div>

              {/* Share stats toggle */}
              <div
                onClick={() => setShareStats((s) => !s)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: shareStats ? 0 : 14,
                  padding: '10px 14px',
                  background: shareStats ? 'rgba(201,150,26,0.1)' : 'rgba(255,255,255,0.04)',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: shareStats ? C.gold : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 0.2s',
                  }}
                >
                  {shareStats && (
                    <span style={{ fontSize: 12, color: C.navy, fontWeight: 800 }}>✓</span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: shareStats ? C.gold : C.textSecondary,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  Wellness istatistiklerimi paylaş
                </p>
              </div>

              {shareStats && dm && (
                <div style={{ marginBottom: 14 }}>
                  <CommStatsCard
                    stats={{ wellness: wellnessScore, steps: dm.steps, sleep: dm.sleep.hours }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button
                  onClick={submitPost}
                  disabled={!composerText.trim()}
                  style={{
                    flex: 1,
                    background: composerText.trim() ? C.gold : 'rgba(255,255,255,0.1)',
                    color: composerText.trim() ? C.navy : C.textTertiary,
                    border: 'none',
                    borderRadius: 10,
                    padding: '11px 0',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: composerText.trim() ? 'pointer' : 'default',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  Paylaş
                </button>
                <button
                  onClick={() => {
                    setShowComposer(false);
                    setComposerText('');
                    setShareStats(false);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    color: C.textSecondary,
                    border: 'none',
                    borderRadius: 10,
                    padding: '11px 18px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setShowComposer(true)}
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '12px 16px',
                marginBottom: 20,
                cursor: 'pointer',
              }}
            >
              <CommAvatar emoji={profile.emoji} bg={profile.bg} size={36} />
              <p style={{ fontSize: 14, color: C.textTertiary, margin: 0, flex: 1 }}>
                Bir şeyler paylaş...
              </p>
            </div>
          )}

          {/* Weekly challenge */}
          <div
            style={{
              background: 'rgba(201,150,26,0.07)',
              borderLeft: `4px solid ${C.gold}`,
              borderRadius: 14,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>
                🏆 Haftalık Meydan Okuma
              </span>
              <span style={{ fontSize: 12, color: C.gold }}>3 gün kaldı</span>
            </div>
            <p style={{ fontSize: 13, color: C.textSecondary, margin: '0 0 10px' }}>
              7 gün boyunca günde 8.000 adım at
            </p>
            <div
              style={{
                height: 6,
                background: 'rgba(255,255,255,0.10)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div style={{ height: '100%', width: '57%', background: C.gold, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <p style={{ fontSize: 11, color: C.textTertiary, margin: 0 }}>4/7 gün tamamlandı</p>
              <p style={{ fontSize: 11, color: C.textTertiary, margin: 0 }}>234 katılımcı</p>
            </div>
          </div>

          <p style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, margin: '0 0 14px' }}>
            Son Paylaşımlar
          </p>
          {posts.map((post) => (
            <CommPostCard
              key={post.id}
              post={post}
              isExpanded={expandedId === post.id}
              onToggleExpand={() => setExpandedId(expandedId === post.id ? null : post.id)}
              commentDraft={commentDrafts[post.id]}
              onCommentChange={(val) => setCommentDrafts((prev) => ({ ...prev, [post.id]: val }))}
              onLike={() => toggleLike(post.id)}
              onAddComment={() => addComment(post.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, onLogout, weeklyData }) {
  const totalTalks = 12;
  const streak = 47;
  const points =
    890 + (weeklyData.length > 0 ? weeklyData.reduce((s, d) => s + d.wellnessScore, 0) : 0);

  return (
    <div>
      {/* Avatar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingBottom: 28,
          marginBottom: 24,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: C.cyan,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
            border: `3px solid ${C.gold}`,
            boxShadow: `0 0 28px rgba(20,184,212,0.35)`,
          }}
        >
          <span style={{ fontSize: 34, fontWeight: 800, color: C.navy }}>
            {(user?.displayName || 'U')
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </span>
        </div>
        <h2
          className="wd-display"
          style={{ fontSize: 26, fontWeight: 700, color: C.textPrimary, margin: '0 0 4px' }}
        >
          {user?.displayName || 'Kullanıcı'}
        </h2>
        <p style={{ fontSize: 13, color: C.textTertiary, margin: '0 0 20px' }}>{user?.email}</p>
        <div style={{ display: 'flex', gap: 40 }}>
          {[
            { label: 'Talk', value: totalTalks },
            { label: 'Gün serisi', value: streak },
            { label: 'Puan', value: points },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: C.textPrimary, margin: '0 0 2px' }}>
                {s.value.toLocaleString()}
              </p>
              <p style={{ fontSize: 12, color: C.textTertiary, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className="wd-card" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: '0 0 12px' }}>Hedeflerim</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Uyku iyileştirme', 'Fitness', 'Farkındalık', 'Beslenme'].map((g) => (
            <span
              key={g}
              style={{
                padding: '5px 16px',
                borderRadius: 999,
                background: 'rgba(20,184,212,0.12)',
                border: `1px solid rgba(20,184,212,0.3)`,
                color: C.cyan,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Wellness trend */}
      {weeklyData.length > 0 && (
        <div
          style={{
            background: 'rgba(20,184,212,0.04)',
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <WeeklyChart
            data={weeklyData}
            metric="wellnessScore"
            color={C.cyan}
            label="Wellness trend"
            format={(v) => `${v}`}
          />
        </div>
      )}

      {/* Settings */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: C.cyan,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          margin: '0 0 8px',
        }}
      >
        Ayarlar
      </p>
      <div style={{ background: C.navy, borderRadius: 16, marginBottom: 20, overflow: 'hidden' }}>
        {[
          { icon: '🌍', label: 'Dil', value: 'Türkçe' },
          { icon: '🔔', label: 'Bildirimler', value: 'Açık' },
          { icon: '📏', label: 'Birimler', value: 'Metrik' },
          { icon: '🔒', label: 'Gizlilik', value: '' },
        ].map((row, i, arr) => (
          <div key={row.label}>
            <div className="wd-setting-row">
              <span style={{ fontSize: 20, width: 28 }}>{row.icon}</span>
              <span style={{ flex: 1, fontSize: 15, color: C.textPrimary }}>{row.label}</span>
              <span style={{ fontSize: 13, color: C.textTertiary, marginRight: 4 }}>
                {row.value}
              </span>
              <span style={{ fontSize: 20, color: C.textTertiary }}>›</span>
            </div>
            {i < arr.length - 1 && (
              <div style={{ height: 1, background: C.border, marginLeft: 56 }} />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onLogout}
        style={{
          width: '100%',
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#EF4444',
          borderRadius: 14,
          padding: '14px 0',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: 32,
        }}
      >
        🚪 Çıkış Yap
      </button>
      <p style={{ textAlign: 'center', fontSize: 12, color: C.textTertiary }}>BreakFree v1.0.0</p>
    </div>
  );
}

export default function WebDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { dailyMetrics, weeklyData, wellnessScore, loading } = useAppSelector(
    (state) => state.metrics
  );
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchMetrics(user.uid));
    }
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
        return <HomeTab user={user} {...metricsProps} />;
      case 'talks':
        return <TalksTab />;
      case 'health':
        return <HealthTab {...metricsProps} />;
      case 'community':
        return <CommunityTab user={user} {...metricsProps} />;
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
    </div>
  );
}
