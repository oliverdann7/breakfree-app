// Guards the P0 fix: the client must NOT be able to grant itself Pro. The
// `subscribe` thunk only ever returns a LOCAL, non-persisted sub under the dev
// mock flag, and rejects otherwise. Real entitlement is written server-side by
// the RevenueCat webhook (covered by Firestore rules, not this unit test).
jest.mock('../constants/featureFlags', () => ({
  featureFlags: { mockPremiumPurchase: false },
}));

import { featureFlags } from '../constants/featureFlags';
import { subscribe, cancelSubscription } from '../store/slices/premiumSlice';

const run = (thunk) => thunk(jest.fn(), jest.fn(), undefined);

describe('premium subscribe gating', () => {
  afterEach(() => {
    featureFlags.mockPremiumPurchase = false;
  });

  it('rejects when the mock-purchase flag is off (production)', async () => {
    const action = await run(subscribe({ planId: 'pro_monthly' }));
    expect(action.type).toBe('premium/subscribe/rejected');
    expect(action.payload).toMatch(/kullanılamıyor/i);
  });

  it('returns a local, non-persisted sub when the dev flag is on', async () => {
    featureFlags.mockPremiumPurchase = true;
    const action = await run(subscribe({ planId: 'pro_annual' }));
    expect(action.type).toBe('premium/subscribe/fulfilled');
    expect(action.payload).toMatchObject({
      planId: 'pro_annual',
      status: 'active',
      provider: 'mock-dev',
      local: true,
    });
  });

  it('rejects an unknown plan', async () => {
    featureFlags.mockPremiumPurchase = true;
    const action = await run(subscribe({ planId: 'nope' }));
    expect(action.type).toBe('premium/subscribe/rejected');
  });

  it('cancel rejects in production and resolves under the dev flag', async () => {
    const off = await run(cancelSubscription());
    expect(off.type).toBe('premium/cancel/rejected');

    featureFlags.mockPremiumPurchase = true;
    const on = await run(cancelSubscription());
    expect(on.type).toBe('premium/cancel/fulfilled');
  });
});
