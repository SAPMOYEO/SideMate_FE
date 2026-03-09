import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api/api.instance'
import type { AiQuotaState } from '@/types/aiQuota.type'

const initialState: AiQuotaState = {
  quota: null,
  summary: null,
  loading: false,
  error: null,
}

// AI 사용량 조회하기
export const fetchMyQuota = createAsyncThunk(
  'aiQuota/fetchMyQuota',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/aiquota')
      return response.data
    } catch (error) {
      console.error(error)
      return rejectWithValue('AI 사용량 정보를 불러오지 못했습니다.')
    }
  }
)

// AI 사용량 차감하기
export const consumeQuota = createAsyncThunk(
  'aiQuota/consumeQuota',
  async (amount: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.post('/aiquota/consume', { amount })
      return response.data
    } catch (error) {
      console.error(error)
      return rejectWithValue('AI 사용량 차감에 실패했습니다.')
    }
  }
)

// 무료 AI 사용량 추가하기
export const addFreeQuota = createAsyncThunk(
  'aiQuota/addFreeQuota',
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await api.patch('/aiquota/free', { amount })
      return response.data
    } catch (error) {
      console.error(error)
      return rejectWithValue('무료 사용량 추가에 실패했습니다.')
    }
  }
)

const aiQuotaSlice = createSlice({
  name: 'aiQuota',
  initialState,
  reducers: {
    // AI 사용량 상태 초기화하기
    clearAiQuota(state) {
      state.quota = null
      state.summary = null
      state.loading = false
      state.error = null
    },

    // AI 사용량 에러 초기화하기
    resetAiQuotaError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyQuota.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyQuota.fulfilled, (state, action) => {
        state.loading = false
        state.quota = action.payload.quota ?? null
        state.summary = action.payload.summary ?? null
        state.error = null
      })
      .addCase(fetchMyQuota.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(consumeQuota.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(consumeQuota.fulfilled, (state, action) => {
        state.loading = false
        state.quota = action.payload.quota ?? null
        state.summary = action.payload.summary ?? null
        state.error = null
      })
      .addCase(consumeQuota.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(addFreeQuota.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addFreeQuota.fulfilled, (state, action) => {
        state.loading = false
        state.quota = action.payload.quota ?? null
        state.summary = action.payload.summary ?? null
        state.error = null
      })
      .addCase(addFreeQuota.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearAiQuota, resetAiQuotaError } = aiQuotaSlice.actions
export default aiQuotaSlice.reducer
