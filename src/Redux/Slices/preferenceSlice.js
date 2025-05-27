import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../Utils/api";


// Async thunk to save preferences to backend
export const savePreferences = createAsyncThunk(
  "preferences/savePreferences",
  async (preferences, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/profile/client/preference`,
        preferences,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Async thunk to fetch preferences from backend
export const fetchPreferences = createAsyncThunk(
  "preferences/fetchPreferences",
  async (clientId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/profile/client/preference`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          client_id: clientId, // Pass client_id as a query parameter
        },
      });

      const preference = response.data.preference;

      // Parse JSON strings into arrays
      preference.preferred_languages = JSON.parse(
        preference.preferred_languages || "[]"
      );
      preference.preferred_religions = JSON.parse(
        preference.preferred_religions || "[]"
      );

      return preference;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const preferenceSlice = createSlice({
  name: "preferences",
  initialState: {
    preferences: {
      preferred_gender: null,
      ageGroup: null,
      preferred_languages: [],
      preferred_religions: [],
      avoid_triggers: "",
      contact_method: "",
      preferred_contact_start: "",
      preferred_contact_end: "",
    },
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setPreference(state, action) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    resetPreferenceStatus(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(savePreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.preferences = { ...state.preferences, ...action.meta.arg };
      })
      .addCase(savePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save preferences";
        state.success = false;
      })
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = action.payload;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch preferences";
      });
  },
});

export const { setPreference, resetPreferenceStatus } = preferenceSlice.actions;
export default preferenceSlice.reducer;
