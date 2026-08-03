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
import communityReducer from './slices/communitySlice';
import mentorReducer from './slices/mentorSlice';
import challengesReducer from './slices/challengesSlice';
import videosReducer from './slices/videosSlice';
import healthReducer from './slices/healthSlice';
import notificationsReducer from './slices/notificationsSlice';
import premiumReducer from './slices/premiumSlice';

// AsyncStorage works on every platform: native storage on iOS/Android and a
// localStorage-backed implementation on web (same keys as the old manual
// wrapper, so existing web sessions survive). A `typeof window` guard here
// would break native — React Native defines `global.window`.
const storage = AsyncStorage;

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
  community: communityReducer,
  mentor: mentorReducer,
  challenges: challengesReducer,
  videos: videosReducer,
  health: healthReducer,
  notifications: notificationsReducer,
  premium: premiumReducer,
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
