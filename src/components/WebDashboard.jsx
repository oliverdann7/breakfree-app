import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

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
  .wd-root { font-family: 'Manrope', system-ui, sans-serif; }
  .wd-display { font-family: 'Fraunces', Georgia, serif; }
  .wd-card {
    background: rgba(20,184,212,0.07);
    border-left: 4px solid ${C.cyan};
    border-radius: 16px;
    padding: 20px;
    transition: transform 0.2s, border-color 0.2s;
  }
  .wd-card:hover { transform: translateY(-2px); border-color: ${C.cyan}; }
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
    transition: transform 0.2s;
  }
  .wd-tab-btn {
    flex: 1; padding: 14px 8px; text-align: center;
    background: none; border: none; border-bottom: 2px solid transparent;
    color: rgba(255,255,255,0.5); cursor: pointer;
    font-family: 'Manrope', system-ui, sans-serif;
    font-size: 12px; font-weight: 600;
    transition: all 0.2s;
  }
  .wd-tab-btn:hover { color: rgba(255,255,255,0.85); }
  .wd-tab-btn.active { border-bottom-color: ${C.gold}; color: ${C.gold}; }
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
  @media (max-width: 640px) {
    .wd-tab-label { display: none; }
    .wd-stats-grid { grid-template-columns: 1fr 1fr !important; }
  }
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

function HomeTab({ user }) {
  const metrics = [
    { emoji: '😴', label: 'Uyku', value: '7s 24dk', sub: 'İyi', color: C.cyan },
    { emoji: '❤️', label: 'Nabız', value: '64 bpm', sub: 'Dinlenme', color: C.gold },
    { emoji: '👟', label: 'Adım', value: '8.2k', sub: 'Hedef %82', color: C.cyan },
    { emoji: '🔥', label: 'Kalori', value: '1,847', sub: 'Aktif', color: C.gold },
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
            fontSize: 28,
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

      {/* Wellness card */}
      <div
        className="wd-card-gold"
        style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: `conic-gradient(${C.gold} 0% 76%, rgba(255,255,255,0.10) 76% 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: C.navy,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: C.gold }}>76</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 10, color: C.textTertiary, fontWeight: 500, margin: '0 0 4px' }}>
            Wellness skorun
          </p>
          <p style={{ fontSize: 17, color: C.textPrimary, fontWeight: 300, margin: 0 }}>
            Bugün <span style={{ color: C.gold, fontWeight: 700 }}>hazırsın.</span>
          </p>
        </div>
      </div>

      {/* Metrics grid */}
      <div
        className="wd-stats-grid"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              background: m.color === C.gold ? 'rgba(201,150,26,0.07)' : 'rgba(20,184,212,0.07)',
              borderLeft: `3px solid ${m.color}`,
              borderRadius: 14,
              padding: '14px 14px 12px',
            }}
          >
            <span style={{ fontSize: 13, color: m.color }}>●</span>
            <p style={{ fontSize: 20, fontWeight: 300, color: C.textPrimary, margin: '6px 0 2px' }}>
              {m.value}
            </p>
            <p style={{ fontSize: 10, color: C.textTertiary, fontWeight: 600, margin: 0 }}>
              {m.label}
            </p>
            <p style={{ fontSize: 9, color: C.textSecondary, margin: '2px 0 0' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Today's plan */}
      <div style={{ background: 'rgba(20,184,212,0.03)', borderRadius: 16, padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <p style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: 0 }}>
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
      </div>
    </div>
  );
}

function TalksTab() {
  const talks = [
    { cat: 'Zihin', title: 'Anksiyeteyi anlamak', dur: '28dk', host: 'Dr. Ayşe', color: C.cyan },
    { cat: 'Hareket', title: 'Koşunun bilimi', dur: '35dk', host: 'Mehmet Ç.', color: C.gold },
    {
      cat: 'Uyku',
      title: 'Derin uykuya yolculuk',
      dur: '22dk',
      host: 'Dr. Levent',
      color: C.royal,
    },
    { cat: 'Beslenme', title: 'Sezgisel beslenme', dur: '42dk', host: 'Selin Kaya', color: C.cyan },
  ];

  return (
    <div>
      <h2
        className="wd-display"
        style={{ fontSize: 28, fontWeight: 700, color: C.textPrimary, margin: '0 0 6px' }}
      >
        Palestralar
      </h2>
      <p style={{ fontSize: 13, color: C.textSecondary, margin: '0 0 24px' }}>
        Türkiye&apos;nin en güçlü zihinleri
      </p>

      {/* Live card */}
      <div className="wd-card-gold" style={{ marginBottom: 24 }}>
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
          <span style={{ fontSize: 11, color: C.textTertiary }}>347 dinleyici</span>
        </div>
        <p
          style={{
            fontSize: 18,
            fontWeight: 300,
            color: C.textPrimary,
            margin: '0 0 12px',
            lineHeight: 1.4,
          }}
        >
          Yorgunluğun ardındaki{' '}
          <span style={{ color: C.gold, fontStyle: 'italic' }}>gerçek hikaye</span>
        </p>
        <p style={{ fontSize: 11, color: C.textTertiary, margin: '0 0 14px' }}>
          Dr. Ayşe Demir · Coach Burak
        </p>
        <button
          style={{
            width: '100%',
            background: C.gold,
            color: C.navy,
            border: 'none',
            borderRadius: 999,
            padding: '11px 0',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          🎧 Şimdi Dinle
        </button>
      </div>

      <p style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: '0 0 14px' }}>
        Senin için
      </p>
      {talks.map((t, i) => (
        <div key={i} className="wd-talk-item" style={{ borderLeftColor: t.color }}>
          <div
            style={{ width: 48, height: 48, borderRadius: 10, background: t.color, flexShrink: 0 }}
          />
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
            <p style={{ fontSize: 13, fontWeight: 500, color: C.textPrimary, margin: '0 0 2px' }}>
              {t.title}
            </p>
            <p style={{ fontSize: 10, color: C.textTertiary, margin: 0 }}>
              {t.host} · {t.dur}
            </p>
          </div>
          <span style={{ fontSize: 20, color: C.textTertiary }}>+</span>
        </div>
      ))}
    </div>
  );
}

function HealthTab() {
  const breakdown = [
    { label: 'Uyku kalitesi', value: 84, color: C.cyan, sub: 'Mükemmel · 7s 24dk' },
    { label: 'Hareket', value: 72, color: C.gold, sub: 'İyi · 8.2k adım' },
    { label: 'Zihin & stres', value: 68, color: C.royal, sub: 'İyi · 3 meditasyon' },
    { label: 'Beslenme', value: 81, color: C.gold, sub: 'Çok iyi · 2.1L su' },
  ];

  return (
    <div>
      <h2
        className="wd-display"
        style={{ fontSize: 28, fontWeight: 700, color: C.textPrimary, margin: '0 0 6px' }}
      >
        Sağlık <span style={{ color: C.gold, fontStyle: 'italic' }}>verilerin</span>
      </h2>
      <p
        style={{
          fontSize: 11,
          color: C.textTertiary,
          fontWeight: 600,
          letterSpacing: 0.2,
          margin: '0 0 24px',
        }}
      >
        DETAYLI ANALİZ
      </p>

      {/* Score card */}
      <div className="wd-card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: C.textTertiary, fontWeight: 500, margin: '0 0 6px' }}>
          Wellness skoru
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 40, fontWeight: 300, color: C.textPrimary, lineHeight: 1 }}>
            76
          </span>
          <span style={{ fontSize: 14, color: C.cyan, fontWeight: 500 }}>↑ +12%</span>
        </div>
        <div className="wd-metric-bar">
          <div style={{ height: '100%', width: '76%', background: C.cyan, borderRadius: 3 }} />
        </div>
        <p style={{ fontSize: 11, color: C.textTertiary, margin: 0 }}>Bu hafta ortalaması: 71</p>
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
        <p style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: '0 0 16px' }}>
          Detay
        </p>
        {breakdown.map((m, i) => (
          <div
            key={i}
            style={{
              background:
                m.color === C.cyan
                  ? 'rgba(20,184,212,0.06)'
                  : m.color === C.royal
                    ? 'rgba(0,114,176,0.06)'
                    : 'rgba(201,150,26,0.06)',
              borderLeft: `3px solid ${m.color}`,
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 10,
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
              <span style={{ fontSize: 13, fontWeight: 500, color: C.textPrimary }}>{m.label}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.textPrimary }}>{m.value}</span>
            </div>
            <div className="wd-metric-bar">
              <div
                style={{
                  height: '100%',
                  width: `${m.value}%`,
                  background: m.color,
                  borderRadius: 3,
                }}
              />
            </div>
            <p style={{ fontSize: 11, color: C.textTertiary, margin: 0 }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="wd-card-green">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>✨</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>AI İçgörü</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
          Uyku puanın bu hafta <span style={{ color: C.gold, fontWeight: 600 }}>%14 yükseldi</span>.
          Akşam meditasyonu rutinini sürdürmeni öneririm — sonuçlar harika.
        </p>
      </div>
    </div>
  );
}

function CommunityTab() {
  const [posts, setPosts] = React.useState([
    {
      id: 'p1',
      name: 'Burak Yılmaz',
      initial: 'B',
      text: "Sabah 06:30'da 10K koşuyu bitirdim! Haftaya yarışmaya hazırım 💪🏃",
      likes: 47,
      comments: 12,
      liked: false,
      time: '2 saat önce',
    },
    {
      id: 'p2',
      name: 'Elif Kaya',
      initial: 'E',
      text: "Dr. Ayşe'nin anksiyete talk'ı muhteşemdi. Günlük farkındalık egzersizlerini hayatıma katmaya başladım 🧘‍♀️",
      likes: 32,
      comments: 8,
      liked: true,
      time: '4 saat önce',
    },
    {
      id: 'p3',
      name: 'Mert Arslan',
      initial: 'M',
      text: '30 günlük beslenme meydan okuması tamamlandı! -4 kg ve çok daha enerjik hissediyorum 🎯',
      likes: 89,
      comments: 24,
      liked: false,
      time: '1 gün önce',
    },
  ]);

  const toggle = (id) =>
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );

  return (
    <div>
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
            style={{ fontSize: 28, fontWeight: 700, color: C.textPrimary, margin: '0 0 4px' }}
          >
            Topluluk
          </h2>
          <p style={{ fontSize: 11, fontWeight: 300, color: C.textTertiary, margin: 0 }}>
            akışı <span style={{ color: C.gold }}>·</span>
          </p>
        </div>
        <button
          style={{
            background: C.cyan,
            color: C.navy,
            border: 'none',
            borderRadius: 999,
            padding: '7px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          + Paylaş
        </button>
      </div>

      {/* Challenge */}
      <div className="wd-card-gold" style={{ marginBottom: 20 }}>
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
        <div className="wd-metric-bar">
          <div style={{ height: '100%', width: '57%', background: C.gold, borderRadius: 3 }} />
        </div>
        <p style={{ fontSize: 11, color: C.textTertiary, margin: '4px 0 0' }}>4/7 gün tamamlandı</p>
      </div>

      <p style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: '0 0 14px' }}>
        Son Paylaşımlar
      </p>
      {posts.map((post) => (
        <div key={post.id} className="wd-post-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: C.royal,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{post.initial}</span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: '0 0 2px' }}>
                {post.name}
              </p>
              <p style={{ fontSize: 11, color: C.textTertiary, margin: 0 }}>{post.time}</p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.6, margin: '0 0 12px' }}>
            {post.text}
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            <button
              onClick={() => toggle(post.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: C.textSecondary,
                fontSize: 13,
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 17 }}>{post.liked ? '❤️' : '🤍'}</span> {post.likes}
            </button>
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: C.textSecondary,
                fontSize: 13,
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 17 }}>💬</span> {post.comments}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab({ user, onLogout }) {
  return (
    <div>
      {/* Avatar + name */}
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
            width: 92,
            height: 92,
            borderRadius: '50%',
            background: C.cyan,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 14,
            border: `3px solid ${C.gold}`,
            boxShadow: `0 0 24px rgba(20,184,212,0.35)`,
          }}
        >
          <span style={{ fontSize: 32, fontWeight: 800, color: C.navy }}>
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
        <div style={{ display: 'flex', gap: 36 }}>
          {[
            { label: 'Talk', value: '12' },
            { label: 'Gün', value: '47' },
            { label: 'Puan', value: '890' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, margin: '0 0 2px' }}>
                {s.value}
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
          {['sleep', 'fitness', 'mindfulness'].map((g) => (
            <span
              key={g}
              style={{
                padding: '4px 14px',
                borderRadius: 999,
                background: 'rgba(20,184,212,0.12)',
                border: `1px solid rgba(20,184,212,0.3)`,
                color: C.cyan,
                fontSize: 12,
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

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
  const [activeTab, setActiveTab] = useState('home');

  const handleLogout = () => {
    if (window.confirm('Hesabından çıkmak istediğine emin misin?')) {
      dispatch(logout());
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab user={user} />;
      case 'talks':
        return <TalksTab />;
      case 'health':
        return <HealthTab />;
      case 'community':
        return <CommunityTab />;
      case 'profile':
        return <ProfileTab user={user} onLogout={handleLogout} />;
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

      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${C.border}`,
          background: `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)`,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={32} />
            <span
              className="wd-display"
              style={{ fontSize: 18, fontWeight: 500, color: C.textPrimary }}
            >
              Break<span style={{ color: C.gold, fontStyle: 'italic' }}>Free</span>
            </span>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 15 }}>🔔</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 24px 100px' }}>
        {renderContent()}
      </div>

      {/* Bottom nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: `${C.navy}F5`,
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`wd-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div style={{ fontSize: 20, marginBottom: 4 }}>{tab.icon}</div>
              <div className="wd-tab-label">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
