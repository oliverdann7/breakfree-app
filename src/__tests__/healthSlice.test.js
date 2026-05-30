import healthReducer from '../store/slices/healthSlice';

const initial = {
  connectedSources: [],
  daily: null,
  weekly: [],
  syncStatus: 'idle',
  lastSync: null,
  error: null,
};

describe('healthSlice', () => {
  it('returns initial state', () => {
    expect(healthReducer(undefined, { type: 'unknown' })).toEqual(initial);
  });

  it('connectSource.fulfilled adds source once', () => {
    let s = healthReducer(initial, {
      type: 'health/connect/fulfilled',
      payload: 'appleHealth',
    });
    expect(s.connectedSources).toEqual(['appleHealth']);
    s = healthReducer(s, { type: 'health/connect/fulfilled', payload: 'appleHealth' });
    expect(s.connectedSources).toEqual(['appleHealth']);
  });

  it('disconnectSource.fulfilled removes source', () => {
    const seeded = { ...initial, connectedSources: ['appleHealth', 'garmin'] };
    const s = healthReducer(seeded, {
      type: 'health/disconnect/fulfilled',
      payload: 'appleHealth',
    });
    expect(s.connectedSources).toEqual(['garmin']);
  });

  it('syncDaily lifecycle: pending → fulfilled', () => {
    let s = healthReducer(initial, { type: 'health/syncDaily/pending' });
    expect(s.syncStatus).toBe('syncing');
    s = healthReducer(s, {
      type: 'health/syncDaily/fulfilled',
      payload: { sourceId: 'appleHealth', data: { steps: 8000 } },
    });
    expect(s.syncStatus).toBe('synced');
    expect(s.daily).toEqual({ steps: 8000 });
    expect(s.lastSync).toBeTruthy();
  });

  it('syncDaily.rejected captures error', () => {
    const s = healthReducer(initial, {
      type: 'health/syncDaily/rejected',
      payload: 'denied',
    });
    expect(s.syncStatus).toBe('error');
    expect(s.error).toBe('denied');
  });

  it('syncWeekly.fulfilled stores array', () => {
    const data = [{ date: '2026-05-29', steps: 1 }];
    const s = healthReducer(initial, {
      type: 'health/syncWeekly/fulfilled',
      payload: { sourceId: 'appleHealth', data },
    });
    expect(s.weekly).toEqual(data);
  });
});
