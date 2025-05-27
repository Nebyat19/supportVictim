import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for submitting a report
export const submitSupporterReport = createAsyncThunk(
  'reportOnSupporter/submitReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/supporters/report', reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  reportStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const reportOnSupporterSlice = createSlice({
  name: 'reportOnSupporter',
  initialState,
  reducers: {
    resetReportState: (state) => {
      state.reportStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSupporterReport.pending, (state) => {
        state.reportStatus = 'loading';
        state.error = null;
      })
      .addCase(submitSupporterReport.fulfilled, (state) => {
        state.reportStatus = 'succeeded';
      })
      .addCase(submitSupporterReport.rejected, (state, action) => {
        state.reportStatus = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetReportState } = reportOnSupporterSlice.actions;
export default reportOnSupporterSlice.reducer;