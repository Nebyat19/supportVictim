import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../Utils/api";

// Async thunk to fetch resources
export const fetchResources = createAsyncThunk(
  "resources/fetchResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/resources`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch resources");
    }
  }
);

const resourceSlice = createSlice({
  name: "resources",
  initialState: {
    resources: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearResourcesState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearResourcesState } = resourceSlice.actions;
export default resourceSlice.reducer;
