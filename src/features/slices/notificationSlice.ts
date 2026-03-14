import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/utils/api/api.instance'

export interface Notification {
  _id: string
  receiver: string
  actor: { _id: string; name: string; image?: string } | null
  relatedProject: { _id: string; title: string } | null
  relatedApplication?: string
  messageType:
    | 'NEW_APPLICANT'
    | 'APPLICATION_APPROVED'
    | 'APPLICATION_REJECTED'
    | 'AI_FEEDBACK_DEPLETED'
    | 'AI_RESET_REMINDER'
  isRead: boolean
  createdAt: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notification')
      return response.data.data as Notification[]
    } catch (error) {
      console.error(error)
      return rejectWithValue('알림 목록을 불러오지 못했습니다.')
    }
  }
)

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notification/unread-count')
      return response.data.count as number
    } catch (error) {
      console.error(error)
      return rejectWithValue('안읽은 알림 수를 불러오지 못했습니다.')
    }
  }
)

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.patch(`/notification/${id}/read`)
      return id
    } catch (error) {
      console.error(error)
      return rejectWithValue('읽음 처리에 실패했습니다.')
    }
  }
)

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotifications(state) {
      state.notifications = []
      state.unreadCount = 0
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter((n) => !n.isRead).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        const target = state.notifications.find((n) => n._id === action.payload)
        if (target && !target.isRead) {
          target.isRead = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
  },
})

export const { clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer
