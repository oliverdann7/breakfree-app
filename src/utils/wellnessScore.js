// Wellness score algorithm per BREAKFREE_DEV_ROADMAP §2.1
// Weights: sleep 30% + activity 25% + heart rate 20% + hydration 15% + mood 10%

const WEIGHTS = {
  sleep: 0.3,
  activity: 0.25,
  heartRate: 0.2,
  hydration: 0.15,
  mood: 0.1,
};

const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));

// Sleep: 8h = 100, 6h = 75, 4h = 50, <2h = 0
export function sleepScore(hours) {
  if (hours == null) return null;
  return clamp((hours / 8) * 100);
}

// Activity: 10k steps = 100, linear under
export function activityScore(steps) {
  if (steps == null) return null;
  return clamp((steps / 10000) * 100);
}

// Heart rate: resting 60bpm = 100, drops as it climbs above 80
export function heartRateScore(restingBpm) {
  if (restingBpm == null) return null;
  if (restingBpm <= 60) return 100;
  if (restingBpm >= 100) return 40;
  return clamp(100 - (restingBpm - 60) * 1.5);
}

// Hydration: 8 cups / 2000ml = 100
export function hydrationScore(ml) {
  if (ml == null) return null;
  return clamp((ml / 2000) * 100);
}

// Mood: user 1-10 self-report
export function moodScore(rating) {
  if (rating == null) return null;
  return clamp(rating * 10);
}

export function computeWellnessScore({ sleep, steps, heartRate, hydration, mood } = {}) {
  const parts = [
    { value: sleepScore(sleep), weight: WEIGHTS.sleep },
    { value: activityScore(steps), weight: WEIGHTS.activity },
    { value: heartRateScore(heartRate), weight: WEIGHTS.heartRate },
    { value: hydrationScore(hydration), weight: WEIGHTS.hydration },
    { value: moodScore(mood), weight: WEIGHTS.mood },
  ].filter((p) => p.value != null);

  if (parts.length === 0) return null;

  const totalWeight = parts.reduce((sum, p) => sum + p.weight, 0);
  const weightedSum = parts.reduce((sum, p) => sum + p.value * p.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

// Combine a freshly-entered metrics partial with the day's existing entry,
// then score the full day with the canonical algorithm. Used by the health
// log flow so logging a single field (e.g. just mood) reflects the whole day
// rather than collapsing the score to that one dimension.
export function scoreDailyEntry(entry = {}, existing = {}) {
  return computeWellnessScore({
    sleep: entry.sleep?.hours ?? existing.sleep?.hours,
    steps: entry.steps ?? existing.steps,
    heartRate: entry.heartRate ?? existing.heartRate,
    hydration: entry.hydration ?? existing.hydration,
    mood: entry.mood ?? existing.mood,
  });
}

export function wellnessLabel(score) {
  if (score == null) return '—';
  if (score >= 85) return 'Mükemmel';
  if (score >= 70) return 'İyi';
  if (score >= 55) return 'Orta';
  if (score >= 40) return 'Düşük';
  return 'Dikkat';
}
