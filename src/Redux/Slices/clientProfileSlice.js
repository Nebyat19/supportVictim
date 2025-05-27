import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from "../../Utils/api"

// Async thunk to complete support profile
export const completeClientProfile = createAsyncThunk(
  'supportProfile/complete',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ API_URL}/profile/client`, formData, {
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

const clientProfileSlice = createSlice({
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
      .addCase(completeClientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(completeClientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.successMessage = action.payload.message;
      })
      .addCase(completeClientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.payload?.message || 'Failed to complete profile';
      });
  },
});

export const { clearClientProfileState } = clientProfileSlice.actions;

export default clientProfileSlice.reducer;
