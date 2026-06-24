const admin = require('firebase-admin');
const { enforceRateLimit } = require('../src/rateLimiter');

// Drive the Firestore transaction by hand: program what tx.get() returns and
// capture whether the callback chose set (reset/new window) or update (incr).
function withTransaction({ exists, data }) {
  const ref = { id: 'rate_limits/doc' };
  admin.__api.firestoreApi.collection.mockReturnValue({ doc: jest.fn(() => ref) });
  const tx = {
    get: jest.fn().mockResolvedValue({ exists, data: () => data }),
    set: jest.fn(),
    update: jest.fn(),
  };
  admin.__api.firestoreApi.runTransaction.mockImplementation((cb) => cb(tx));
  return { tx, ref };
}

function currentWindowStart(windowSeconds = 60) {
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec - (nowSec % windowSeconds);
}

describe('enforceRateLimit', () => {
  beforeEach(() => admin.__reset());

  it('is a no-op for an empty key (gated elsewhere)', async () => {
    await expect(enforceRateLimit('', 'act')).resolves.toBeUndefined();
    expect(admin.__api.firestoreApi.runTransaction).not.toHaveBeenCalled();
  });

  it('opens a fresh counter on the first call in a window', async () => {
    const { tx } = withTransaction({ exists: false, data: null });
    await enforceRateLimit('user1', 'mint', { max: 5, windowSeconds: 60 });
    expect(tx.set).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ count: 1, action: 'mint', key: 'user1' })
    );
    expect(tx.update).not.toHaveBeenCalled();
  });

  it('increments while under the limit in the same window', async () => {
    const { tx } = withTransaction({
      exists: true,
      data: { windowStart: currentWindowStart(), count: 2 },
    });
    await enforceRateLimit('user1', 'mint', { max: 5, windowSeconds: 60 });
    expect(tx.update).toHaveBeenCalledWith(expect.anything(), { count: 3 });
    expect(tx.set).not.toHaveBeenCalled();
  });

  it('throws resource-exhausted at the limit', async () => {
    withTransaction({ exists: true, data: { windowStart: currentWindowStart(), count: 5 } });
    await expect(enforceRateLimit('user1', 'mint', { max: 5, windowSeconds: 60 })).rejects.toThrow(
      /Rate limit exceeded/
    );
  });

  it('resets the counter when the stored window is stale', async () => {
    const { tx } = withTransaction({
      exists: true,
      data: { windowStart: currentWindowStart() - 120, count: 99 },
    });
    await enforceRateLimit('user1', 'mint', { max: 5, windowSeconds: 60 });
    expect(tx.set).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ count: 1 }));
  });
});
