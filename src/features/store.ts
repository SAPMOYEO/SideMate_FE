import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import paymentReducer from './slices/paymentSlice'
import aiQuotaReducer from './slices/aiQuotaSlice'
import notificationReducer from './slices/notificationSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
    aiQuota: aiQuotaReducer,
    notification: notificationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
