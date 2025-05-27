import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../Utils/api";

// Async thunk to submit a rating
export const submitRating = createAsyncThunk(
  "rate/submitRating",
  async ({ support_request_id, client_id, support_personnel_id, rating }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/support/rate/${support_request_id}`,
        {
          support_request_id,
          client_id,
          support_personnel_id,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit rating");
    }
  }
);

// Fetch supporter profile by ID
export const fetchSupporterProfile = createAsyncThunk(
  "rate/fetchSupporterProfile",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/support/volunteer/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data; // { volunteer, average_rating }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch supporter profile");
    }
  }
);

const rateSlice = createSlice({
  name: "rate",
  initialState: {
    loading: false,
    success: false,
    error: null,
    supporterProfile: null, // Add supporterProfile to state
  },
  reducers: {
    clearRateState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.supporterProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitRating.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitRating.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit rating";
      })
      .addCase(fetchSupporterProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupporterProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.supporterProfile = action.payload;
      })
      .addCase(fetchSupporterProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch supporter profile";
      });
  },
});

export const { clearRateState } = rateSlice.actions;
export default rateSlice.reducer;
