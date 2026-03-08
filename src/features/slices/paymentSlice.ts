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

export type PaymentMethod = 'card' | 'cash'
export type PaymentPlanKey = 'free' | 'basic' | 'premium' | 'topUp'
export type PaymentApiMethod = 'CARD' | 'CASH'
export type PaymentApiType = 'TOPUP' | 'SUBSCRIPTION'

export interface PaymentItem {
  _id: string
  userId: string
  idempotencyKey: string
  method: PaymentApiMethod
  type: PaymentApiType
  plan?: 'basic' | 'premium'
  quantity: number
  payAmount: number
  status: 'PAID' | 'CANCELED'
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  _id: string
  userId: string
  plan: 'basic' | 'premium'
  status: 'active' | 'canceled'
  canceledAt: string | null
  currentPeriodStart: string
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
}

export interface CheckoutDraft {
  planKey: PaymentPlanKey
  paymentMethod: PaymentMethod
  topUpCount: number
  totalPrice: number
  agreed: boolean
  isTopUp: boolean
}

export interface PaymentSuccessData {
  addedCount: number
  totalAvailableCount: number
  amountPaid: number
  orderId: string
  paidAt: string
  paymentMethodLabel: string
  planLabel: string
  bankName?: string
  accountNumber?: string
}

interface PaymentState {
  payments: PaymentItem[]
  subscription: Subscription | null
  checkoutDraft: CheckoutDraft | null
  paymentSuccess: PaymentSuccessData | null

  paymentsLoading: boolean
  paymentsError: string | null

  cancelLoading: boolean
  cancelError: string | null

  submitLoading: boolean
  submitError: string | null
}

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
    setCheckoutDraft(state, action: PayloadAction<CheckoutDraft>) {
      state.checkoutDraft = action.payload
    },

    clearCheckoutDraft(state) {
      state.checkoutDraft = null
    },

    setPaymentSuccess(state, action: PayloadAction<PaymentSuccessData>) {
      state.paymentSuccess = action.payload
    },

    clearPaymentSuccess(state) {
      state.paymentSuccess = null
    },

    resetPaymentError(state) {
      state.paymentsError = null
      state.cancelError = null
      state.submitError = null
    },

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
