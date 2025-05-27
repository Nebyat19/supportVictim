import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../Utils/api'

export const applyForVolunteer = createAsyncThunk(
  'volunteer/applyForVolunteer',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/volunteer/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          
          
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Application failed');
    }
  }
);

const volunteerSlice = createSlice({
  name: 'volunteer',
  initialState: {
    loading: false,
    status: null,
    credentials: [],
    message: '',
    error: null
  },
  reducers: {
    resetVolunteerState: (state) => {
      state.loading = false;
      state.status = null;
      state.credentials = [];
      state.message = '';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyForVolunteer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForVolunteer.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.credentials = action.payload.credentials;
        state.message = action.payload.message;
      })
      .addCase(applyForVolunteer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetVolunteerState } = volunteerSlice.actions;

export default volunteerSlice.reducer;
