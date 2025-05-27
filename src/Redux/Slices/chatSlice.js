
// src/features/call/callSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../Utils/api';

// Helper function to get token
const authHeaders = () => ({
Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// { headers: authHeaders() }
// { headers: authHeaders() }
// { headers: authHeaders() }
// { headers: authHeaders() }
// { headers: authHeaders() }
// { headers: authHeaders() }

// Create Room
export const createRoom = createAsyncThunk('call/createRoom', async (body, { rejectWithValue }) => {
try {
const response = await axios.post(`${API_URL}/webrtc/create-room`, body, );
return response.data;
} catch (err) {
return rejectWithValue(err.response?.data || { message: 'Something went wrong' });
}
});

// Get Assigned Room
export const getAssignedRoom = createAsyncThunk('call/getAssignedRoom', async (body, { rejectWithValue }) => {
try {
const response = await axios.post(`${API_URL}/webrtc/get-assigned-room`, body, );
return response.data;
} catch (err) {
return rejectWithValue(err.response?.data || { message: 'Something went wrong' });
}
});

// End Call
export const endCall = createAsyncThunk('call/endCall', async (body, { rejectWithValue }) => {
try {
const response = await axios.post(`${API_URL}/webrtc/end-call`, body, );
return response.data;
} catch (err) {
return rejectWithValue(err.response?.data || { message: 'Something went wrong' });
}
});

// Send Message
export const sendMessage = createAsyncThunk('call/sendMessage', async (body, { rejectWithValue }) => {
try {
const response = await axios.post(`${API_URL}/messages/send`, body, );
return response.data;
} catch (err) {
return rejectWithValue(err.response?.data || { message: 'Something went wrong' });
}
});

// Get Messages
export const getMessages = createAsyncThunk('call/getMessages', async (body, { rejectWithValue }) => {
try {
const response = await axios.post(`${API_URL}/messages/get`, body, );
return response.data;
} catch (err) {
return rejectWithValue(err.response?.data || { message: 'Something went wrong' });
}
});

// Send Notification
export const sendNotification = createAsyncThunk('call/sendNotification', async (body, { rejectWithValue }) => {
try {
const response = await axios.post(`${API_URL}/notifications/send`, body, );
return response.data;
} catch (err) {
return rejectWithValue(err.response?.data || { message: 'Something went wrong' });
}
});



// === SLICE ===

const callSlice = createSlice({
name: 'call',
initialState: {
room: null,
messages: [],
loading: false,
error: null,
successMessage: null,
},
reducers: {
clearCallState: (state) => {
state.room = null;
state.messages = [];
state.loading = false;
state.error = null;
state.successMessage = null;
},
},
extraReducers: (builder) => {
builder
// Create Room
.addCase(createRoom.pending, (state) => {
state.loading = true;
state.error = null;
})
.addCase(createRoom.fulfilled, (state, action) => {
state.loading = false;
state.room = action.payload.room_name;
state.successMessage = action.payload.message || 'Room created successfully';
})
.addCase(createRoom.rejected, (state, action) => {
state.loading = false;
state.error = action.payload?.message || 'Failed to create room';
})


  // Get Assigned Room
  .addCase(getAssignedRoom.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getAssignedRoom.fulfilled, (state, action) => {
    state.loading = false;
    state.room = action.payload.room_name;
  })
  .addCase(getAssignedRoom.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.message || 'Failed to fetch assigned room';
  })

  // End Call
  .addCase(endCall.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(endCall.fulfilled, (state, action) => {
    state.loading = false;
    state.successMessage = action.payload.message || 'Call ended successfully';
  })
  .addCase(endCall.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.message || 'Failed to end call';
  })

  // Send Message
  .addCase(sendMessage.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  
  .addCase(sendMessage.fulfilled, (state, action) => {
    state.loading = false;
    state.successMessage = action.payload.message || 'Message sent successfully';
  })
  .addCase(sendMessage.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.message || 'Failed to send message';
  })

  // Get Messages
  .addCase(getMessages.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getMessages.fulfilled, (state, action) => {
    state.loading = false;
    state.messages = action.payload.messages || [];
  })
  .addCase(getMessages.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.message || 'Failed to fetch messages';
  })

  // Send Notification
  .addCase(sendNotification.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(sendNotification.fulfilled, (state, action) => {
    state.loading = false;
    state.successMessage = action.payload.message || 'Notification sent';
  })
  .addCase(sendNotification.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload?.message || 'Failed to send notification';
  });

},
});

export const { clearCallState } = callSlice.actions;
export default callSlice.reducer;