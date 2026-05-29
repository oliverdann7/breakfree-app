import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as healthService from '../../services/healthService';

export const connectSource = createAsyncThunk(
  'health/connect',
  async (sourceId, { rejectWithValue }) => {
    try {
      const result = await healthService.requestPermissions(sourceId);
      if (!result.granted) throw new Error('Permission denied');
      return sourceId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const disconnectSource = createAsyncThunk(
  'health/disconnect',
  async (sourceId, { rejectWithValue }) => {
    try {
      await healthService.disconnect(sourceId);
      return sourceId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncDaily = createAsyncThunk(
  'health/syncDaily',
  async (sourceId, { rejectWithValue }) => {
    try {
      const data = await healthService.getDailyMetrics(sourceId);
      return { sourceId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncWeekly = createAsyncThunk(
  'health/syncWeekly',
  async (sourceId, { rejectWithValue }) => {
    try {
      const data = await healthService.getWeeklyMetrics(sourceId);
      return { sourceId, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const healthSlice = createSlice({
  name: 'health',
  initialState: {
    connectedSources: [],
    daily: null,
    weekly: [],
    syncStatus: 'idle', // idle | syncing | synced | error
    lastSync: null,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectSource.fulfilled, (state, action) => {
        if (!state.connectedSources.includes(action.payload)) {
          state.connectedSources.push(action.payload);
        }
      })
      .addCase(disconnectSource.fulfilled, (state, action) => {
        state.connectedSources = state.connectedSources.filter((s) => s !== action.payload);
      })
      .addCase(syncDaily.pending, (state) => {
        state.syncStatus = 'syncing';
      })
      .addCase(syncDaily.fulfilled, (state, action) => {
        state.syncStatus = 'synced';
        state.daily = action.payload.data;
        state.lastSync = Date.now();
      })
      .addCase(syncDaily.rejected, (state, action) => {
        state.syncStatus = 'error';
        state.error = action.payload;
      })
      .addCase(syncWeekly.fulfilled, (state, action) => {
        state.weekly = action.payload.data;
        state.lastSync = Date.now();
      });
  },
});

export const { clearError } = healthSlice.actions;
export default healthSlice.reducer;
