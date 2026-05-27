import React from 'react';
import { C } from './WebStyles';
import WeeklyChart from './WeeklyChart';

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

export default ProfileTab;
