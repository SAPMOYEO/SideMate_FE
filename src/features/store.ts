import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import paymentReducer from './slices/paymentSlice'
import aiQuotaReducer from './slices/aiQuotaSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    payment: paymentReducer,
    aiQuota: aiQuotaReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
