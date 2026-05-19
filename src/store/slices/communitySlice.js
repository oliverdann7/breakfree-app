import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  limit,
  getDoc,
  increment,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

export const fetchPosts = createAsyncThunk(
  'community/fetchPosts',
  async (uid, { rejectWithValue }) => {
    try {
      if (!db) return [];
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
      const snap = await getDocs(q);
      const posts = await Promise.all(
        snap.docs.map(async (d) => {
          const post = { postId: d.id, ...d.data() };
          if (uid) {
            const likeSnap = await getDoc(doc(db, 'liked_posts', `${uid}_${d.id}`));
            post.liked = likeSnap.exists();
          } else {
            post.liked = false;
          }
          return post;
        })
      );
      return posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'community/createPost',
  async ({ uid, authorName, authorEmoji, authorBg, text, sharedStats }, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const data = {
        authorUid: uid,
        authorName,
        authorEmoji,
        authorBg,
        text,
        sharedStats: sharedStats || null,
        likes: 0,
        createdAt: Date.now(),
      };
      const ref = await addDoc(collection(db, 'posts'), data);
      return { postId: ref.id, ...data, liked: false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'community/toggleLike',
  async ({ postId, uid, currentlyLiked }, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const likeRef = doc(db, 'liked_posts', `${uid}_${postId}`);
      const postRef = doc(db, 'posts', postId);
      if (currentlyLiked) {
        await deleteDoc(likeRef);
        await updateDoc(postRef, { likes: increment(-1) });
      } else {
        await setDoc(likeRef, { uid, postId, createdAt: Date.now() });
        await updateDoc(postRef, { likes: increment(1) });
      }
      return { postId, liked: !currentlyLiked, delta: currentlyLiked ? -1 : 1 };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'community/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      if (!db) return { postId, comments: [] };
      const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
      const snap = await getDocs(q);
      return {
        postId,
        comments: snap.docs.map((d) => ({ commentId: d.id, ...d.data() })),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'community/addComment',
  async ({ postId, uid, authorName, authorEmoji, authorBg, text }, { rejectWithValue }) => {
    try {
      if (!db) throw new Error('Firebase not configured');
      const data = {
        authorUid: uid,
        authorName,
        authorEmoji,
        authorBg,
        text,
        createdAt: Date.now(),
      };
      const ref = await addDoc(collection(db, 'posts', postId, 'comments'), data);
      return { postId, comment: { commentId: ref.id, ...data } };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState: {
    posts: [],
    commentsByPost: {},
    loading: false,
    postingComment: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, liked, delta } = action.payload;
        const post = state.posts.find((p) => p.postId === postId);
        if (post) {
          post.liked = liked;
          post.likes = (post.likes || 0) + delta;
        }
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentsByPost[action.payload.postId] = action.payload.comments;
      })
      .addCase(addComment.pending, (state) => {
        state.postingComment = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.postingComment = false;
        const { postId, comment } = action.payload;
        if (!state.commentsByPost[postId]) state.commentsByPost[postId] = [];
        state.commentsByPost[postId].push(comment);
      })
      .addCase(addComment.rejected, (state) => {
        state.postingComment = false;
      });
  },
});

export default communitySlice.reducer;
