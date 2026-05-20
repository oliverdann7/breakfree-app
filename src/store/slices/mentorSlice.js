import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const fetchMentorData = createAsyncThunk(
  'mentor/fetchData',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db || !uid) return null;

      const userSnap = await getDoc(doc(db, 'users', uid));
      const userData = userSnap.data() || {};
      const mentorId = userData.assignedMentorId;

      let mentor = null;
      if (mentorId) {
        const mentorSnap = await getDoc(doc(db, 'mentors', mentorId));
        if (mentorSnap.exists()) mentor = { mentorId, ...mentorSnap.data() };
      }

      // Next upcoming session
      const sessionsQ = query(
        collection(db, 'users', uid, 'sessions'),
        where('scheduledAt', '>', Date.now()),
        orderBy('scheduledAt', 'asc'),
        limit(1)
      );
      const sessionsSnap = await getDocs(sessionsQ);
      const nextSession = sessionsSnap.empty ? null : sessionsSnap.docs[0].data();

      // Latest message
      const messagesQ = query(
        collection(db, 'users', uid, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const messagesSnap = await getDocs(messagesQ);
      const lastMessage = messagesSnap.empty ? null : messagesSnap.docs[0].data();

      return {
        mentor,
        weeklyFocus: userData.weeklyFocus || null,
        weeklyGoals: userData.weeklyGoals || [],
        nextSession,
        lastMessage,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const mentorSlice = createSlice({
  name: 'mentor',
  initialState: {
    mentor: null,
    weeklyFocus: null,
    weeklyGoals: [],
    nextSession: null,
    lastMessage: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentorData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentorData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.mentor = action.payload.mentor;
          state.weeklyFocus = action.payload.weeklyFocus;
          state.weeklyGoals = action.payload.weeklyGoals;
          state.nextSession = action.payload.nextSession;
          state.lastMessage = action.payload.lastMessage;
        }
      })
      .addCase(fetchMentorData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mentorSlice.reducer;
