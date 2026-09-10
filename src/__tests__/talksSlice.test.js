import { configureStore } from '@reduxjs/toolkit';
import talksReducer, {
  setFilter,
  clearCurrentTalk,
  realtimeTalksUpdate,
  isTalksCacheFresh,
  fetchTalks,
  requestMoreTalks,
  TALKS_TTL_MS,
} from '../store/slices/talksSlice';

// Force the no-backend path so the thunk's payload creator is deterministic
// in the condition/load-more regression tests below.
jest.mock('../services/firebase', () => ({ db: null }));

const initialState = {
  allTalks: [],
  currentTalk: null,
  loading: false,
  loadingMoreTalks: false,
  hasMoreTalks: true,
  lastFetchedAt: null,
  fetchedPageSize: 0,
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

  // Regression: the action creator was defined in the slice but not exported,
  // so TalksListScreen's onSnapshot dispatched `undefined(...)` and crashed on
  // the first realtime snapshot whenever Firestore was configured.
  it('exports realtimeTalksUpdate and replaces the talk list', () => {
    expect(typeof realtimeTalksUpdate).toBe('function');
    const talks = [{ talkId: 't1' }, { talkId: 't2' }];
    const state = talksReducer(initialState, realtimeTalksUpdate(talks));
    expect(state.allTalks).toEqual(talks);
  });

  it('accepts the windowed { talks, hasMore } realtime payload', () => {
    const loadingMore = { ...initialState, loadingMoreTalks: true };
    const state = talksReducer(
      loadingMore,
      realtimeTalksUpdate({ talks: [{ talkId: 't1' }], hasMore: false })
    );
    expect(state.allTalks).toEqual([{ talkId: 't1' }]);
    expect(state.hasMoreTalks).toBe(false);
    expect(state.loadingMoreTalks).toBe(false);
  });

  it('handles requestMoreTalks', () => {
    const state = talksReducer(initialState, { type: 'talks/requestMoreTalks' });
    expect(state.loadingMoreTalks).toBe(true);
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

  describe('isTalksCacheFresh (fetch TTL)', () => {
    const now = 1_000_000_000;
    const cached = {
      ...initialState,
      allTalks: [{ talkId: 't1' }],
      lastFetchedAt: now - 1000,
      fetchedPageSize: 20,
    };

    it('is fresh within the TTL for a covered window', () => {
      expect(isTalksCacheFresh(cached, 20, now)).toBe(true);
    });

    it('is stale once the TTL elapses', () => {
      expect(isTalksCacheFresh(cached, 20, now + TALKS_TTL_MS + 1)).toBe(false);
    });

    it('is stale when a larger window is requested or the list is empty', () => {
      expect(isTalksCacheFresh(cached, 40, now)).toBe(false);
      expect(isTalksCacheFresh({ ...cached, allTalks: [] }, 20, now)).toBe(false);
    });
  });

  describe('fetch condition × load-more (regression)', () => {
    const makeStore = (talks) =>
      configureStore({
        reducer: { talks: talksReducer },
        preloadedState: { talks },
      });

    const freshState = {
      ...initialState,
      allTalks: [{ talkId: 't1' }],
      lastFetchedAt: Date.now(),
      fetchedPageSize: 40,
    };

    it('skips the fetch entirely while the cache window is fresh', async () => {
      const store = makeStore(freshState);
      const result = await store.dispatch(fetchTalks({ pageSize: 20 }));
      expect(result.meta.condition).toBe(true);
    });

    // Regression (mirrors videosSlice): requestMoreTalks() sets
    // loadingMoreTalks before the fetch dispatches; a condition-cancelled
    // dispatch fires no lifecycle action, so nothing on the fetch path would
    // ever clear the flag.
    it('never cancels a pending load-more, so loadingMoreTalks always clears', async () => {
      const store = makeStore(freshState);
      store.dispatch(requestMoreTalks());
      expect(store.getState().talks.loadingMoreTalks).toBe(true);
      const result = await store.dispatch(fetchTalks({ pageSize: 40 }));
      expect(result.meta.condition).not.toBe(true);
      expect(store.getState().talks.loadingMoreTalks).toBe(false);
    });
  });

  it('records cache metadata on fetchTalks.fulfilled', () => {
    const state = talksReducer(initialState, {
      type: 'talks/fetchAll/fulfilled',
      meta: { arg: { pageSize: 40 } },
      payload: { talks: [{ talkId: 't1' }], hasMore: true },
    });
    expect(typeof state.lastFetchedAt).toBe('number');
    expect(state.fetchedPageSize).toBe(40);
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
