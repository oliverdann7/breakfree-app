import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const MOCK_TALKS = [
  {
    talkId: 'talk1',
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
    talkId: 'talk2',
    title: 'Sabah Rutininin Gücü',
    description: 'Sağlıklı bir sabah rutini nasıl oluşturulur? Uzmanımız tüm sırları paylaşıyor.',
    host: { uid: 'host2', name: 'Burak Yılmaz', avatar: null },
    category: 'Sağlık',
    status: 'live',
    scheduledAt: Date.now() - 600000,
    duration: 45,
    imageUrl: null,
    listeners: 24,
  },
  {
    talkId: 'talk3',
    title: 'Koşu ile Meditasyon',
    description: "Hareket ve zihin sağlığını birleştiren bu talk'ta koşuyu meditasyona dönüştürün.",
    host: { uid: 'host3', name: 'Selin Arslan', avatar: null },
    category: 'Hareket',
    status: 'ended',
    scheduledAt: Date.now() - 7200000,
    duration: 60,
    imageUrl: null,
    listeners: 112,
  },
  {
    talkId: 'talk4',
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

export const fetchTalks = createAsyncThunk('talks/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return MOCK_TALKS;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchTalkById = createAsyncThunk(
  'talks/fetchById',
  async (talkId, { rejectWithValue }) => {
    try {
      const talk = MOCK_TALKS.find((t) => t.talkId === talkId);
      if (!talk) throw new Error('Talk not found');
      return talk;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const talksSlice = createSlice({
  name: 'talks',
  initialState: {
    allTalks: [],
    currentTalk: null,
    listeners: [],
    messages: [],
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
      state.messages = [];
      state.listeners = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
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
      });
  },
});

export const { setFilter, clearCurrentTalk, addMessage } = talksSlice.actions;
export default talksSlice.reducer;
