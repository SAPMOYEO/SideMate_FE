import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import {
  getPayments,
  postPayment,
  patchSubscriptionPlan,
  deleteSubscription,
  type CreatePaymentPayload,
  type ChangeSubscriptionPlanPayload,
} from '@/utils/api/payment'
import type {
  CheckoutDraft,
  PaymentState,
  PaymentSuccessData,
} from '@/types/payment.type'

const initialState: PaymentState = {
  payments: [],
  subscription: null,
  checkoutDraft: null,
  paymentSuccess: null,

  paymentsLoading: false,
  paymentsError: null,

  cancelLoading: false,
  cancelError: null,

  submitLoading: false,
  submitError: null,
}

// 결제 정보 불러오기
export const fetchPayments = createAsyncThunk(
  'payment/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getPayments()

      return {
        payments: data.payments ?? [],
        subscription: data.subscription ?? null,
      }
    } catch (error) {
      console.error(error)
      return rejectWithValue('결제 정보를 불러오지 못했습니다.')
    }
  }
)

// 결제 생성하기
export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async (payload: CreatePaymentPayload, { rejectWithValue }) => {
    try {
      return await postPayment(payload)
    } catch (error) {
      console.error(error)
      return rejectWithValue('결제 생성에 실패했습니다.')
    }
  }
)

// 구독 플랜 변경하기
export const changeSubscriptionPlan = createAsyncThunk(
  'payment/changeSubscriptionPlan',
  async (payload: ChangeSubscriptionPlanPayload, { rejectWithValue }) => {
    try {
      return await patchSubscriptionPlan(payload)
    } catch (error) {
      console.error(error)
      return rejectWithValue('구독 플랜 변경에 실패했습니다.')
    }
  }
)

// 구독 해지하기
export const cancelSubscription = createAsyncThunk(
  'payment/cancelSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const data = await deleteSubscription()

      return {
        subscription: data.subscription ?? null,
        quota: data.quota ?? null,
      }
    } catch (error) {
      console.error(error)
      return rejectWithValue('구독 해지에 실패했습니다.')
    }
  }
)

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // 결제 임시 정보 저장하기
    setCheckoutDraft(state, action: PayloadAction<CheckoutDraft>) {
      state.checkoutDraft = action.payload
    },

    // 결제 임시 정보 초기화하기
    clearCheckoutDraft(state) {
      state.checkoutDraft = null
    },

    // 결제 완료 정보 저장하기
    setPaymentSuccess(state, action: PayloadAction<PaymentSuccessData>) {
      state.paymentSuccess = action.payload
    },

    // 결제 완료 정보 초기화하기
    clearPaymentSuccess(state) {
      state.paymentSuccess = null
    },

    // 결제 관련 에러 초기화하기
    resetPaymentError(state) {
      state.paymentsError = null
      state.cancelError = null
      state.submitError = null
    },

    // 결제 상태 전체 초기화하기
    clearPaymentState(state) {
      state.payments = []
      state.subscription = null
      state.checkoutDraft = null
      state.paymentSuccess = null
      state.paymentsLoading = false
      state.paymentsError = null
      state.cancelLoading = false
      state.cancelError = null
      state.submitLoading = false
      state.submitError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.paymentsLoading = true
        state.paymentsError = null
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.paymentsLoading = false
        state.payments = action.payload.payments
        state.subscription = action.payload.subscription
        state.paymentsError = null
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.paymentsLoading = false
        state.paymentsError = action.payload as string
      })

      .addCase(createPayment.pending, (state) => {
        state.submitLoading = true
        state.submitError = null
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.submitLoading = false
        state.submitError = null

        if (action.payload.payment) {
          state.payments = [action.payload.payment, ...state.payments]
        }

        if (action.payload.subscription) {
          state.subscription = action.payload.subscription
        }
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.submitLoading = false
        state.submitError = action.payload as string
      })

      .addCase(changeSubscriptionPlan.pending, (state) => {
        state.submitLoading = true
        state.submitError = null
      })
      .addCase(changeSubscriptionPlan.fulfilled, (state, action) => {
        state.submitLoading = false
        state.submitError = null

        if (action.payload.payment) {
          state.payments = [action.payload.payment, ...state.payments]
        }

        if (action.payload.subscription) {
          state.subscription = action.payload.subscription
        }
      })
      .addCase(changeSubscriptionPlan.rejected, (state, action) => {
        state.submitLoading = false
        state.submitError = action.payload as string
      })

      .addCase(cancelSubscription.pending, (state) => {
        state.cancelLoading = true
        state.cancelError = null
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.cancelLoading = false
        state.subscription = action.payload.subscription
        state.cancelError = null
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.cancelLoading = false
        state.cancelError = action.payload as string
      })
  },
})

export const {
  setCheckoutDraft,
  clearCheckoutDraft,
  setPaymentSuccess,
  clearPaymentSuccess,
  resetPaymentError,
  clearPaymentState,
} = paymentSlice.actions

export default paymentSlice.reducer
