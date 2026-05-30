import {
  captureException,
  captureMessage,
  addBreadcrumb,
  setUser,
  __pendingQueue,
  __reset,
} from '../services/sentryService';

beforeEach(() => __reset());

describe('sentryService queue (pre-init)', () => {
  it('queues exceptions when SDK not initialized', () => {
    const err = new Error('boom');
    captureException(err, { uid: 'u1' });
    expect(__pendingQueue()).toEqual([
      expect.objectContaining({ kind: 'exception', error: err, context: { uid: 'u1' } }),
    ]);
  });

  it('queues messages with default level', () => {
    captureMessage('hi');
    expect(__pendingQueue()[0]).toEqual(
      expect.objectContaining({ kind: 'message', message: 'hi', level: 'info' })
    );
  });

  it('queues breadcrumbs and user', () => {
    addBreadcrumb({ category: 'nav', message: 'home' });
    setUser({ id: 'u1' });
    const q = __pendingQueue();
    expect(q[0].kind).toBe('breadcrumb');
    expect(q[1].kind).toBe('user');
  });
});
