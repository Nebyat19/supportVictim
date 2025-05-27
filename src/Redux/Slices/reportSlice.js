import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { API_URL } from "../../Utils/api"

// Async thunk to submit a report
export const submitReport = createAsyncThunk(
  "report/submitReport",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reports/anonymous/voice`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit report")
    }
  }
)

const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearReportState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReport.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(submitReport.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearReportState } = reportSlice.actions
export default reportSlice.reducer
