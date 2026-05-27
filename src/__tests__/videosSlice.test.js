import videosReducer, {
  setActiveCategory,
  clearCurrentVideo,
  updateLocalProgress,
} from '../store/slices/videosSlice';

const initialState = {
  allVideos: [],
  currentVideo: null,
  progress: {},
  loading: false,
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
});
