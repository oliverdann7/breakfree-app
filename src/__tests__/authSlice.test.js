import authReducer, { clearError } from '../store/slices/authSlice';

const initialState = {
  isInitializing: true,
  isLoading: false,
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

describe('authSlice', () => {
  it('returns initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('handles clearError', () => {
    const errorState = { ...initialState, error: 'Something went wrong' };
    const state = authReducer(errorState, clearError());
    expect(state.error).toBeNull();
  });

  it('handles login.pending', () => {
    const state = authReducer(initialState, { type: 'auth/login/pending' });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles login.fulfilled', () => {
    const payload = { user: { uid: '789', email: 'a@b.com' }, token: 'abc123' };
    const state = authReducer(initialState, {
      type: 'auth/login/fulfilled',
      payload,
    });
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(payload.user);
    expect(state.token).toBe('abc123');
    expect(state.isAuthenticated).toBe(true);
  });

  it('handles login.rejected', () => {
    const state = authReducer(initialState, {
      type: 'auth/login/rejected',
      payload: 'Invalid credentials',
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Invalid credentials');
  });

  it('handles signup.pending/fulfilled', () => {
    const pendingState = authReducer(initialState, { type: 'auth/signup/pending' });
    expect(pendingState.isLoading).toBe(true);
    const payload = { user: { uid: '1', email: 'new@user.com' }, token: 'xyz' };
    const fulfilledState = authReducer(pendingState, {
      type: 'auth/signup/fulfilled',
      payload,
    });
    expect(fulfilledState.isLoading).toBe(false);
    expect(fulfilledState.isAuthenticated).toBe(true);
    expect(fulfilledState.user.uid).toBe('1');
  });

  it('handles logout.fulfilled', () => {
    const loggedIn = {
      ...initialState,
      user: { uid: '123' },
      token: 'tok',
      isAuthenticated: true,
    };
    const state = authReducer(loggedIn, { type: 'auth/logout/fulfilled' });
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('handles loginWithGoogle.fulfilled', () => {
    const payload = { user: { uid: 'google-uid' }, token: 'google-token' };
    const state = authReducer(initialState, {
      type: 'auth/loginWithGoogle/fulfilled',
      payload,
    });
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.uid).toBe('google-uid');
  });

  it('handles loginWithApple.fulfilled', () => {
    const payload = { user: { uid: 'apple-uid' }, token: 'apple-token' };
    const state = authReducer(initialState, {
      type: 'auth/loginWithApple/fulfilled',
      payload,
    });
    expect(state.isAuthenticated).toBe(true);
    expect(state.user.uid).toBe('apple-uid');
  });

  it('handles refreshToken.fulfilled', () => {
    const state = authReducer(initialState, {
      type: 'auth/refreshToken/fulfilled',
      payload: 'new-token',
    });
    expect(state.token).toBe('new-token');
  });
});
