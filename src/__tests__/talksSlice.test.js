import talksReducer, { setFilter, clearCurrentTalk } from '../store/slices/talksSlice';

const initialState = {
  allTalks: [],
  currentTalk: null,
  loading: false,
  error: null,
  filter: 'all',
};

describe('talksSlice', () => {
  it('returns initial state', () => {
    const state = talksReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('handles setFilter', () => {
    const state = talksReducer(initialState, setFilter('live'));
    expect(state.filter).toBe('live');
  });

  it('handles clearCurrentTalk', () => {
    const loaded = { ...initialState, currentTalk: { talkId: 't1' } };
    const state = talksReducer(loaded, clearCurrentTalk());
    expect(state.currentTalk).toBeNull();
  });

  it('handles fetchTalks.pending', () => {
    const state = talksReducer(initialState, { type: 'talks/fetchAll/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchTalks.fulfilled', () => {
    const payload = [
      { talkId: 't1', title: 'Anksiyeteyi Anlamak', status: 'scheduled' },
      { talkId: 't2', title: 'Sabah Rutininin Gücü', status: 'live' },
    ];
    const state = talksReducer(initialState, {
      type: 'talks/fetchAll/fulfilled',
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.allTalks).toHaveLength(2);
    expect(state.allTalks[0].title).toBe('Anksiyeteyi Anlamak');
  });

  it('handles fetchTalks.fulfilled with empty array', () => {
    const state = talksReducer(initialState, {
      type: 'talks/fetchAll/fulfilled',
      payload: [],
    });
    expect(state.allTalks).toEqual([]);
  });

  it('handles fetchTalks.rejected', () => {
    const state = talksReducer(initialState, {
      type: 'talks/fetchAll/rejected',
      payload: 'Firebase error',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Firebase error');
  });

  it('handles fetchTalkById.pending', () => {
    const state = talksReducer(initialState, { type: 'talks/fetchById/pending' });
    expect(state.loading).toBe(true);
  });

  it('handles fetchTalkById.fulfilled', () => {
    const talk = { talkId: 't1', title: 'Meditasyon', status: 'live', listeners: 42 };
    const state = talksReducer(initialState, {
      type: 'talks/fetchById/fulfilled',
      payload: talk,
    });
    expect(state.loading).toBe(false);
    expect(state.currentTalk).toEqual(talk);
  });

  it('handles fetchTalkById.rejected', () => {
    const state = talksReducer(initialState, {
      type: 'talks/fetchById/rejected',
      payload: 'Talk not found',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Talk not found');
  });

  it('handles seedTalks.fulfilled', () => {
    const state = talksReducer(initialState, {
      type: 'talks/seed/fulfilled',
      payload: ['id1', 'id2'],
    });
    expect(state.seeded).toBe(true);
  });

  it('handles joinTalk.fulfilled increments listeners', () => {
    const existing = {
      ...initialState,
      allTalks: [{ talkId: 't1', title: 'Test Talk', listeners: 10 }],
    };
    const state = talksReducer(existing, {
      type: 'talks/join/fulfilled',
      payload: 't1',
    });
    expect(state.allTalks[0].listeners).toBe(11);
  });

  it('handles joinTalk.fulfilled increments currentTalk listeners', () => {
    const existing = {
      ...initialState,
      allTalks: [{ talkId: 't1', listeners: 5 }],
      currentTalk: { talkId: 't1', listeners: 5 },
    };
    const state = talksReducer(existing, {
      type: 'talks/join/fulfilled',
      payload: 't1',
    });
    expect(state.currentTalk.listeners).toBe(6);
    expect(state.allTalks[0].listeners).toBe(6);
  });
});
