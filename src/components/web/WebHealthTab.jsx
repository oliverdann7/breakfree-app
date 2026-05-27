import React from 'react';
import { C } from './WebStyles';
import WeeklyChart from './WeeklyChart';

function HealthTab({ metrics, weeklyData, wellnessScore, loading }) {
  const dm = metrics?.dailyMetrics;
  const score = wellnessScore || 0;

  const breakdown = [
    {
      label: 'Uyku kalitesi',
      value: dm?.sleep?.hours ? Math.round((dm.sleep.hours / 9) * 100) : 0,
      color: C.cyan,
      sub: dm?.sleep ? `${dm.sleep.quality || '—'} · ${dm.sleep.hours}s uyku` : '—',
      icon: '😴',
    },
    {
      label: 'Hareket',
      value: dm?.steps ? Math.min(100, Math.round(dm.steps / 100)) : 0,
      color: C.gold,
      sub: dm?.steps ? `${(dm.steps / 1000).toFixed(1)}k adım` : '—',
      icon: '👟',
    },
    {
      label: 'Zihin & stres',
      value: dm?.heartRate ? Math.round(68 + (dm.heartRate < 70 ? 10 : 0)) : 0,
      color: C.royal,
      sub: '3 meditasyon',
      icon: '🧘',
    },
    {
      label: 'Kalori dengesi',
      value: dm?.calories ? Math.round((dm.calories / 2200) * 100) : 0,
      color: C.gold,
      sub: dm?.calories ? `${dm.calories.toLocaleString()} kcal aktif` : '—',
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
                width: `${dm?.heartRate ? Math.min(100, (dm.heartRate / 100) * 100) : 0}%`,
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
          {dm?.sleep?.hours >= 7 ? (
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

export default HealthTab;
