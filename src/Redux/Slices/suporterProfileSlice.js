import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from "../../Utils/api"

// Async thunk to complete support profile
export const completeSupportProfile = createAsyncThunk(
  'supportProfile/complete',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ API_URL}/profile/support`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Something went wrong' });
    }
  }
);

const supportProfileSlice = createSlice({
  name: 'supportProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSupportProfileState: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeSupportProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(completeSupportProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.successMessage = action.payload.message;
      })
      .addCase(completeSupportProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.payload?.message || 'Failed to complete profile';
      });
  },
});

export const { clearSupportProfileState } = supportProfileSlice.actions;

export default supportProfileSlice.reducer;
