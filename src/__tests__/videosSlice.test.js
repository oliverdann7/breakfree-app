import { configureStore } from '@reduxjs/toolkit';
import videosReducer, {
  setActiveCategory,
  clearCurrentVideo,
  updateLocalProgress,
  isVideoLocked,
  isVideosCacheFresh,
  fetchVideos,
  requestMoreVideos,
  VIDEOS_TTL_MS,
} from '../store/slices/videosSlice';

// Force the no-backend path so the thunk's payload creator is deterministic
// in the condition/load-more regression tests below.
jest.mock('../services/firebase', () => ({ db: null }));

// Lock semantics only apply once the IAP flow is live; force the flag on so
// the gating logic itself stays covered.
jest.mock('../constants/featureFlags', () => ({
  featureFlags: { premiumSubscription: true },
  isEnabled: (flag) => flag === 'premiumSubscription',
}));

const initialState = {
  allVideos: [],
  currentVideo: null,
  progress: {},
  progressUid: null,
  loading: false,
  loadingMoreVideos: false,
  hasMoreVideos: true,
  lastFetchedAt: null,
  fetchedPageSize: 0,
  error: null,
  activeCategory: 'Tümü',
};

describe('videosSlice', () => {
  it('returns initial state', () => {
    const state = videosReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('handles setActiveCategory', () => {
    const state = videosReducer(initialState, setActiveCategory('Zihin'));
    expect(state.activeCategory).toBe('Zihin');
  });

  it('handles clearCurrentVideo', () => {
    const loaded = { ...initialState, currentVideo: { videoId: 'v1' } };
    const state = videosReducer(loaded, clearCurrentVideo());
    expect(state.currentVideo).toBeNull();
  });

  it('handles updateLocalProgress', () => {
    const state = videosReducer(
      initialState,
      updateLocalProgress({ videoId: 'v1', progressSeconds: 120 })
    );
    expect(state.progress.v1).toBe(120);
  });

  it('handles fetchVideos.pending', () => {
    const state = videosReducer(initialState, { type: 'videos/fetchAll/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchVideos.fulfilled', () => {
    const payload = [
      { videoId: 'v1', title: 'Anksiyeteyi Yenmek', category: 'Zihin' },
      { videoId: 'v2', title: 'Sabah Rutini', category: 'Sağlık' },
    ];
    const state = videosReducer(initialState, {
      type: 'videos/fetchAll/fulfilled',
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.allVideos).toHaveLength(2);
    expect(state.allVideos[0].title).toBe('Anksiyeteyi Yenmek');
  });

  it('handles the windowed { videos, hasMore } payload', () => {
    const loadingMore = { ...initialState, loadingMoreVideos: true };
    const state = videosReducer(loadingMore, {
      type: 'videos/fetchAll/fulfilled',
      payload: { videos: [{ videoId: 'v1' }], hasMore: false },
    });
    expect(state.allVideos).toEqual([{ videoId: 'v1' }]);
    expect(state.hasMoreVideos).toBe(false);
    expect(state.loadingMoreVideos).toBe(false);
  });

  it('handles requestMoreVideos', () => {
    const state = videosReducer(initialState, { type: 'videos/requestMoreVideos' });
    expect(state.loadingMoreVideos).toBe(true);
  });

  it('handles fetchVideos.fulfilled with empty array', () => {
    const state = videosReducer(initialState, {
      type: 'videos/fetchAll/fulfilled',
      payload: [],
    });
    expect(state.allVideos).toEqual([]);
  });

  it('handles fetchVideos.rejected', () => {
    const state = videosReducer(initialState, {
      type: 'videos/fetchAll/rejected',
      payload: 'Network error',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('handles fetchVideoById.fulfilled', () => {
    const video = { videoId: 'v1', title: 'Meditasyon Temelleri', durationSeconds: 2100 };
    const state = videosReducer(initialState, {
      type: 'videos/fetchById/fulfilled',
      payload: video,
    });
    expect(state.currentVideo).toEqual(video);
  });

  it('handles saveWatchProgress.fulfilled', () => {
    const state = videosReducer(initialState, {
      type: 'videos/saveProgress/fulfilled',
      payload: { videoId: 'v1', progressSeconds: 600 },
    });
    expect(state.progress.v1).toBe(600);
  });

  it('handles saveWatchProgress.fulfilled with null', () => {
    const state = videosReducer(initialState, {
      type: 'videos/saveProgress/fulfilled',
      payload: null,
    });
    expect(state.progress).toEqual({});
  });

  it('hydrates the progress map on fetchWatchProgress.fulfilled', () => {
    const state = videosReducer(initialState, {
      type: 'videos/fetchProgress/fulfilled',
      meta: { arg: 'u1' },
      payload: { v1: 300, v2: 45 },
    });
    expect(state.progress).toEqual({ v1: 300, v2: 45 });
    expect(state.progressUid).toBe('u1');
  });

  it('keeps fresher in-session progress over the fetched snapshot (same user)', () => {
    const midSession = { ...initialState, progress: { v1: 900 }, progressUid: 'u1' };
    const state = videosReducer(midSession, {
      type: 'videos/fetchProgress/fulfilled',
      meta: { arg: 'u1' },
      payload: { v1: 300, v2: 45 },
    });
    expect(state.progress).toEqual({ v1: 900, v2: 45 });
  });

  it("replaces the map when the fetch is for a different user's uid", () => {
    const leftover = { ...initialState, progress: { v1: 900 }, progressUid: 'userA' };
    const state = videosReducer(leftover, {
      type: 'videos/fetchProgress/fulfilled',
      meta: { arg: 'userB' },
      payload: { v1: 45 },
    });
    expect(state.progress).toEqual({ v1: 45 });
    expect(state.progressUid).toBe('userB');
  });

  it('clears the progress map on logout', () => {
    const signedIn = { ...initialState, progress: { v1: 900 }, progressUid: 'userA' };
    const state = videosReducer(signedIn, { type: 'auth/logout/fulfilled' });
    expect(state.progress).toEqual({});
    expect(state.progressUid).toBeNull();
  });

  describe('isVideosCacheFresh (fetch TTL)', () => {
    const now = 1_000_000_000;
    const cached = {
      ...initialState,
      allVideos: [{ videoId: 'v1' }],
      lastFetchedAt: now - 1000,
      fetchedPageSize: 20,
    };

    it('is fresh within the TTL for a covered window', () => {
      expect(isVideosCacheFresh(cached, 20, now)).toBe(true);
    });

    it('is stale once the TTL elapses', () => {
      expect(isVideosCacheFresh(cached, 20, now + VIDEOS_TTL_MS + 1)).toBe(false);
    });

    it('is stale when a larger window is requested (load more)', () => {
      expect(isVideosCacheFresh(cached, 40, now)).toBe(false);
    });

    it('is stale when nothing was fetched yet or the list is empty', () => {
      expect(isVideosCacheFresh(initialState, 20, now)).toBe(false);
      expect(isVideosCacheFresh({ ...cached, allVideos: [] }, 20, now)).toBe(false);
    });
  });

  it('records cache metadata on fetchVideos.fulfilled', () => {
    const state = videosReducer(initialState, {
      type: 'videos/fetchAll/fulfilled',
      meta: { arg: { pageSize: 40 } },
      payload: { videos: [{ videoId: 'v1' }], hasMore: true },
    });
    expect(typeof state.lastFetchedAt).toBe('number');
    expect(state.fetchedPageSize).toBe(40);
  });

  // Seeded results (dev mocks / no backend) are stand-ins: recording them as
  // a fresh fetch would let an empty backend mask newly created real docs
  // for a whole TTL window.
  it('does not record cache metadata for seeded (mock/no-backend) results', () => {
    const state = videosReducer(initialState, {
      type: 'videos/fetchAll/fulfilled',
      meta: { arg: { pageSize: 20 } },
      payload: { videos: [{ videoId: 'v1' }], hasMore: false, seeded: true },
    });
    expect(state.allVideos).toEqual([{ videoId: 'v1' }]);
    expect(state.lastFetchedAt).toBeNull();
    expect(state.fetchedPageSize).toBe(0);
  });

  describe('fetch condition × load-more (regression)', () => {
    const makeStore = (videos) =>
      configureStore({
        reducer: { videos: videosReducer },
        preloadedState: { videos },
      });

    const freshState = {
      ...initialState,
      allVideos: [{ videoId: 'v1' }],
      lastFetchedAt: Date.now(),
      fetchedPageSize: 40,
    };

    it('skips the fetch entirely while the cache window is fresh', async () => {
      const store = makeStore(freshState);
      const result = await store.dispatch(fetchVideos({ pageSize: 20 }));
      expect(result.meta.condition).toBe(true);
    });

    // Regression: a screen remount resets its local pageSize while the store
    // still holds a fresh, wider window. requestMoreVideos() has already set
    // loadingMoreVideos when the fetch dispatches; if the condition cancelled
    // it, no lifecycle action would ever clear the flag — endless footer
    // spinner and pagination dead for the life of the screen.
    it('never cancels a pending load-more, so loadingMoreVideos always clears', async () => {
      const store = makeStore(freshState);
      store.dispatch(requestMoreVideos());
      expect(store.getState().videos.loadingMoreVideos).toBe(true);
      const result = await store.dispatch(fetchVideos({ pageSize: 40 }));
      expect(result.meta.condition).not.toBe(true);
      expect(store.getState().videos.loadingMoreVideos).toBe(false);
    });
  });

  describe('isVideoLocked', () => {
    it('locks premium content for non-premium users', () => {
      expect(isVideoLocked({ isPremium: true }, false)).toBe(true);
    });

    it('unlocks premium content for premium users', () => {
      expect(isVideoLocked({ isPremium: true }, true)).toBe(false);
    });

    it('never locks explicitly free content', () => {
      expect(isVideoLocked({ isPremium: false }, false)).toBe(false);
    });

    it('defaults to locked when the flag is missing (non-premium)', () => {
      expect(isVideoLocked({}, false)).toBe(true);
    });
  });
});
