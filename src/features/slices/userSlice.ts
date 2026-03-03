import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  name: string
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
