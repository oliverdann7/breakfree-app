import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { featureFlags } from '../../constants/featureFlags';

export const PLANS = [
  {
    id: 'pro_monthly',
    name: 'BreakFree Pro',
    price: 29.99,
    currency: 'TRY',
    interval: 'month',
    intervalLabel: '/ay',
    features: [
      'Gelişmiş sağlık analizi',
      'Haftada 1 mentor seansı',
      'Reklamsız deneyim',
      'Tüm rozetler',
    ],
  },
  {
    id: 'pro_annual',
    name: 'BreakFree Pro Yıllık',
    price: 299.99,
    currency: 'TRY',
    interval: 'year',
    intervalLabel: '/yıl',
    badge: '%17 İndirim',
    features: [
      'Gelişmiş sağlık analizi',
      'Haftada 1 mentor seansı',
      'Reklamsız deneyim',
      'Tüm rozetler',
      'Talk kayıtlarına erken erişim',
      'Öncelikli destek',
    ],
  },
];

export const fetchSubscription = createAsyncThunk(
  'premium/fetch',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db || !uid) return null;
      const snap = await getDoc(doc(db, 'users', uid, 'subscription', 'current'));
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Entitlement is the server's call: a real purchase goes through the native
// store → RevenueCat → `revenueCatWebhook` Cloud Function, which is the ONLY
// writer of `users/{uid}/subscription/current` (clients are denied by the
// Firestore rules). This thunk therefore never writes that doc itself.
//   - When `mockPremiumPurchase` is on (dev), it returns a LOCAL, non-persisted
//     active subscription so the Pro UI can be exercised; it is lost on reload
//     and confers no real entitlement.
//   - Otherwise it rejects, since native IAP is not wired yet.
export const subscribe = createAsyncThunk(
  'premium/subscribe',
  async ({ planId }, { rejectWithValue }) => {
    try {
      const plan = PLANS.find((p) => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      if (!featureFlags.mockPremiumPurchase) {
        return rejectWithValue('Satın alma şu anda kullanılamıyor. Mağaza entegrasyonu yakında.');
      }

      return {
        planId,
        status: 'active',
        startedAt: Date.now(),
        renewAt: Date.now() + (plan.interval === 'year' ? 365 : 30) * 86_400_000,
        trial: true,
        provider: 'mock-dev',
        local: true,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Real cancellation is handled by the store + RevenueCat, with the webhook
// reflecting it into Firestore. Without the native SDK we can only mirror it
// locally under the dev mock flag.
export const cancelSubscription = createAsyncThunk(
  'premium/cancel',
  async (_, { rejectWithValue }) => {
    if (!featureFlags.mockPremiumPurchase) {
      return rejectWithValue(
        'Abonelik iptali mağaza üzerinden yönetilir. Yakında uygulama içinden de yapılabilecek.'
      );
    }
    return true;
  }
);

const premiumSlice = createSlice({
  name: 'premium',
  initialState: {
    plans: PLANS,
    subscription: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(subscribe.fulfilled, (state, action) => {
        state.subscription = action.payload;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        if (state.subscription) state.subscription.status = 'cancelled';
      });
  },
});

export const selectIsPremium = (state) => state.premium.subscription?.status === 'active';

export default premiumSlice.reducer;
