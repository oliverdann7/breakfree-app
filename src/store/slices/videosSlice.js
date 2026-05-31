import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, getDoc, query, orderBy, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const MOCK_VIDEOS = [
  {
    videoId: 'v1',
    title: 'Anksiyeteyi Yenmek: Bilimsel Yaklaşım',
    description: 'Dr. Ayşe Demir ile günlük anksiyete yönetimi üzerine kapsamlı bir rehber.',
    hostName: 'Dr. Ayşe Demir',
    category: 'Zihin',
    muxPlaybackId: null,
    durationSeconds: 1842,
    publishedAt: Date.now() - 86400000 * 3,
    tags: ['anksiyete', 'stres', 'zihin'],
  },
  {
    videoId: 'v2',
    title: 'Sabah Rutini: Enerjik Başlangıç',
    description: 'Güne mükemmel başlamanı sağlayacak 7 adımlı sabah rutini.',
    hostName: 'Burak Yılmaz',
    category: 'Sağlık',
    muxPlaybackId: null,
    durationSeconds: 1260,
    publishedAt: Date.now() - 86400000 * 7,
    tags: ['sabah', 'rutin', 'enerji'],
  },
  {
    videoId: 'v3',
    title: 'Meditasyon Temelleri',
    description: 'Yeni başlayanlar için adım adım meditasyon rehberi.',
    hostName: 'Selin Arslan',
    category: 'Zihin',
    muxPlaybackId: null,
    durationSeconds: 2100,
    publishedAt: Date.now() - 86400000 * 14,
    tags: ['meditasyon', 'mindfulness', 'nefes'],
  },
  {
    videoId: 'v4',
    title: 'Beslenme ve Enerji Yönetimi',
    description: 'Doğru beslenmeyle gün boyu enerjik kalmanın bilimsel sırları.',
    hostName: 'Prof. Mert Kaya',
    category: 'Beslenme',
    muxPlaybackId: null,
    durationSeconds: 2760,
    publishedAt: Date.now() - 86400000 * 21,
    tags: ['beslenme', 'enerji', 'sağlık'],
  },
];

// Dev-only seed: lets the feed render before the real `videos` collection is
// populated. In production an unconfigured/empty backend yields [] so the screen
// shows a genuine empty state instead of fake content masquerading as real.
const seedVideos = () => (__DEV__ ? MOCK_VIDEOS : []);

export const fetchVideos = createAsyncThunk('videos/fetchAll', async (_, { rejectWithValue }) => {
  try {
    if (!db) return seedVideos();
    const q = query(collection(db, 'videos'), orderBy('publishedAt', 'desc'));
    const snap = await getDocs(q);
    if (snap.empty) return seedVideos();
    return snap.docs.map((d) => ({ videoId: d.id, ...d.data() }));
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchVideoById = createAsyncThunk(
  'videos/fetchById',
  async (videoId, { rejectWithValue }) => {
    try {
      if (!db) return seedVideos().find((v) => v.videoId === videoId) || null;
      const snap = await getDoc(doc(db, 'videos', videoId));
      if (!snap.exists()) throw new Error('Video not found');
      return { videoId: snap.id, ...snap.data() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveWatchProgress = createAsyncThunk(
  'videos/saveProgress',
  async ({ uid, videoId, progressSeconds, durationSeconds }, { rejectWithValue }) => {
    try {
      if (!db || !uid) return null;
      const ref = doc(db, 'users', uid, 'watched_videos', videoId);
      await setDoc(
        ref,
        { progressSeconds, durationSeconds, watchedAt: Date.now() },
        { merge: true }
      );
      return { videoId, progressSeconds };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const videosSlice = createSlice({
  name: 'videos',
  initialState: {
    allVideos: [],
    currentVideo: null,
    progress: {},
    loading: false,
    error: null,
    activeCategory: 'Tümü',
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    updateLocalProgress: (state, action) => {
      const { videoId, progressSeconds } = action.payload;
      state.progress[videoId] = progressSeconds;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.allVideos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.currentVideo = action.payload;
      })
      .addCase(saveWatchProgress.fulfilled, (state, action) => {
        if (action.payload) {
          state.progress[action.payload.videoId] = action.payload.progressSeconds;
        }
      });
  },
});

export const { setActiveCategory, clearCurrentVideo, updateLocalProgress } = videosSlice.actions;
export default videosSlice.reducer;
