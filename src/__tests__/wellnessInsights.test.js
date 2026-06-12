import { computeInsights, topInsight } from '../utils/wellnessInsights';

describe('wellnessInsights', () => {
  it('returns no insights when no metrics logged', () => {
    expect(computeInsights({})).toEqual([]);
    expect(topInsight({})).toBeNull();
  });

  it('returns no insights when all logged dimensions are healthy', () => {
    const dm = {
      sleep: { hours: 8 },
      steps: 10000,
      heartRate: 60,
      hydration: 2000,
      mood: 9,
    };
    expect(computeInsights(dm)).toEqual([]);
  });

  it('flags low sleep and surfaces a Talks CTA', () => {
    const insights = computeInsights({ sleep: { hours: 4 } });
    expect(insights).toHaveLength(1);
    expect(insights[0]).toMatchObject({
      key: 'sleep',
      tab: 'Palestralar',
      screen: 'TalksList',
    });
    expect(insights[0].message).toContain('4');
  });

  it('flags low mood and surfaces a Mentor CTA', () => {
    const insights = computeInsights({ mood: 3 });
    expect(insights[0]).toMatchObject({ key: 'mood', tab: 'Mentör' });
  });

  it('flags low hydration based on cups', () => {
    const insights = computeInsights({ hydration: 500 });
    expect(insights[0]).toMatchObject({ key: 'hydration', tab: 'Sağlık' });
    expect(insights[0].message).toContain('2 bardak');
  });

  it('orders insights by severity (worst first) and exposes the worst as topInsight', () => {
    const dm = {
      sleep: { hours: 5 }, // sleepScore = 62.5 → NOT below threshold
      steps: 3000, // activityScore = 30
      hydration: 1000, // hydrationScore = 50
      mood: 4, // moodScore = 40
    };
    const insights = computeInsights(dm);
    const keys = insights.map((i) => i.key);
    expect(keys[0]).toBe('activity');
    expect(keys).toEqual(expect.arrayContaining(['activity', 'hydration', 'mood']));
    expect(keys).not.toContain('sleep');
    expect(topInsight(dm).key).toBe('activity');
  });

  it('ignores dimensions the user has not logged', () => {
    const insights = computeInsights({ sleep: { hours: 3 } });
    expect(insights.map((i) => i.key)).toEqual(['sleep']);
  });
});
