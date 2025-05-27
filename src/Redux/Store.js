// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import supportProfileSReducer from './Slices/suporterProfileSlice';
import supportApplyReducer from "./Slices/supporterApplySlice"
import chatReducer from './Slices/chatSlice';
import resourceReducer from './Slices/resourceSlice';
import reportReducer from './Slices/reportSlice';
import victimReducer from './Slices/victimSlice';
import emergencyReducer from './Slices/emergencySlice';
import preferenceReducer from './Slices/preferenceSlice';
import rateReducer from "./Slices/rateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    supportProfile: supportProfileSReducer,
    supportApply: supportApplyReducer,
    chat: chatReducer,
    resources: resourceReducer,
    report: reportReducer,
    victim: victimReducer,
    emergency: emergencyReducer,
    preferences: preferenceReducer,
    rate: rateReducer,
  },
});
