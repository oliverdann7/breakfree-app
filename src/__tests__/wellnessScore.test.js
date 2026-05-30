import {
  computeWellnessScore,
  sleepScore,
  activityScore,
  heartRateScore,
  hydrationScore,
  moodScore,
  wellnessLabel,
} from '../utils/wellnessScore';

describe('wellnessScore', () => {
  it('component scorers handle null', () => {
    expect(sleepScore(null)).toBeNull();
    expect(activityScore(undefined)).toBeNull();
    expect(heartRateScore(null)).toBeNull();
    expect(hydrationScore(null)).toBeNull();
    expect(moodScore(null)).toBeNull();
  });

  it('sleepScore peaks at 8h', () => {
    expect(sleepScore(8)).toBe(100);
    expect(sleepScore(4)).toBe(50);
    expect(sleepScore(0)).toBe(0);
  });

  it('activityScore peaks at 10k', () => {
    expect(activityScore(10000)).toBe(100);
    expect(activityScore(5000)).toBe(50);
  });

  it('heartRateScore: 60 = 100, 100 = 40, capped', () => {
    expect(heartRateScore(60)).toBe(100);
    expect(heartRateScore(40)).toBe(100);
    expect(heartRateScore(100)).toBe(40);
    expect(heartRateScore(80)).toBeCloseTo(70, 0);
  });

  it('computeWellnessScore weights correctly', () => {
    const score = computeWellnessScore({
      sleep: 8, // 100 * 0.30
      steps: 10000, // 100 * 0.25
      heartRate: 60, // 100 * 0.20
      hydration: 2000, // 100 * 0.15
      mood: 10, // 100 * 0.10
    });
    expect(score).toBe(100);
  });

  it('computeWellnessScore handles partial data', () => {
    const score = computeWellnessScore({ sleep: 8, steps: 5000 });
    // sleep: 100*0.3=30, activity: 50*0.25=12.5 → 42.5 / 0.55 = 77.27
    expect(score).toBe(77);
  });

  it('returns null when no data', () => {
    expect(computeWellnessScore({})).toBeNull();
    expect(computeWellnessScore()).toBeNull();
  });

  it('wellnessLabel buckets', () => {
    expect(wellnessLabel(95)).toBe('Mükemmel');
    expect(wellnessLabel(75)).toBe('İyi');
    expect(wellnessLabel(60)).toBe('Orta');
    expect(wellnessLabel(45)).toBe('Düşük');
    expect(wellnessLabel(20)).toBe('Dikkat');
    expect(wellnessLabel(null)).toBe('—');
  });
});
