const admin = require('firebase-admin');
const { recomputeLeaderboard, onMetricUpdated } = require('../src/leaderboard');

// Build a chainable Firestore query whose terminal .get() yields `docs`.
function queryReturning(docs) {
  const query = {};
  query.where = jest.fn(() => query);
  query.orderBy = jest.fn(() => query);
  query.limit = jest.fn(() => query);
  query.get = jest.fn().mockResolvedValue({ docs });
  return query;
}

// doc() handler: users/* return a profile, leaderboards/* capture the set().
function wireDocs(setMock, profile = { nickname: 'Ayşe', avatarEmoji: '🌿', avatarBg: '#fff' }) {
  admin.__api.firestoreApi.doc.mockImplementation((path) => {
    if (path.startsWith('leaderboards/')) return { set: setMock };
    return { get: jest.fn().mockResolvedValue({ data: () => profile }) };
  });
}

describe('recomputeLeaderboard (callable)', () => {
  beforeEach(() => admin.__reset());

  it('refuses non-admin callers', async () => {
    await expect(
      recomputeLeaderboard({ challengeId: 'c1' }, { auth: { token: {} } })
    ).rejects.toMatchObject({ code: 'permission-denied' });
  });

  it('requires a challengeId', async () => {
    await expect(
      recomputeLeaderboard({}, { auth: { token: { admin: true } } })
    ).rejects.toMatchObject({ code: 'invalid-argument' });
  });

  it('recomputes and writes a ranked leaderboard for an admin', async () => {
    const setMock = jest.fn().mockResolvedValue(undefined);
    admin.__api.firestoreApi.collection.mockReturnValue(
      queryReturning([{ data: () => ({ uid: 'u1', currentProgress: 42 }) }])
    );
    wireDocs(setMock);

    const result = await recomputeLeaderboard(
      { challengeId: 'c1' },
      { auth: { token: { admin: true } } }
    );

    expect(result).toEqual({ ok: true, challengeId: 'c1' });
    expect(admin.__api.firestoreApi.doc).toHaveBeenCalledWith('leaderboards/c1');
    const payload = setMock.mock.calls[0][0];
    expect(payload.challengeId).toBe('c1');
    expect(payload.entries).toEqual([
      expect.objectContaining({ rank: 1, uid: 'u1', value: 42, name: 'Ayşe' }),
    ]);
  });
});

describe('onMetricUpdated (trigger)', () => {
  beforeEach(() => admin.__reset());

  it('ignores deletions / docs without a challengeId', async () => {
    const change = { after: { exists: false, data: () => null } };
    await expect(onMetricUpdated(change, {})).resolves.toBeNull();
    expect(admin.__api.firestoreApi.collection).not.toHaveBeenCalled();
  });

  it('recomputes the leaderboard for the affected challenge', async () => {
    const setMock = jest.fn().mockResolvedValue(undefined);
    admin.__api.firestoreApi.collection.mockReturnValue(queryReturning([]));
    wireDocs(setMock);

    const change = { after: { exists: true, data: () => ({ challengeId: 'c9' }) } };
    await onMetricUpdated(change, {});
    expect(admin.__api.firestoreApi.doc).toHaveBeenCalledWith('leaderboards/c9');
  });
});
