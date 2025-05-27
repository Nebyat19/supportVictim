import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

// Async thunk to fetch resources from the backend
export const fetchResources = createAsyncThunk("resources/fetchResources", async () => {
  const response = await axios.get("/api/resources") // Replace with your backend API endpoint
  return response.data
})

const resourceSlice = createSlice({
  name: "resources",
  initialState: {
    items: [], // Initialize as an empty array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default resourceSlice.reducer
