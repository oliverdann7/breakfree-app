import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

export const fetchActiveChallenges = createAsyncThunk(
  'challenges/fetchActive',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db) return { challenges: [], participation: {} };
      const now = Date.now();
      const q = query(collection(db, 'challenges'), where('endDate', '>=', now));
      const snap = await getDocs(q);
      const challenges = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      const participation = {};
      if (uid && challenges.length > 0) {
        await Promise.all(
          challenges.map(async (c) => {
            const pSnap = await getDoc(doc(db, 'challenge_participants', `${c.id}_${uid}`));
            if (pSnap.exists()) participation[c.id] = pSnap.data();
          })
        );
      }
      return { challenges, participation };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinChallenge = createAsyncThunk(
  'challenges/join',
  async ({ challengeId, uid }, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      await setDoc(doc(db, 'challenge_participants', `${challengeId}_${uid}`), {
        uid,
        challengeId,
        joinedAt: Date.now(),
        currentProgress: 0,
        completed: false,
      });
      await updateDoc(doc(db, 'challenges', challengeId), {
        participantCount: increment(1),
      });
      return challengeId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const challengesSlice = createSlice({
  name: 'challenges',
  initialState: {
    challenges: [],
    userParticipation: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload.challenges;
        state.userParticipation = action.payload.participation;
      })
      .addCase(fetchActiveChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(joinChallenge.fulfilled, (state, action) => {
        const challengeId = action.payload;
        const challenge = state.challenges.find((c) => c.id === challengeId);
        if (challenge) challenge.participantCount = (challenge.participantCount || 0) + 1;
        state.userParticipation[challengeId] = {
          joinedAt: Date.now(),
          currentProgress: 0,
          completed: false,
        };
      });
  },
});

export default challengesSlice.reducer;
