import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  query,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db || !uid) return [];
      const q = query(
        collection(db, 'users', uid, 'notifications'),
        orderBy('createdAt', 'desc'),
        firestoreLimit(50)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markRead = createAsyncThunk(
  'notifications/markRead',
  async ({ uid, id }, { rejectWithValue }) => {
    try {
      if (!db || !uid) throw new Error('Firebase not configured');
      await updateDoc(doc(db, 'users', uid, 'notifications', id), { read: true });
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllRead = createAsyncThunk(
  'notifications/markAllRead',
  async (uid, { getState, rejectWithValue }) => {
    try {
      if (!db || !uid) throw new Error('Firebase not configured');
      const { items } = getState().notifications;
      const unread = items.filter((n) => !n.read);
      if (unread.length === 0) return [];
      const batch = writeBatch(db);
      unread.forEach((n) => {
        batch.update(doc(db, 'users', uid, 'notifications', n.id), { read: true });
      });
      await batch.commit();
      return unread.map((n) => n.id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null,
    pushToken: null,
    permissionGranted: false,
  },
  reducers: {
    setPushToken: (state, action) => {
      state.pushToken = action.payload;
    },
    setPermission: (state, action) => {
      state.permissionGranted = action.payload;
    },
    pushLocal: (state, action) => {
      state.items.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const n = state.items.find((i) => i.id === action.payload);
        if (n && !n.read) {
          n.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { setPushToken, setPermission, pushLocal } = notificationsSlice.actions;
export default notificationsSlice.reducer;
