import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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
    preferences: { language: 'tr', units: 'metric', notifications: true },
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
    clearUser: (state) => {
      state.uid = null;
      state.profile = null;
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
      });
  },
});

export const { updatePreferences, updateProfile, clearUser } = userSlice.actions;
export default userSlice.reducer;
