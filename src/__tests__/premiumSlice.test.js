import premiumReducer, { PLANS, selectIsPremium } from '../store/slices/premiumSlice';

const initial = {
  plans: PLANS,
  subscription: null,
  loading: false,
  error: null,
};

describe('premiumSlice', () => {
  it('returns initial state', () => {
    expect(premiumReducer(undefined, { type: 'unknown' })).toEqual(initial);
  });

  it('exposes two plans (monthly + annual)', () => {
    expect(PLANS.length).toBe(2);
    const ids = PLANS.map((p) => p.id);
    expect(ids).toEqual(['pro_monthly', 'pro_annual']);
  });

  it('fetchSubscription.pending sets loading', () => {
    const s = premiumReducer(initial, { type: 'premium/fetch/pending' });
    expect(s.loading).toBe(true);
  });

  it('fetchSubscription.fulfilled sets subscription', () => {
    const sub = { planId: 'pro_monthly', status: 'active' };
    const s = premiumReducer(initial, {
      type: 'premium/fetch/fulfilled',
      payload: sub,
    });
    expect(s.loading).toBe(false);
    expect(s.subscription).toEqual(sub);
  });

  it('subscribe.fulfilled overwrites subscription', () => {
    const s = premiumReducer(initial, {
      type: 'premium/subscribe/fulfilled',
      payload: { planId: 'pro_annual', status: 'active' },
    });
    expect(s.subscription.planId).toBe('pro_annual');
  });

  it('cancel marks subscription cancelled', () => {
    const seeded = { ...initial, subscription: { planId: 'pro_monthly', status: 'active' } };
    const s = premiumReducer(seeded, { type: 'premium/cancel/fulfilled' });
    expect(s.subscription.status).toBe('cancelled');
  });

  it('selectIsPremium reads only active', () => {
    expect(selectIsPremium({ premium: { subscription: null } })).toBe(false);
    expect(selectIsPremium({ premium: { subscription: { status: 'active' } } })).toBe(true);
    expect(selectIsPremium({ premium: { subscription: { status: 'cancelled' } } })).toBe(false);
  });
});
