import React from 'react';
import { C } from './WebStyles';

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

export default WeeklyChart;
