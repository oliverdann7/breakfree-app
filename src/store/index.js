import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import talksReducer from './slices/talksSlice';
import metricsReducer from './slices/metricsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    talks: talksReducer,
    metrics: metricsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
