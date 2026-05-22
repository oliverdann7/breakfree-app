import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logMetric, fetchMetrics } from '../store/slices/metricsSlice';

const C = {
  navyDeep: '#061829',
  navy: '#0A2540',
  royal: '#0072B0',
  cyan: '#14B8D4',
  gold: '#C9961A',
  goldLight: '#E6B530',
  cream: '#F4E8C8',
  textPrimary: 'rgba(255,255,255,0.92)',
  textSecondary: 'rgba(255,255,255,0.60)',
  textTertiary: 'rgba(255,255,255,0.35)',
  border: 'rgba(255,255,255,0.08)',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.06)',
  border: `1px solid ${C.border}`,
  color: '#fff',
  fontSize: 15,
  fontFamily: 'Manrope, system-ui, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

export default function MetricLoggerModal({ uid, onClose }) {
  const dispatch = useDispatch();
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState('İyi');
  const [heartRate, setHeartRate] = useState('');
  const [steps, setSteps] = useState('');
  const [calories, setCalories] = useState('');
  const [wellnessScore, setWellnessScore] = useState('75');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(
        logMetric({
          uid,
          data: {
            sleep: {
              hours: parseFloat(sleepHours) || 0,
              quality: sleepQuality,
            },
            heartRate: parseInt(heartRate, 10) || 0,
            steps: parseInt(steps, 10) || 0,
            calories: parseInt(calories, 10) || 0,
            wellnessScore: parseInt(wellnessScore, 10) || 0,
          },
        })
      ).unwrap();
      dispatch(fetchMetrics(uid));
      onClose();
    } catch {
      // error handled by slice
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: C.navy,
          borderRadius: 20,
          border: `1px solid ${C.border}`,
          width: '100%',
          maxWidth: 440,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: C.textPrimary,
              margin: 0,
              fontFamily: 'Fraunces, Georgia, serif',
            }}
          >
            Günlük <span style={{ color: C.gold, fontStyle: 'italic' }}>veri</span> gir
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: C.textSecondary,
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}
          >
            <div>
              <label
                style={{
                  fontSize: 11,
                  color: C.textTertiary,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                😴 Uyku (saat)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                placeholder="7.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 11,
                  color: C.textTertiary,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                😴 Uyku kalitesi
              </label>
              <select
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                style={inputStyle}
              >
                <option value="İyi">İyi</option>
                <option value="Normal">Normal</option>
                <option value="Kötü">Kötü</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: 11,
                  color: C.textTertiary,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                ❤️ Nabız (bpm)
              </label>
              <input
                type="number"
                min="40"
                max="220"
                placeholder="72"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 11,
                  color: C.textTertiary,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                👟 Adım sayısı
              </label>
              <input
                type="number"
                min="0"
                placeholder="8000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 11,
                  color: C.textTertiary,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                🔥 Kalori (kcal)
              </label>
              <input
                type="number"
                min="0"
                placeholder="1800"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 11,
                  color: C.textTertiary,
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                ✨ Wellness skoru
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="75"
                value={wellnessScore}
                onChange={(e) => setWellnessScore(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: saving
                ? C.royal
                : `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)`,
              color: saving ? C.textSecondary : C.navyDeep,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'Manrope, system-ui, sans-serif',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {saving ? 'Kaydediliyor…' : 'Verileri Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
}
