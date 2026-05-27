import challengesReducer from '../store/slices/challengesSlice';

const initialState = {
  challenges: [],
  userParticipation: {},
  loading: false,
  error: null,
};

describe('challengesSlice', () => {
  it('returns initial state', () => {
    const state = challengesReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('handles fetchActiveChallenges.pending', () => {
    const state = challengesReducer(initialState, {
      type: 'challenges/fetchActive/pending',
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchActiveChallenges.fulfilled', () => {
    const payload = {
      challenges: [
        {
          id: 'c1',
          title: '7 Günde 8000 Adım',
          endDate: Date.now() + 86400000 * 3,
          targetValue: 7,
          targetMetric: 'gün',
          participantCount: 234,
        },
      ],
      participation: { c1: { currentProgress: 4, completed: false } },
    };
    const state = challengesReducer(initialState, {
      type: 'challenges/fetchActive/fulfilled',
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.challenges).toHaveLength(1);
    expect(state.challenges[0].title).toBe('7 Günde 8000 Adım');
    expect(state.userParticipation.c1.currentProgress).toBe(4);
  });

  it('handles fetchActiveChallenges.fulfilled with empty data', () => {
    const payload = { challenges: [], participation: {} };
    const state = challengesReducer(initialState, {
      type: 'challenges/fetchActive/fulfilled',
      payload,
    });
    expect(state.challenges).toEqual([]);
    expect(state.userParticipation).toEqual({});
  });

  it('handles fetchActiveChallenges.rejected', () => {
    const state = challengesReducer(initialState, {
      type: 'challenges/fetchActive/rejected',
      payload: 'Firebase error',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Firebase error');
  });

  it('handles joinChallenge.fulfilled', () => {
    const existing = {
      ...initialState,
      challenges: [{ id: 'c1', title: 'Walkathon', participantCount: 10 }],
    };
    const state = challengesReducer(existing, {
      type: 'challenges/join/fulfilled',
      payload: 'c1',
    });
    expect(state.challenges[0].participantCount).toBe(11);
    expect(state.userParticipation.c1.joinedAt).toBeDefined();
    expect(state.userParticipation.c1.currentProgress).toBe(0);
    expect(state.userParticipation.c1.completed).toBe(false);
  });
});
