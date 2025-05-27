import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../Utils/api";

// Async thunk to fetch emergency contacts
export const fetchEmergencyContacts = createAsyncThunk(
  "emergency/fetchEmergencyContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/emergency-contacts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch emergency contacts");
    }
  }
);

const emergencySlice = createSlice({
  name: "emergency",
  initialState: {
    emergencyContacts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearEmergencyState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencyContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmergencyContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.emergencyContacts = action.payload;
      })
      .addCase(fetchEmergencyContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmergencyState } = emergencySlice.actions;
export default emergencySlice.reducer;