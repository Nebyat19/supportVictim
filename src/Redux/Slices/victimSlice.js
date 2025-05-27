import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../../Utils/api"

// Async thunk to submit a victim report
export const submitVictimReport = createAsyncThunk(
  "victim/submitVictimReport",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/support/request`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },

      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit victim report")
    }
  }
)

const victimSlice = createSlice({
  name: "victim",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearVictimState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitVictimReport.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(submitVictimReport.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(submitVictimReport.rejected, (state, action) => {
        state.loading = false
          state.error = action.payload || "An error occurred while submitting the report."
      })
  },
})

export const { clearVictimState } = victimSlice.actions
export default victimSlice.reducer
