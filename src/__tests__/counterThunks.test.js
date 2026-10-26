// The like / listener / participant counters may only move in the same batch
// that creates or deletes the user's own record (firestore.rules
// counterTracksRecord). These tests pin the client side of that contract:
// record + counter go through one writeBatch, and re-joins write nothing.
const mockBatch = { set: jest.fn(), update: jest.fn(), delete: jest.fn(), commit: jest.fn() };
const mockGetDoc = jest.fn();

jest.mock('../services/firebase', () => ({ db: {} }));
jest.mock('firebase/firestore', () => ({
  doc: (_db, ...path) => ({ path: path.join('/') }),
  getDoc: (...args) => mockGetDoc(...args),
  writeBatch: () => mockBatch,
  increment: (n) => ({ increment: n }),
  collection: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  setDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  onSnapshot: jest.fn(),
  startAfter: jest.fn(),
}));

import { toggleLike } from '../store/slices/communitySlice';
import { joinTalk } from '../store/slices/talksSlice';
import { joinChallenge } from '../store/slices/challengesSlice';

const run = (thunk, state = {}) => thunk(jest.fn(), () => state, undefined);

beforeEach(() => {
  jest.clearAllMocks();
  mockBatch.commit.mockResolvedValue(undefined);
});

describe('toggleLike', () => {
  it('likes: creates the record and bumps the counter in one batch', async () => {
    const action = await run(toggleLike({ postId: 'p1', uid: 'u1', currentlyLiked: false }));
    expect(action.type).toBe('community/toggleLike/fulfilled');
    expect(mockBatch.set).toHaveBeenCalledWith(
      { path: 'liked_posts/u1_p1' },
      expect.objectContaining({ uid: 'u1', postId: 'p1' })
    );
    expect(mockBatch.update).toHaveBeenCalledWith(
      { path: 'posts/p1' },
      { likes: { increment: 1 } }
    );
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
  });

  it('unlikes: deletes the record and decrements in one batch', async () => {
    await run(toggleLike({ postId: 'p1', uid: 'u1', currentlyLiked: true }));
    expect(mockBatch.delete).toHaveBeenCalledWith({ path: 'liked_posts/u1_p1' });
    expect(mockBatch.update).toHaveBeenCalledWith(
      { path: 'posts/p1' },
      { likes: { increment: -1 } }
    );
    expect(mockBatch.commit).toHaveBeenCalledTimes(1);
  });
});

describe('joinTalk', () => {
  const state = { auth: { user: { uid: 'u1' } } };

  it('first join writes the participant record and the counter together', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });
    const action = await run(joinTalk('t1'), state);
    expect(action.payload).toEqual({ talkId: 't1', counted: true });
    expect(mockBatch.set).toHaveBeenCalledWith(
      { path: 'talks_participants/t1_u1' },
      expect.objectContaining({ uid: 'u1', talkId: 't1' })
    );
    expect(mockBatch.update).toHaveBeenCalledWith(
      { path: 'talks/t1' },
      { listeners: { increment: 1 } }
    );
  });

  it('re-joining is a no-op', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => true });
    const action = await run(joinTalk('t1'), state);
    expect(action.payload).toEqual({ talkId: 't1', counted: false });
    expect(mockBatch.commit).not.toHaveBeenCalled();
  });

  it('rejects when signed out', async () => {
    const action = await run(joinTalk('t1'), { auth: { user: null } });
    expect(action.type).toBe('talks/join/rejected');
  });
});

describe('joinChallenge', () => {
  it('first join creates a zero-progress record and bumps the counter in one batch', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });
    const action = await run(joinChallenge({ challengeId: 'c1', uid: 'u1' }));
    expect(action.payload).toEqual({ challengeId: 'c1', counted: true });
    expect(mockBatch.set).toHaveBeenCalledWith(
      { path: 'challenge_participants/c1_u1' },
      expect.objectContaining({ uid: 'u1', challengeId: 'c1', currentProgress: 0 })
    );
    expect(mockBatch.update).toHaveBeenCalledWith(
      { path: 'challenges/c1' },
      { participantCount: { increment: 1 } }
    );
  });

  it('re-joining is a no-op', async () => {
    mockGetDoc.mockResolvedValue({ exists: () => true });
    const action = await run(joinChallenge({ challengeId: 'c1', uid: 'u1' }));
    expect(action.payload).toEqual({ challengeId: 'c1', counted: false });
    expect(mockBatch.commit).not.toHaveBeenCalled();
  });
});
