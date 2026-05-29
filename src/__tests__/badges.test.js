import { BADGES, evaluateBadges, getNewlyUnlocked, getBadgeById } from '../utils/badges';

describe('badges', () => {
  it('exports 10 badges with unique IDs', () => {
    expect(BADGES.length).toBe(10);
    const ids = BADGES.map((b) => b.id);
    expect(new Set(ids).size).toBe(BADGES.length);
  });

  it('every badge has icon, name, description, evaluate', () => {
    BADGES.forEach((b) => {
      expect(b.icon).toBeTruthy();
      expect(b.name).toBeTruthy();
      expect(b.description).toBeTruthy();
      expect(typeof b.evaluate).toBe('function');
    });
  });

  it('evaluateBadges returns nothing for empty stats', () => {
    expect(evaluateBadges({})).toEqual([]);
    expect(evaluateBadges()).toEqual([]);
  });

  it('unlocks first_step at 1 post', () => {
    expect(evaluateBadges({ postsCreated: 1 })).toContain('first_step');
    expect(evaluateBadges({ postsCreated: 0 })).not.toContain('first_step');
  });

  it('unlocks streak badges progressively', () => {
    expect(evaluateBadges({ streak: 6 })).not.toContain('streak_7');
    expect(evaluateBadges({ streak: 7 })).toContain('streak_7');
    expect(evaluateBadges({ streak: 30 })).toEqual(
      expect.arrayContaining(['streak_7', 'streak_30'])
    );
  });

  it('getNewlyUnlocked diffs against owned set', () => {
    const stats = { totalTalks: 1, postsCreated: 1 };
    const owned = ['first_step'];
    expect(getNewlyUnlocked(stats, owned)).toEqual(['first_talk']);
  });

  it('getBadgeById finds and returns undefined for missing', () => {
    expect(getBadgeById('first_step').name).toBe('İlk Adım');
    expect(getBadgeById('nope')).toBeUndefined();
  });
});
