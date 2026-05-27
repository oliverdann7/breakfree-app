import communityReducer, {
  realtimePostsUpdate,
  realtimeCommentsUpdate,
} from '../store/slices/communitySlice';

const initialState = {
  posts: [],
  commentsByPost: {},
  loading: false,
  postingComment: false,
  error: null,
};

describe('communitySlice', () => {
  it('returns initial state', () => {
    const state = communityReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('handles realtimePostsUpdate', () => {
    const posts = [
      { postId: 'p1', text: 'Hello', likes: 5 },
      { postId: 'p2', text: 'World', likes: 3 },
    ];
    const state = communityReducer(initialState, realtimePostsUpdate(posts));
    expect(state.posts).toHaveLength(2);
    expect(state.posts[0].postId).toBe('p1');
  });

  it('handles realtimeCommentsUpdate', () => {
    const state = communityReducer(
      initialState,
      realtimeCommentsUpdate({ postId: 'p1', comments: [{ commentId: 'c1', text: 'Nice' }] })
    );
    expect(state.commentsByPost.p1).toHaveLength(1);
    expect(state.commentsByPost.p1[0].text).toBe('Nice');
  });

  it('handles fetchPosts.pending', () => {
    const state = communityReducer(initialState, { type: 'community/fetchPosts/pending' });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles fetchPosts.fulfilled', () => {
    const payload = [
      { postId: 'p1', text: 'Post 1', liked: false, likes: 10 },
      { postId: 'p2', text: 'Post 2', liked: true, likes: 7 },
    ];
    const state = communityReducer(initialState, {
      type: 'community/fetchPosts/fulfilled',
      payload,
    });
    expect(state.loading).toBe(false);
    expect(state.posts).toHaveLength(2);
    expect(state.posts[1].liked).toBe(true);
  });

  it('handles fetchPosts.fulfilled with empty array', () => {
    const state = communityReducer(initialState, {
      type: 'community/fetchPosts/fulfilled',
      payload: [],
    });
    expect(state.posts).toEqual([]);
  });

  it('handles fetchPosts.rejected', () => {
    const state = communityReducer(initialState, {
      type: 'community/fetchPosts/rejected',
      payload: 'Error fetching posts',
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error fetching posts');
  });

  it('handles createPost.fulfilled', () => {
    const newPost = { postId: 'p3', text: 'New post', liked: false, likes: 0 };
    const state = communityReducer(initialState, {
      type: 'community/createPost/fulfilled',
      payload: newPost,
    });
    expect(state.posts).toHaveLength(1);
    expect(state.posts[0].text).toBe('New post');
  });

  it('handles toggleLike.fulfilled from unliked to liked', () => {
    const existing = {
      ...initialState,
      posts: [{ postId: 'p1', text: 'Post', liked: false, likes: 10 }],
    };
    const state = communityReducer(existing, {
      type: 'community/toggleLike/fulfilled',
      payload: { postId: 'p1', liked: true, delta: 1 },
    });
    expect(state.posts[0].liked).toBe(true);
    expect(state.posts[0].likes).toBe(11);
  });

  it('handles toggleLike.fulfilled from liked to unliked', () => {
    const existing = {
      ...initialState,
      posts: [{ postId: 'p1', text: 'Post', liked: true, likes: 15 }],
    };
    const state = communityReducer(existing, {
      type: 'community/toggleLike/fulfilled',
      payload: { postId: 'p1', liked: false, delta: -1 },
    });
    expect(state.posts[0].liked).toBe(false);
    expect(state.posts[0].likes).toBe(14);
  });

  it('handles fetchComments.fulfilled', () => {
    const payload = {
      postId: 'p1',
      comments: [{ commentId: 'c1', text: 'Great!' }],
    };
    const state = communityReducer(initialState, {
      type: 'community/fetchComments/fulfilled',
      payload,
    });
    expect(state.commentsByPost.p1).toHaveLength(1);
    expect(state.commentsByPost.p1[0].text).toBe('Great!');
  });

  it('handles addComment.pending', () => {
    const state = communityReducer(initialState, {
      type: 'community/addComment/pending',
    });
    expect(state.postingComment).toBe(true);
  });

  it('handles addComment.fulfilled', () => {
    const existing = {
      ...initialState,
      commentsByPost: { p1: [] },
    };
    const payload = {
      postId: 'p1',
      comment: { commentId: 'c1', text: 'Nice post!' },
    };
    const state = communityReducer(existing, {
      type: 'community/addComment/fulfilled',
      payload,
    });
    expect(state.postingComment).toBe(false);
    expect(state.commentsByPost.p1).toHaveLength(1);
    expect(state.commentsByPost.p1[0].text).toBe('Nice post!');
  });

  it('handles addComment.fulfilled initializes comments array if missing', () => {
    const payload = {
      postId: 'p2',
      comment: { commentId: 'c2', text: 'First comment' },
    };
    const state = communityReducer(initialState, {
      type: 'community/addComment/fulfilled',
      payload,
    });
    expect(state.commentsByPost.p2).toHaveLength(1);
  });

  it('handles addComment.rejected', () => {
    const state = communityReducer(initialState, {
      type: 'community/addComment/rejected',
    });
    expect(state.postingComment).toBe(false);
  });
});
