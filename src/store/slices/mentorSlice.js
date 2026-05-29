import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  addDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

export const DEFAULT_MENTOR_ID = 'dr-ayse-demir';

export const seedMentorProfile = createAsyncThunk(
  'mentor/seedProfile',
  async (_, { rejectWithValue }) => {
    try {
      if (!db) return rejectWithValue('Firebase not configured');
      const ref = doc(db, 'mentors', DEFAULT_MENTOR_ID);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          name: 'Dr. Ayşe Demir',
          title: 'Klinik Psikolog',
          role: 'Wellness · 8 yıl deneyim',
          bio: 'Dr. Ayşe Demir, bütüncül sağlık yaklaşımı ile danışanlarına zihinsel ve fiziksel iyilik halinde rehberlik eden deneyimli bir klinik psikologdur.',
          experience: '8 yıl',
          avatarEmoji: '🌿',
          avatarBg: '#C9961A',
          specialties: ['Anksiyete Yönetimi', 'Uyku Terapisi', 'Farkındalık', 'Stres Azaltma'],
          createdAt: Date.now(),
        });
      }
      return DEFAULT_MENTOR_ID;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMentorAssignment = createAsyncThunk(
  'mentor/fetchAssignment',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db) return null;
      const assignmentRef = doc(db, 'mentor_assignments', uid);
      const assignmentSnap = await getDoc(assignmentRef);

      if (assignmentSnap.exists()) {
        return { id: assignmentSnap.id, ...assignmentSnap.data() };
      }

      const mentorId = DEFAULT_MENTOR_ID;
      const defaultGoals = [
        { text: "22:00'da ekranları kapat", done: false },
        { text: '10dk akşam meditasyonu', done: false },
        { text: 'Günlük journal — 3 minnet', done: false },
        { text: 'Hafif yoga · 15dk', done: false },
      ];
      const now = new Date();
      const nextMonday = new Date(now);
      nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));

      const assignment = {
        uid,
        mentorId,
        focusTitle: 'Akşam rutini ve uyku kalitesi',
        goals: defaultGoals,
        nextSession: {
          day: nextMonday.toLocaleDateString('tr-TR', { weekday: 'short' }),
          date: nextMonday.getDate(),
          title: 'Görüntülü görüşme',
          time: '19:00',
          duration: '30dk',
        },
        createdAt: Date.now(),
      };

      await setDoc(assignmentRef, assignment);
      return { id: uid, ...assignment };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllMentors = createAsyncThunk(
  'mentor/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      if (!db) return [];
      const snap = await getDocs(collection(db, 'mentors'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMentorProfile = createAsyncThunk(
  'mentor/fetchProfile',
  async (mentorId, { rejectWithValue }) => {
    try {
      if (!db) return null;
      const snap = await getDoc(doc(db, 'mentors', mentorId));
      if (!snap.exists()) throw new Error('Mentor not found');
      return { id: snap.id, ...snap.data() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLatestMessage = createAsyncThunk(
  'mentor/fetchLatestMessage',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db) return null;
      const q = query(
        collection(db, 'mentor_assignments', uid, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const msg = { id: snap.docs[0].id, ...snap.docs[0].data() };
      return {
        text: msg.text,
        sender: msg.sender,
        createdAt: msg.createdAt,
        timeAgo: getTimeAgo(msg.createdAt),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'mentor/sendMessage',
  async ({ uid, text }, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const msg = {
        text,
        sender: 'user',
        createdAt: Date.now(),
      };
      const ref = await addDoc(collection(db, 'mentor_assignments', uid, 'messages'), msg);
      return { id: ref.id, ...msg, timeAgo: 'Az önce' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleGoal = createAsyncThunk(
  'mentor/toggleGoal',
  async ({ uid, goalIndex }, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const ref = doc(db, 'mentor_assignments', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) throw new Error('Assignment not found');
      const data = snap.data();
      const goals = [...data.goals];
      goals[goalIndex] = { ...goals[goalIndex], done: !goals[goalIndex].done };
      await updateDoc(ref, { goals });
      return { goalIndex, goals };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

function getTimeAgo(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Az önce';
  if (mins < 60) return `${mins}dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}sa önce`;
  const days = Math.floor(hours / 24);
  return `${days}g önce`;
}

const mentorSlice = createSlice({
  name: 'mentor',
  initialState: {
    assignment: null,
    mentorProfile: null,
    allMentors: [],
    latestMessage: null,
    messages: [],
    goals: [],
    focusTitle: '',
    nextSession: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentorAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentorAssignment.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.assignment = action.payload;
          state.goals = action.payload.goals || [];
          state.focusTitle = action.payload.focusTitle || '';
          state.nextSession = action.payload.nextSession || null;
        }
      })
      .addCase(fetchMentorAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMentorProfile.fulfilled, (state, action) => {
        state.mentorProfile = action.payload;
      })
      .addCase(fetchAllMentors.fulfilled, (state, action) => {
        state.allMentors = action.payload;
      })
      .addCase(fetchLatestMessage.fulfilled, (state, action) => {
        state.latestMessage = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
        state.latestMessage = action.payload;
      })
      .addCase(toggleGoal.fulfilled, (state, action) => {
        const { goals } = action.payload;
        state.goals = goals;
        if (state.assignment) {
          state.assignment.goals = goals;
        }
      });
  },
});

export default mentorSlice.reducer;
