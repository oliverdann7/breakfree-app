import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  orderBy,
  limit,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

// One list "page". The realtime listener in TalksListScreen grows its limit by
// this each time the user nears the end, mirroring the community feed pattern,
// so the query never loads the whole collection at once.
export const TALKS_PAGE_SIZE = 20;

export const fetchTalks = createAsyncThunk('talks/fetchAll', async (arg, { rejectWithValue }) => {
  const pageSize = (arg && arg.pageSize) || TALKS_PAGE_SIZE;
  try {
    if (!db) return { talks: [], hasMore: false };
    const q = query(collection(db, 'talks'), orderBy('scheduledAt', 'desc'), limit(pageSize));
    const snap = await getDocs(q);
    const talks = snap.docs.map((d) => ({ talkId: d.id, ...d.data() }));
    // A full page back means there may be older talks beyond this window.
    return { talks, hasMore: snap.docs.length >= pageSize };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchTalkById = createAsyncThunk(
  'talks/fetchById',
  async (talkId, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const snap = await getDoc(doc(db, 'talks', talkId));
      if (!snap.exists()) throw new Error('Talk not found');
      return { talkId: snap.id, ...snap.data() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const seedTalks = createAsyncThunk('talks/seed', async (_, { rejectWithValue }) => {
  try {
    if (!db) return [];
    // Never seed on top of existing data — a double click (or two devices)
    // used to write the sample talks again, duplicating every list item.
    const existing = await getDocs(query(collection(db, 'talks'), limit(1)));
    if (!existing.empty) return [];
    const sample = [
      {
        title: 'Anksiyeteyi Anlamak',
        description: 'Dr. Ayşe Demir, günlük hayatta anksiyeteyle başa çıkma yollarını anlatıyor.',
        host: { uid: 'host1', name: 'Dr. Ayşe Demir', avatar: null },
        category: 'Zihin',
        status: 'scheduled',
        scheduledAt: Date.now() + 3600000,
        duration: 30,
        imageUrl: null,
        listeners: 0,
      },
      {
        title: 'Sabah Rutininin Gücü',
        description:
          'Sağlıklı bir sabah rutini nasıl oluşturulur? Uzmanımız tüm sırları paylaşıyor.',
        host: { uid: 'host2', name: 'Burak Yılmaz', avatar: null },
        category: 'Sağlık',
        status: 'live',
        scheduledAt: Date.now() - 600000,
        duration: 45,
        imageUrl: null,
        listeners: 24,
      },
      {
        title: 'Koşu ile Meditasyon',
        description:
          "Hareket ve zihin sağlığını birleştiren bu talk'ta koşuyu meditasyona dönüştürün.",
        host: { uid: 'host3', name: 'Selin Arslan', avatar: null },
        category: 'Hareket',
        status: 'ended',
        scheduledAt: Date.now() - 7200000,
        duration: 60,
        imageUrl: null,
        listeners: 112,
      },
      {
        title: 'Beslenme ve Enerji',
        description: 'Doğru beslenme ile gün boyu enerjik kalmanın bilimsel yolu.',
        host: { uid: 'host4', name: 'Prof. Mert Kaya', avatar: null },
        category: 'Beslenme',
        status: 'scheduled',
        scheduledAt: Date.now() + 86400000,
        duration: 50,
        imageUrl: null,
        listeners: 0,
      },
    ];
    const ids = [];
    for (const talk of sample) {
      const ref = await addDoc(collection(db, 'talks'), talk);
      ids.push(ref.id);
    }
    return ids;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const joinTalk = createAsyncThunk('talks/join', async (talkId, { rejectWithValue }) => {
  try {
    if (!db) throw new Error('Firebase not configured');
    await updateDoc(doc(db, 'talks', talkId), { listeners: increment(1) });
    return talkId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const talksSlice = createSlice({
  name: 'talks',
  initialState: {
    allTalks: [],
    currentTalk: null,
    loading: false,
    loadingMoreTalks: false,
    hasMoreTalks: true,
    error: null,
    filter: 'all',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearCurrentTalk: (state) => {
      state.currentTalk = null;
    },
    realtimeTalksUpdate: (state, action) => {
      // Accept a bare array (legacy) or { talks, hasMore } from the paginated
      // realtime listener. A fresh snapshot always ends an in-flight load-more.
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.allTalks = payload;
      } else {
        state.allTalks = payload.talks;
        if (typeof payload.hasMore === 'boolean') state.hasMoreTalks = payload.hasMore;
      }
      state.loadingMoreTalks = false;
    },
    requestMoreTalks: (state) => {
      state.loadingMoreTalks = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTalks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTalks.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMoreTalks = false;
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.allTalks = payload;
        } else {
          state.allTalks = payload.talks;
          if (typeof payload.hasMore === 'boolean') state.hasMoreTalks = payload.hasMore;
        }
      })
      .addCase(fetchTalks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTalkById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTalkById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTalk = action.payload;
      })
      .addCase(fetchTalkById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(seedTalks.fulfilled, (state) => {
        state.seeded = true;
      })
      .addCase(joinTalk.fulfilled, (state, action) => {
        const t = state.allTalks.find((t) => t.talkId === action.payload);
        if (t) t.listeners += 1;
        if (state.currentTalk?.talkId === action.payload) {
          state.currentTalk.listeners += 1;
        }
      });
  },
});

export const { setFilter, clearCurrentTalk, realtimeTalksUpdate, requestMoreTalks } =
  talksSlice.actions;
export default talksSlice.reducer;
