import { createBatcher } from '../utils/requestBatcher';

describe('requestBatcher', () => {
  it('coalesces concurrent loads into one fetchMany call', async () => {
    const fetchMany = jest.fn(async (ids) => ids.map((id) => ({ id, name: `user-${id}` })));
    const load = createBatcher({ fetchMany, windowMs: 5 });

    const [a, b, c] = await Promise.all([load('1'), load('2'), load('3')]);

    expect(fetchMany).toHaveBeenCalledTimes(1);
    expect(fetchMany).toHaveBeenCalledWith(['1', '2', '3']);
    expect(a).toEqual({ id: '1', name: 'user-1' });
    expect(b).toEqual({ id: '2', name: 'user-2' });
    expect(c).toEqual({ id: '3', name: 'user-3' });
  });

  it('returns null when id missing from results', async () => {
    const fetchMany = jest.fn(async () => [{ id: '1', name: 'one' }]);
    const load = createBatcher({ fetchMany, windowMs: 5 });
    const [a, b] = await Promise.all([load('1'), load('2')]);
    expect(a.name).toBe('one');
    expect(b).toBeNull();
  });

  it('flushes immediately at maxBatch size', async () => {
    const fetchMany = jest.fn(async (ids) => ids.map((id) => ({ id })));
    const load = createBatcher({ fetchMany, windowMs: 10000, maxBatch: 2 });
    await Promise.all([load('1'), load('2')]);
    expect(fetchMany).toHaveBeenCalledTimes(1);
  });

  it('rejects all pending on fetchMany throw', async () => {
    const fetchMany = jest.fn(async () => {
      throw new Error('boom');
    });
    const load = createBatcher({ fetchMany, windowMs: 5 });
    await expect(Promise.all([load('1'), load('2')])).rejects.toThrow('boom');
  });
});
