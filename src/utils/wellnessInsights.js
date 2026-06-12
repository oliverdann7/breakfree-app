// Personalized wellness insights — picks the weakest dimension(s) from the day's
// metrics and turns them into actionable suggestions tied to existing screens.
// Pure function; UI in DashboardScreen reads the top item and renders it as a CTA.

import {
  sleepScore,
  activityScore,
  heartRateScore,
  hydrationScore,
  moodScore,
} from './wellnessScore';

const ML_PER_CUP = 250;

// Below this dimension score we consider the user to need a nudge.
const NUDGE_THRESHOLD = 60;

// Catalog of nudges. Each entry knows how to evaluate its own dimension from
// the daily metrics doc, and what CTA to surface. `tab` matches AppNavigator's
// tab name; `screen` is the nested stack screen if any.
const NUDGES = [
  {
    key: 'sleep',
    score: (dm) => sleepScore(dm?.sleep?.hours),
    nudge: (dm) => ({
      emoji: '😴',
      title: 'Uykunu önceliklendir',
      message:
        dm?.sleep?.hours != null
          ? `Bugün ${dm.sleep.hours} saat uyumuşsun. Bir uyku palestrasıyla toparlan.`
          : 'Bugün uyku kaydın yok. Bir uyku palestrasıyla başla.',
      ctaLabel: 'Uyku palestraları',
      tab: 'Palestralar',
      screen: 'TalksList',
      params: { category: 'sleep' },
    }),
  },
  {
    key: 'hydration',
    score: (dm) => hydrationScore(dm?.hydration),
    nudge: (dm) => {
      const cups = dm?.hydration ? Math.round(dm.hydration / ML_PER_CUP) : 0;
      return {
        emoji: '💧',
        title: 'Bir bardak su iç',
        message:
          dm?.hydration != null
            ? `Bugün ${cups} bardak. 8 bardağa ulaşmak için kaydını güncelle.`
            : 'Bugün su kaydın yok. Hidrasyonu Sağlık ekranından kaydet.',
        ctaLabel: 'Su kaydı',
        tab: 'Sağlık',
      };
    },
  },
  {
    key: 'activity',
    score: (dm) => activityScore(dm?.steps),
    nudge: (dm) => ({
      emoji: '👟',
      title: 'Kısa bir yürüyüş yap',
      message:
        dm?.steps != null
          ? `${(dm.steps / 1000).toFixed(1)}k adım — 10k için biraz hareket lazım.`
          : 'Adım kaydın yok. Kısa bir yürüyüş ve kaydet.',
      ctaLabel: 'Hareket meydan okumaları',
      tab: 'Topluluk',
      screen: 'Challenges',
    }),
  },
  {
    key: 'mood',
    score: (dm) => moodScore(dm?.mood),
    nudge: () => ({
      emoji: '🧠',
      title: 'Bir mentörle konuş',
      message: 'Ruh halin düşük görünüyor. Bir mentörle 15 dakikalık bir görüşme planla.',
      ctaLabel: 'Mentör bul',
      tab: 'Mentör',
      screen: 'MentorDirectory',
    }),
  },
  {
    key: 'heartRate',
    score: (dm) => heartRateScore(dm?.heartRate),
    nudge: () => ({
      emoji: '❤️',
      title: 'Nefes egzersizi dene',
      message: 'Dinlenme nabzın yüksek. 5 dakikalık bir nefes palestrasıyla yavaşla.',
      ctaLabel: 'Nefes palestraları',
      tab: 'Palestralar',
      screen: 'TalksList',
      params: { category: 'breathing' },
    }),
  },
];

// Returns insights sorted by severity (lowest dimension score first). Only
// dimensions with a logged value AND a score below NUDGE_THRESHOLD are
// included. If nothing is below threshold, returns an empty array.
export function computeInsights(dailyMetrics = {}) {
  const scored = NUDGES.map((n) => ({ key: n.key, value: n.score(dailyMetrics), build: n.nudge }))
    .filter((n) => n.value != null && n.value < NUDGE_THRESHOLD)
    .sort((a, b) => a.value - b.value);

  return scored.map((n) => ({
    key: n.key,
    severity: Math.round(n.value),
    ...n.build(dailyMetrics),
  }));
}

// Convenience: top insight or null. Dashboard uses this directly.
export function topInsight(dailyMetrics) {
  return computeInsights(dailyMetrics)[0] ?? null;
}

export const __test__ = { NUDGE_THRESHOLD };
