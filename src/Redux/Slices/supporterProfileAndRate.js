import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching supporter profile
export const fetchSupporterProfile = createAsyncThunk(
  'supporterProfile/fetchProfile',
  async (supporterId) => {
    try {
      const response = await axios.get(`/api/supporters/${supporterId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Async thunk for submitting a rating
export const submitRating = createAsyncThunk(
  'supporterProfile/submitRating',
  async ({ supporterId, rating, review }) => {
    try {
      const response = await axios.post(`/api/supporters/${supporterId}/rate`, {
        rating,
        review
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
  ratingSubmitted: false,
  ratingLoading: false,
  ratingError: null
};

const supporterProfileSlice = createSlice({
  name: 'supporterProfile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    clearRatingStatus: (state) => {
      state.ratingSubmitted = false;
      state.ratingError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch profile
      .addCase(fetchSupporterProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupporterProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchSupporterProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle submit rating
      .addCase(submitRating.pending, (state) => {
        state.ratingLoading = true;
        state.ratingError = null;
      })
      .addCase(submitRating.fulfilled, (state, action) => {
        state.ratingLoading = false;
        state.ratingSubmitted = true;
        // Update the profile's average rating and total reviews
        if (state.profile) {
          state.profile.averageRating = action.payload.newAverageRating;
          state.profile.totalReviews = action.payload.newTotalReviews;
        }
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.ratingLoading = false;
        state.ratingError = action.error.message;
      });
  }
});

export const { clearProfile, clearRatingStatus } = supporterProfileSlice.actions;
export default supporterProfileSlice.reducer;
