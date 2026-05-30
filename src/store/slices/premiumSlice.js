import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

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

// Placeholder: real impl will call backend → Stripe/RevenueCat → webhook updates Firestore.
export const subscribe = createAsyncThunk(
  'premium/subscribe',
  async ({ uid, planId }, { rejectWithValue }) => {
    try {
      const plan = PLANS.find((p) => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      const subscription = {
        planId,
        status: 'active',
        startedAt: Date.now(),
        renewAt: Date.now() + (plan.interval === 'year' ? 365 : 30) * 86_400_000,
        trial: true,
        provider: 'mock',
      };

      if (db && uid) {
        await setDoc(doc(db, 'users', uid, 'subscription', 'current'), subscription);
      }
      return subscription;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelSubscription = createAsyncThunk(
  'premium/cancel',
  async (uid, { rejectWithValue }) => {
    try {
      if (db && uid) {
        await setDoc(
          doc(db, 'users', uid, 'subscription', 'current'),
          { status: 'cancelled', cancelledAt: Date.now() },
          { merge: true }
        );
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
