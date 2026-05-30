// Phase 3 Sprint 11 — request batcher.
// Coalesces N calls to fetchOne(id) within `windowMs` into one fetchMany([ids])
// call. Useful for hydrating users-by-uid or talks-by-id without N+1 reads.

export function createBatcher({ fetchMany, windowMs = 20, maxBatch = 100 }) {
  let pending = [];
  let timer = null;

  const flush = async () => {
    const batch = pending;
    pending = [];
    timer = null;
    if (batch.length === 0) return;

    const ids = batch.map((b) => b.id);
    try {
      const results = await fetchMany(ids);
      const lookup = new Map(results.map((r) => [r?.id ?? r?.uid ?? null, r]));
      batch.forEach(({ id, resolve }) => resolve(lookup.get(id) ?? null));
    } catch (err) {
      batch.forEach(({ reject }) => reject(err));
    }
  };

  return function load(id) {
    return new Promise((resolve, reject) => {
      pending.push({ id, resolve, reject });
      if (pending.length >= maxBatch) {
        if (timer) clearTimeout(timer);
        flush();
      } else if (!timer) {
        timer = setTimeout(flush, windowMs);
      }
    });
  };
}
