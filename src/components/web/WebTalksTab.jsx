import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { joinTalk } from '../../store/slices/talksSlice';
import { C } from './WebStyles';
import Icon from './Icons';

const CATEGORY_ICONS = {
  Zihin: 'brain',
  Hareket: 'activity',
  Uyku: 'moon',
  Beslenme: 'apple',
  Sağlık: 'target',
};

// Firestore may hold duplicate docs (the old seed flow could run twice), so
// collapse identical talks before rendering.
function dedupeTalks(talks) {
  const seen = new Set();
  return talks.filter((t) => {
    const key = `${t.title}|${t.host?.name}|${t.category}|${t.status}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function TalksTab({ talks: rawTalks, onSeed }) {
  const dispatch = useAppDispatch();
  const talks = dedupeTalks(rawTalks);

  if (talks.length === 0) {
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
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255,255,255,0.02)',
            borderRadius: 16,
            border: '1px dashed rgba(255,255,255,0.12)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <Icon name="headphones" size={40} color={C.textTertiary} strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, color: C.textPrimary, margin: '0 0 6px' }}>
            Henüz palestra yok
          </p>
          <p style={{ fontSize: 13, color: C.textTertiary, margin: '0 0 20px' }}>
            İlk palestrayı ekleyerek topluluğa öncülük et!
          </p>
          <button
            onClick={onSeed}
            className="bf-btn-primary"
            style={{
              padding: '12px 28px',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'Manrope', system-ui, sans-serif",
            }}
          >
            Örnek Palestraları Yükle
          </button>
        </div>
      </div>
    );
  }

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

      {talks
        .filter((t) => t.status === 'live')
        .map((t) => (
          <div key={t.talkId} className="wd-card-gold" style={{ marginBottom: 28 }}>
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
              <span style={{ fontSize: 11, color: C.textTertiary }}>
                {t.listeners} dinleyici şu an bağlı
              </span>
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
              {t.title}
            </p>
            <p style={{ fontSize: 11, color: C.textTertiary, margin: '0 0 16px' }}>
              {t.host.name} · {t.duration}dk
            </p>
            <button
              onClick={() => dispatch(joinTalk(t.talkId))}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Icon name="headphones" size={16} /> Şimdi Dinle
            </button>
          </div>
        ))}

      <p style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, margin: '0 0 14px' }}>
        Senin için
      </p>
      {talks.map((t, i) => (
        <div
          key={t.talkId || i}
          className="wd-talk-item"
          style={{ borderLeftColor: t.category === 'Zihin' ? C.cyan : C.gold }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: `${t.category === 'Zihin' ? C.cyan : C.gold}33`,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name={CATEGORY_ICONS[t.category] || 'target'}
              size={22}
              color={t.category === 'Zihin' ? C.cyan : C.gold}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: 9,
                color: t.category === 'Zihin' ? C.cyan : C.gold,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
                margin: '0 0 3px',
              }}
            >
              {t.category}
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.textPrimary, margin: '0 0 2px' }}>
              {t.title}
            </p>
            <p style={{ fontSize: 10, color: C.textTertiary, margin: 0 }}>
              {t.host.name} · {t.duration}dk
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

export default TalksTab;
