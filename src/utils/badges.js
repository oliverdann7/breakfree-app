// Badge unlock engine for community challenges + streaks
// Each badge has an evaluator that returns true when earned given user stats.

export const BADGES = [
  {
    id: 'first_step',
    name: 'İlk Adım',
    description: 'İlk gönderini paylaş',
    icon: '🌱',
    evaluate: (s) => (s.postsCreated || 0) >= 1,
  },
  {
    id: 'steps_5k',
    name: '5K Adım',
    description: 'Bir günde 5.000 adım at',
    icon: '👟',
    evaluate: (s) => (s.maxDailySteps || 0) >= 5000,
  },
  {
    id: 'steps_10k',
    name: '10K Adım',
    description: 'Bir günde 10.000 adım at',
    icon: '🏃',
    evaluate: (s) => (s.maxDailySteps || 0) >= 10000,
  },
  {
    id: 'streak_7',
    name: '7 Gün Seri',
    description: '7 gün üst üste aktif ol',
    icon: '🔥',
    evaluate: (s) => (s.streak || 0) >= 7,
  },
  {
    id: 'streak_30',
    name: '30 Gün Seri',
    description: '30 gün üst üste aktif ol',
    icon: '💎',
    evaluate: (s) => (s.streak || 0) >= 30,
  },
  {
    id: 'first_talk',
    name: 'Dinleyici',
    description: "İlk talk'a katıl",
    icon: '🎙',
    evaluate: (s) => (s.totalTalks || 0) >= 1,
  },
  {
    id: 'talks_10',
    name: 'Sadık Takipçi',
    description: "10 talk'a katıl",
    icon: '⭐',
    evaluate: (s) => (s.totalTalks || 0) >= 10,
  },
  {
    id: 'mentor_session',
    name: 'Mentor Buluşması',
    description: 'İlk mentor seansını tamamla',
    icon: '🤝',
    evaluate: (s) => (s.mentorSessions || 0) >= 1,
  },
  {
    id: 'challenge_winner',
    name: 'Şampiyon',
    description: 'Bir meydan okumayı kazan',
    icon: '🏆',
    evaluate: (s) => (s.challengesWon || 0) >= 1,
  },
  {
    id: 'wellness_master',
    name: 'Wellness Ustası',
    description: 'Wellness skoru 90+ tut',
    icon: '🌿',
    evaluate: (s) => (s.peakWellness || 0) >= 90,
  },
];

export function evaluateBadges(stats = {}) {
  return BADGES.filter((b) => b.evaluate(stats)).map((b) => b.id);
}

export function getNewlyUnlocked(stats = {}, previouslyOwned = []) {
  const earned = evaluateBadges(stats);
  return earned.filter((id) => !previouslyOwned.includes(id));
}

export function getBadgeById(id) {
  return BADGES.find((b) => b.id === id);
}
