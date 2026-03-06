import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import api from '../../utils/api'
import type { SignUpFormValues } from '@/pages/SignUpPage/components/signUp.schema'

interface User {
  _id?: string
  name: string
  email?: string
  role?: 'user' | 'admin'
}

interface UserState {
  user: User | null
  loginLoading: boolean
  loginError: string | null
  registerLoading: boolean
  registerError: string | null
}

const initialState: UserState = {
  user: null,
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null,
}

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: SignUpFormValues, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/register', userData)
      return response.data.user
    } catch (error) {
      console.error(error)
      return rejectWithValue('회원가입에 실패했습니다.')
    }
  }
)

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    loginData: { password: string; email: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/user/login', loginData)
      localStorage.setItem('token', response.data.token)
      api.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.token}`
      return response.data.user
    } catch (error) {
      console.error(error)
      return rejectWithValue('로그인에 실패했습니다.')
    }
  }
)

export const loginWithToken = createAsyncThunk(
  'user/loginWithToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/me')
      return response.data.user
    } catch (error) {
      console.error(error)
      localStorage.removeItem('token')
      return rejectWithValue('세션이 만료되었습니다.')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    },
    resetError(state) {
      state.registerError = null
      state.loginError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true
        state.registerError = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false
        state.registerError = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false
        state.registerError = action.payload as string
      })
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true
        state.loginError = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false
        state.user = action.payload
        state.loginError = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false
        state.loginError = action.payload as string
      })
      .addCase(loginWithToken.pending, (state) => {
        state.loginLoading = true
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.loginLoading = false
        state.user = action.payload
        state.loginError = null
      })
      .addCase(loginWithToken.rejected, (state) => {
        state.loginLoading = false
        state.user = null
      })
  },
})

export const { setUser, clearUser, resetError } = userSlice.actions
export default userSlice.reducer
