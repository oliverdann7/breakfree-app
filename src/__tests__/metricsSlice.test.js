import metricsReducer, { setPeriod } from '../store/slices/metricsSlice';

const initialState = {
  dailyMetrics: null,
  weeklyData: [],
  wellnessScore: 0,
  selectedPeriod: 'week',
  loading: false,
  error: null,
};

describe('metricsSlice', () => {
  it('returns initial state', () => {
    const state = metricsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('handles setPeriod', () => {
    const state = metricsReducer(initialState, setPeriod('month'));
    expect(state.selectedPeriod).toBe('month');
  });

  it('handles fetchMetrics.pending', () => {
    const state = metricsReducer(initialState, { type: 'metrics/fetch/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchMetrics.fulfilled with data', () => {
    const payload = {
      dailyMetrics: { sleep: { hours: 7 }, steps: 8000 },
      weeklyData: [
        { wellnessScore: 75, date: '2026-05-20' },
        { wellnessScore: 80, date: '2026-05-21' },
      ],
      wellnessScore: 80,
    };
    const state = metricsReducer(initialState, {
      type: 'metrics/fetch/fulfilled',
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.dailyMetrics).toEqual(payload.dailyMetrics);
    expect(state.weeklyData).toHaveLength(2);
    expect(state.wellnessScore).toBe(80);
  });

  it('handles fetchMetrics.fulfilled with null daily', () => {
    const payload = { dailyMetrics: null, weeklyData: [], wellnessScore: 0 };
    const state = metricsReducer(initialState, {
      type: 'metrics/fetch/fulfilled',
      payload,
    });
    expect(state.dailyMetrics).toBeNull();
    expect(state.wellnessScore).toBe(0);
  });

  it('handles fetchMetrics.rejected', () => {
    const state = metricsReducer(initialState, {
      type: 'metrics/fetch/rejected',
      payload: 'Firebase error',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Firebase error');
  });

  it('handles logMetric.fulfilled', () => {
    const existing = {
      ...initialState,
      dailyMetrics: { steps: 5000 },
      wellnessScore: 60,
    };
    const state = metricsReducer(existing, {
      type: 'metrics/log/fulfilled',
      payload: { steps: 8000, wellnessScore: 75 },
    });
    expect(state.dailyMetrics.steps).toBe(8000);
    expect(state.wellnessScore).toBe(75);
  });
});
