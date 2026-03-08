import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit'
import api from '../../utils/api/api.instance'
import type { SignUpFormValues } from '@/pages/SignUpPage/components/signUp.schema'

interface User {
  _id?: string
  name: string
  email?: string
  role?: 'user' | 'admin'
  tier?: 'FREE' | 'BASIC' | 'PREMIUM'
  profile?: {
    techStack?: string[]
    gitUrl?: string
    bio?: string
    profileImage?: string
  }
}

interface UserState {
  user: User | null
  loginLoading: boolean
  loginError: string | null
  registerLoading: boolean
  registerError: string | null
  isInitializing: boolean
}

const initialState: UserState = {
  user: null,
  loginLoading: true,
  loginError: null,
  registerLoading: false,
  registerError: null,
  isInitializing: true,
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
    setInitialized(state) {
      state.isInitializing = false
    },
    stopLoading: (state) => {
      state.loginLoading = false
    },
    updateUserImage: (state, action: PayloadAction<string>) => {
      if (state.user) {
        if (!state.user.profile) {
          state.user.profile = {}
        }
        state.user.profile.profileImage = action.payload
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user && action.payload.profile) {
        state.user.name = action.payload.name || state.user.name
        state.user.profile = {
          ...state.user.profile,
          ...action.payload.profile,
        }
      }
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
        state.isInitializing = false
      })
      .addCase(loginWithToken.rejected, (state) => {
        state.loginLoading = false
        state.user = null
        state.isInitializing = false
      })
  },
})

export const {
  setUser,
  clearUser,
  resetError,
  updateUserImage,
  updateUserProfile,
  stopLoading,
  setInitialized,
} = userSlice.actions
export default userSlice.reducer
