import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const generateWeeklyData = () => {
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  return days.map((day) => ({
    day,
    sleep: parseFloat((6 + Math.random() * 3).toFixed(1)),
    steps: Math.floor(4000 + Math.random() * 8000),
    heartRate: Math.floor(58 + Math.random() * 20),
    calories: Math.floor(1400 + Math.random() * 800),
    wellnessScore: Math.floor(55 + Math.random() * 40),
  }));
};

export const fetchMetrics = createAsyncThunk(
  'metrics/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const weeklyData = generateWeeklyData();
      const today = weeklyData[weeklyData.length - 1];
      return {
        dailyMetrics: {
          date: new Date().toISOString().split('T')[0],
          sleep: { hours: today.sleep, quality: today.sleep >= 7 ? 'İyi' : 'Orta' },
          heartRate: today.heartRate,
          steps: today.steps,
          calories: today.calories,
        },
        weeklyData,
        wellnessScore: today.wellnessScore,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const metricsSlice = createSlice({
  name: 'metrics',
  initialState: {
    dailyMetrics: null,
    weeklyData: [],
    wellnessScore: 0,
    selectedPeriod: 'week',
    loading: false,
    error: null,
  },
  reducers: {
    setPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyMetrics = action.payload.dailyMetrics;
        state.weeklyData = action.payload.weeklyData;
        state.wellnessScore = action.payload.wellnessScore;
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPeriod } = metricsSlice.actions;
export default metricsSlice.reducer;
