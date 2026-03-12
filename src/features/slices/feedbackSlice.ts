import axios from 'axios'
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { requestProjectFeedback } from '@/utils/api/feedback'
import type {
  CreateFeedbackPayload,
  CreateFeedbackResponse,
  FeedbackItem,
  FeedbackState,
  FeedbackSummary,
} from '@/types/feedback.type'

const initialState: FeedbackState = {
  feedbackId: null,
  feedback: null,
  summary: null,

  submitLoading: false,
  submitError: null,
}

// AI 피드백 생성하기
export const createProjectFeedback = createAsyncThunk<
  CreateFeedbackResponse,
  CreateFeedbackPayload,
  { rejectValue: string }
>('feedback/createProjectFeedback', async (payload, { rejectWithValue }) => {
  try {
    return await requestProjectFeedback(payload)
  } catch (error) {
    console.error(error)

    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.error || 'AI 피드백 생성에 실패했습니다.'
      )
    }

    return rejectWithValue('AI 피드백 생성에 실패했습니다.')
  }
})

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    // 피드백 데이터 수동 저장
    setFeedback(state, action: PayloadAction<FeedbackItem>) {
      state.feedback = action.payload
    },

    // 피드백 ID 수동 저장
    setFeedbackId(state, action: PayloadAction<string>) {
      state.feedbackId = action.payload
    },

    // 피드백 summary 수동 저장
    setFeedbackSummary(state, action: PayloadAction<FeedbackSummary>) {
      state.summary = action.payload
    },

    // 피드백 상태 전체 초기화
    clearFeedback(state) {
      state.feedbackId = null
      state.feedback = null
      state.summary = null
      state.submitLoading = false
      state.submitError = null
    },

    // 피드백 에러 초기화
    resetFeedbackError(state) {
      state.submitError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProjectFeedback.pending, (state) => {
        state.submitLoading = true
        state.submitError = null
      })
      .addCase(createProjectFeedback.fulfilled, (state, action) => {
        state.submitLoading = false
        state.submitError = null
        state.feedbackId = action.payload.feedbackId
        state.feedback = action.payload.feedback
        state.summary = action.payload.summary
      })
      .addCase(createProjectFeedback.rejected, (state, action) => {
        state.submitLoading = false
        state.submitError = action.payload as string
      })
  },
})

export const {
  setFeedback,
  setFeedbackId,
  setFeedbackSummary,
  clearFeedback,
  resetFeedbackError,
} = feedbackSlice.actions

export default feedbackSlice.reducer
