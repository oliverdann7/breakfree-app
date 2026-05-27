import React from 'react';
import { C } from './WebStyles';
import WeeklyChart from './WeeklyChart';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın';
  if (h < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

function HomeTab({ user, metrics, weeklyData, wellnessScore, loading, onLogMetrics }) {
  const dm = metrics?.dailyMetrics;

  const metricCards = [
    {
      emoji: '😴',
      label: 'Uyku',
      value: dm?.sleep?.hours ? `${dm.sleep.hours}s` : '—',
      sub: dm?.sleep?.quality || '—',
      color: C.cyan,
    },
    {
      emoji: '❤️',
      label: 'Nabız',
      value: dm?.heartRate ? `${dm.heartRate} bpm` : '—',
      sub: 'Dinlenme',
      color: C.gold,
    },
    {
      emoji: '👟',
      label: 'Adım',
      value: dm?.steps ? `${(dm.steps / 1000).toFixed(1)}k` : '—',
      sub: dm?.steps ? `Hedef %${Math.min(100, Math.round(dm.steps / 100))}` : '—',
      color: C.cyan,
    },
    {
      emoji: '🔥',
      label: 'Kalori',
      value: dm?.calories ? `${dm.calories.toLocaleString()}` : '—',
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

      {!dm && !loading && (
        <div
          style={{
            background: 'rgba(201,150,26,0.06)',
            border: '1px solid rgba(201,150,26,0.2)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: '0 0 4px' }}>
              📋 Bugünün verilerini gir
            </p>
            <p style={{ fontSize: 12, color: C.textTertiary, margin: 0 }}>
              Uyku, nabız ve aktivite verilerini kaydederek wellness skorunu takip et.
            </p>
          </div>
          <button
            onClick={onLogMetrics}
            className="bf-btn-primary"
            style={{
              padding: '10px 20px',
              borderRadius: 100,
              fontSize: 13,
              whiteSpace: 'nowrap',
              fontFamily: "'Manrope', system-ui, sans-serif",
            }}
          >
            Veri Gir
          </button>
        </div>
      )}

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
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <p
                  style={{
                    fontSize: 10,
                    color: C.textTertiary,
                    fontWeight: 500,
                    margin: '0 0 4px',
                  }}
                >
                  Wellness skorun
                </p>
                {dm && (
                  <button
                    onClick={onLogMetrics}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: 'none',
                      color: C.textTertiary,
                      fontSize: 10,
                      padding: '4px 10px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontFamily: "'Manrope', system-ui, sans-serif",
                    }}
                  >
                    Düzenle
                  </button>
                )}
              </div>
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

export default HomeTab;
