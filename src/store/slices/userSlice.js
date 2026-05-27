import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const snap = await getDoc(doc(db, 'users', uid));
      if (!snap.exists()) throw new Error('Profile not found');
      return snap.data();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const GOAL_TASKS = {
  sleep: { title: 'Uyku Takibi', icon: '😴', duration: '5dk' },
  fitness: { title: '30dk Antrenman', icon: '💪', duration: '30dk' },
  mindfulness: { title: 'Meditasyon', icon: '🧘', duration: '10dk' },
  nutrition: { title: 'Su İçmeyi Takip Et', icon: '💧', duration: '1dk' },
  community: { title: 'Gönderi Paylaş', icon: '🤝', duration: '5dk' },
  stress: { title: 'Nefes Egzersizi', icon: '🌿', duration: '5dk' },
};

export const fetchDailyPlan = createAsyncThunk(
  'user/fetchDailyPlan',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const today = new Date().toISOString().split('T')[0];
      const planRef = doc(db, 'daily_plans', `${uid}_${today}`);
      const snap = await getDoc(planRef);
      if (snap.exists()) return snap.data();
      const profileSnap = await getDoc(doc(db, 'users', uid));
      const goals = profileSnap.exists() ? profileSnap.data().goals || [] : [];
      const tasks =
        goals.length > 0
          ? goals.map((g) => GOAL_TASKS[g]).filter(Boolean)
          : [GOAL_TASKS.mindfulness, GOAL_TASKS.fitness];
      const plan = {
        uid,
        date: today,
        tasks: tasks.map((t) => ({ ...t, done: false, time: null })),
      };
      await setDoc(planRef, plan);
      return plan;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeTask = createAsyncThunk(
  'user/completeTask',
  async ({ uid, taskIndex }, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const today = new Date().toISOString().split('T')[0];
      const planRef = doc(db, 'daily_plans', `${uid}_${today}`);
      const snap = await getDoc(planRef);
      if (!snap.exists()) throw new Error('No plan for today');
      const plan = snap.data();
      plan.tasks[taskIndex].done = true;
      plan.tasks[taskIndex].time = new Date().toISOString();
      await updateDoc(planRef, { tasks: plan.tasks });
      return { taskIndex, plan };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db) return { totalTalks: 0, streak: 0, points: 0 };
      const talksQ = query(collection(db, 'talks_participants'), where('uid', '==', uid));
      const talksSnap = await getDocs(talksQ);
      const totalTalks = talksSnap.size;
      const metricsQ = query(
        collection(db, 'daily_metrics'),
        where('uid', '==', uid),
        orderBy('date', 'desc'),
        limit(90)
      );
      const metricsSnap = await getDocs(metricsQ);
      const metrics = metricsSnap.docs.map((d) => d.data());
      let streak = 0;
      for (const m of metrics) {
        if (m.wellnessScore >= 50) streak++;
        else break;
      }
      const points = metrics.reduce((sum, m) => sum + (m.wellnessScore || 0), 0);
      return { totalTalks, streak, points };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfileFirestore = createAsyncThunk(
  'user/updateProfileFirestore',
  async ({ uid, ...data }, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: Date.now() });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: null,
    profile: null,
    hasCompletedOnboarding: false,
    preferences: { language: 'tr', units: 'metric', notifications: true },
    dailyPlan: null,
    stats: { totalTalks: 0, streak: 0, points: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setHasCompletedOnboarding: (state, action) => {
      state.hasCompletedOnboarding = action.payload;
    },
    clearUser: (state) => {
      state.uid = null;
      state.profile = null;
      state.hasCompletedOnboarding = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.uid = action.payload.uid;
        state.profile = action.payload;
        state.preferences = action.payload.preferences || state.preferences;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfileFirestore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileFirestore.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfileFirestore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDailyPlan.fulfilled, (state, action) => {
        state.dailyPlan = action.payload;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { updatePreferences, updateProfile, setHasCompletedOnboarding, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
