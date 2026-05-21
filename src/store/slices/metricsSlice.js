import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

export const fetchMetrics = createAsyncThunk('metrics/fetch', async (uid, { rejectWithValue }) => {
  try {
    if (!db || !uid) return { dailyMetrics: null, weeklyData: [], wellnessScore: 0 };
    const today = new Date().toISOString().split('T')[0];
    const todaySnap = await getDoc(doc(db, 'users', uid, 'metrics', today));
    const weekQ = query(collection(db, 'users', uid, 'metrics'), orderBy('date', 'desc'), limit(7));
    const weekSnap = await getDocs(weekQ);
    const weeklyData = weekSnap.docs.map((d) => d.data()).reverse();
    const daily = todaySnap.exists() ? todaySnap.data() : null;
    return {
      dailyMetrics: daily,
      weeklyData,
      wellnessScore: daily?.wellnessScore ?? 0,
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const logMetric = createAsyncThunk(
  'metrics/log',
  async ({ uid, data }, { rejectWithValue, getState }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const date = new Date().toISOString().split('T')[0];
      const entry = { ...data, date, updatedAt: Date.now() };
      await setDoc(doc(db, 'users', uid, 'metrics', date), entry, { merge: true });

      // Publish public health snapshot so the community leaderboard stays current
      const state = getState();
      const profile = state.user?.profile;
      const existing = state.metrics?.dailyMetrics || {};
      await setDoc(
        doc(db, 'user_status', uid),
        {
          uid,
          displayName: profile?.nickname || profile?.displayName || 'Kullanıcı',
          avatarEmoji: profile?.avatarEmoji || '🧘',
          avatarBg: profile?.avatarBg || '#0072B0',
          wellnessScore: entry.wellnessScore ?? existing.wellnessScore ?? 0,
          steps: entry.steps ?? existing.steps ?? 0,
          sleep: entry.sleep?.hours ?? existing.sleep?.hours ?? 0,
          heartRate: entry.heartRate ?? existing.heartRate ?? 0,
          calories: entry.calories ?? existing.calories ?? 0,
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      return entry;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const metricsSlice = createSlice({
  name: 'metrics',
  initialState: {
    dailyMetrics: null,
    weeklyData: [],
    wellnessScore: 0,
    selectedPeriod: 'week',
    loading: false,
    error: null,
  },
  reducers: {
    setPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyMetrics = action.payload.dailyMetrics;
        state.weeklyData = action.payload.weeklyData;
        state.wellnessScore = action.payload.wellnessScore;
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logMetric.fulfilled, (state, action) => {
        state.dailyMetrics = { ...state.dailyMetrics, ...action.payload };
        state.wellnessScore = action.payload.wellnessScore ?? state.wellnessScore;
      });
  },
});

export const { setPeriod } = metricsSlice.actions;
export default metricsSlice.reducer;
