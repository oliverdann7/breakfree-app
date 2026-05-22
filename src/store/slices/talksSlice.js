import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  orderBy,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

export const fetchTalks = createAsyncThunk('talks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    if (!db) return [];
    const q = query(collection(db, 'talks'), orderBy('scheduledAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ talkId: d.id, ...d.data() }));
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTalks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTalks.fulfilled, (state, action) => {
        state.loading = false;
        state.allTalks = action.payload;
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

export const { setFilter, clearCurrentTalk } = talksSlice.actions;
export default talksSlice.reducer;
