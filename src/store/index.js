import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import talksReducer from './slices/talksSlice';
import metricsReducer from './slices/metricsSlice';

// Wrap localStorage with async interface for redux-persist compatibility
const createAsyncStorage = () => ({
  getItem: (key) =>
    Promise.resolve(typeof window !== 'undefined' ? localStorage.getItem(key) : null),
  setItem: (key, value) =>
    Promise.resolve(typeof window !== 'undefined' && localStorage.setItem(key, value)),
  removeItem: (key) =>
    Promise.resolve(typeof window !== 'undefined' && localStorage.removeItem(key)),
});

const storage = typeof window !== 'undefined' ? createAsyncStorage() : AsyncStorage;

const persistConfig = {
  key: 'root',
  storage,
  // Only persist auth and user — talks/metrics are re-fetched on mount
  whitelist: ['auth', 'user'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  talks: talksReducer,
  metrics: metricsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
