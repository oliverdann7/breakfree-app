import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { isEnabled } from '../../constants/featureFlags';
import { logout } from './authSlice';

// Each video declares a provider-agnostic `source` + `sourceId` (see
// utils/videoSource.js). `isPremium` gates playback behind a Pro subscription.
// The YouTube entry doubles as a free taste; the rest are Pro-only.
const MOCK_VIDEOS = [
  {
    videoId: 'v1',
    title: 'Anksiyeteyi Yenmek: Bilimsel Yaklaşım',
    description: 'Dr. Ayşe Demir ile günlük anksiyete yönetimi üzerine kapsamlı bir rehber.',
    hostName: 'Dr. Ayşe Demir',
    category: 'Zihin',
    source: 'youtube',
    sourceId: 'inpok4MKVLM',
    durationSeconds: 1842,
    publishedAt: Date.now() - 86400000 * 3,
    isPremium: false,
    tags: ['anksiyete', 'stres', 'zihin'],
  },
  {
    videoId: 'v2',
    title: 'Sabah Rutini: Enerjik Başlangıç',
    description: 'Güne mükemmel başlamanı sağlayacak 7 adımlı sabah rutini.',
    hostName: 'Burak Yılmaz',
    category: 'Sağlık',
    source: 'youtube',
    sourceId: 'ZToicYcHIOU',
    durationSeconds: 1260,
    publishedAt: Date.now() - 86400000 * 7,
    isPremium: true,
    tags: ['sabah', 'rutin', 'enerji'],
  },
  {
    videoId: 'v3',
    title: 'Meditasyon Temelleri',
    description: 'Yeni başlayanlar için adım adım meditasyon rehberi.',
    hostName: 'Selin Arslan',
    category: 'Zihin',
    source: 'mux',
    sourceId: null,
    durationSeconds: 2100,
    publishedAt: Date.now() - 86400000 * 14,
    isPremium: true,
    tags: ['meditasyon', 'mindfulness', 'nefes'],
  },
  {
    videoId: 'v4',
    title: 'Beslenme ve Enerji Yönetimi',
    description: 'Doğru beslenmeyle gün boyu enerjik kalmanın bilimsel sırları.',
    hostName: 'Prof. Mert Kaya',
    category: 'Beslenme',
    source: 'mux',
    sourceId: null,
    durationSeconds: 2760,
    publishedAt: Date.now() - 86400000 * 21,
    isPremium: true,
    tags: ['beslenme', 'enerji', 'sağlık'],
  },
];

// Dev-only seed: lets the feed render before the real `videos` collection is
// populated. In production an unconfigured/empty backend yields [] so the screen
// shows a genuine empty state instead of fake content masquerading as real.
const seedVideos = () => (__DEV__ ? MOCK_VIDEOS : []);

// One grid "page". VideoFeedScreen grows its window by this each time the user
// nears the end of the grid (same windowed pattern as the community feed).
export const VIDEOS_PAGE_SIZE = 20;

export const fetchVideos = createAsyncThunk('videos/fetchAll', async (arg, { rejectWithValue }) => {
  const pageSize = (arg && arg.pageSize) || VIDEOS_PAGE_SIZE;
  try {
    if (!db) return { videos: seedVideos(), hasMore: false };
    const q = query(collection(db, 'videos'), orderBy('publishedAt', 'desc'), limit(pageSize));
    const snap = await getDocs(q);
    if (snap.empty) return { videos: seedVideos(), hasMore: false };
    const videos = snap.docs.map((d) => ({ videoId: d.id, ...d.data() }));
    // A full page back means there may be older videos beyond this window.
    return { videos, hasMore: snap.docs.length >= pageSize };
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

// Restores the progress map written by saveWatchProgress. Without this the
// map only lives in memory, so resume positions and the feed's progress bars
// were lost on every cold start (roadmap §1.3).
export const fetchWatchProgress = createAsyncThunk(
  'videos/fetchProgress',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db || !uid) return {};
      const snap = await getDocs(collection(db, 'users', uid, 'watched_videos'));
      const progress = {};
      snap.forEach((d) => {
        const seconds = d.data()?.progressSeconds;
        if (typeof seconds === 'number' && seconds >= 0) progress[d.id] = seconds;
      });
      return progress;
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
    // Whose progress the map holds — guards against one account's in-memory
    // values bleeding into another's after a sign-out/sign-in.
    progressUid: null,
    loading: false,
    loadingMoreVideos: false,
    hasMoreVideos: true,
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
    requestMoreVideos: (state) => {
      state.loadingMoreVideos = true;
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
        state.loadingMoreVideos = false;
        // Accept a bare array (legacy) or { videos, hasMore } from the
        // windowed fetch.
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.allVideos = payload;
        } else {
          state.allVideos = payload.videos;
          if (typeof payload.hasMore === 'boolean') state.hasMoreVideos = payload.hasMore;
        }
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.loadingMoreVideos = false;
        state.error = action.payload;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.currentVideo = action.payload;
      })
      .addCase(saveWatchProgress.fulfilled, (state, action) => {
        if (action.payload) {
          state.progress[action.payload.videoId] = action.payload.progressSeconds;
        }
      })
      .addCase(fetchWatchProgress.fulfilled, (state, action) => {
        const uid = action.meta?.arg;
        if (state.progressUid && uid && state.progressUid !== uid) {
          // Different account: the in-memory values belong to the previous
          // user — replace them wholesale with this user's snapshot.
          state.progress = action.payload;
        } else {
          // Same account: in-session values are fresher than the snapshot.
          state.progress = { ...action.payload, ...state.progress };
        }
        if (uid) state.progressUid = uid;
      })
      // Signing out drops the map so the next account never sees (or saves
      // over) the previous account's positions.
      .addCase(logout.fulfilled, (state) => {
        state.progress = {};
        state.progressUid = null;
      });
  },
});

export const { setActiveCategory, clearCurrentVideo, updateLocalProgress, requestMoreVideos } =
  videosSlice.actions;

// A video requires Pro unless it's explicitly free (`isPremium === false`).
// Default-locked is intentional: legacy/new docs without the flag stay gated.
// While the store IAP flow isn't live (featureFlags.premiumSubscription off),
// nothing is locked — shipping a paywall whose purchase can't complete is an
// App Store rejection (Guideline 2.1 / 3.1.1).
export const isVideoLocked = (video, isPremium) =>
  isEnabled('premiumSubscription') && video?.isPremium !== false && !isPremium;

export default videosSlice.reducer;
