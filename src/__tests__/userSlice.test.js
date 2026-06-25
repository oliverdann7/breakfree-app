import userReducer, {
  updatePreferences,
  updateProfile,
  setHasCompletedOnboarding,
  clearUser,
} from '../store/slices/userSlice';

const initialState = {
  uid: null,
  profile: null,
  hasCompletedOnboarding: false,
  preferences: {
    language: 'auto',
    units: 'metric',
    notifications: true,
    quietHours: { enabled: false, start: 1320, end: 420 },
  },
  dailyPlan: null,
  stats: { totalTalks: 0, streak: 0, longestStreak: 0, points: 0 },
  loading: false,
  error: null,
};

describe('userSlice', () => {
  it('returns initial state', () => {
    const state = userReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('handles updatePreferences', () => {
    const state = userReducer(initialState, updatePreferences({ language: 'en' }));
    expect(state.preferences.language).toBe('en');
    expect(state.preferences.units).toBe('metric');
    expect(state.preferences.notifications).toBe(true);
  });

  it('handles updateProfile', () => {
    const state = userReducer(initialState, updateProfile({ nickname: 'Elif', bio: 'Wellness' }));
    expect(state.profile.nickname).toBe('Elif');
    expect(state.profile.bio).toBe('Wellness');
  });

  it('handles setHasCompletedOnboarding', () => {
    const state = userReducer(initialState, setHasCompletedOnboarding(true));
    expect(state.hasCompletedOnboarding).toBe(true);
  });

  it('handles clearUser', () => {
    const loggedIn = {
      ...initialState,
      uid: '123',
      profile: { nickname: 'Test' },
      hasCompletedOnboarding: true,
    };
    const state = userReducer(loggedIn, clearUser());
    expect(state.uid).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.hasCompletedOnboarding).toBe(false);
  });

  it('handles fetchUserProfile.pending', () => {
    const state = userReducer(initialState, { type: 'user/fetchProfile/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchUserProfile.fulfilled', () => {
    const profile = { uid: '123', nickname: 'Elif', goals: ['sleep', 'fitness'] };
    const state = userReducer(initialState, {
      type: 'user/fetchProfile/fulfilled',
      payload: profile,
    });
    expect(state.loading).toBe(false);
    expect(state.uid).toBe('123');
    expect(state.profile).toEqual(profile);
    expect(state.preferences.language).toBe('auto');
  });

  it('handles fetchUserProfile.fulfilled with preferences override', () => {
    const profile = {
      uid: '1',
      nickname: 'X',
      preferences: { language: 'en', units: 'imperial', notifications: false },
    };
    const state = userReducer(initialState, {
      type: 'user/fetchProfile/fulfilled',
      payload: profile,
    });
    expect(state.preferences.language).toBe('en');
    expect(state.preferences.units).toBe('imperial');
    expect(state.preferences.notifications).toBe(false);
  });

  it('handles fetchUserProfile.rejected', () => {
    const state = userReducer(initialState, {
      type: 'user/fetchProfile/rejected',
      payload: 'Profile not found',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Profile not found');
  });

  it('handles updateProfileFirestore.fulfilled', () => {
    const existing = { ...initialState, profile: { nickname: 'Old', bio: 'Old bio' } };
    const state = userReducer(existing, {
      type: 'user/updateProfileFirestore/fulfilled',
      payload: { nickname: 'NewName' },
    });
    expect(state.profile.nickname).toBe('NewName');
    expect(state.profile.bio).toBe('Old bio');
  });

  it('handles fetchDailyPlan.fulfilled', () => {
    const plan = { date: '2026-05-27', tasks: [{ title: 'Meditasyon', done: false }] };
    const state = userReducer(initialState, {
      type: 'user/fetchDailyPlan/fulfilled',
      payload: plan,
    });
    expect(state.dailyPlan).toEqual(plan);
  });

  it('handles fetchUserStats.fulfilled', () => {
    const state = userReducer(initialState, {
      type: 'user/fetchStats/fulfilled',
      payload: { totalTalks: 5, streak: 3, points: 450 },
    });
    expect(state.stats.totalTalks).toBe(5);
    expect(state.stats.streak).toBe(3);
    expect(state.stats.points).toBe(450);
  });
});
