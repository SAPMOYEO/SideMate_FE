import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  type Notification,
} from '@/features/slices/notificationSlice'

const NOTIFICATION_MESSAGES: Record<Notification['messageType'], string> = {
  NEW_APPLICANT: '님이 프로젝트에 지원했습니다.',
  APPLICATION_APPROVED: '지원이 승인되었습니다.',
  APPLICATION_REJECTED: '지원이 거절되었습니다.',
  AI_FEEDBACK_DEPLETED: 'AI 피드백 횟수가 소진되었습니다.',
  AI_RESET_REMINDER: 'AI 사용량이 초기화되었습니다.',
}

const getNotificationText = (notification: Notification) => {
  const { messageType, actor, relatedProject } = notification

  if (messageType === 'NEW_APPLICANT') {
    return `${actor?.name ?? '알 수 없는 사용자'}님이 "${relatedProject?.title ?? '프로젝트'}"에 지원했습니다.`
  }

  if (
    messageType === 'APPLICATION_APPROVED' ||
    messageType === 'APPLICATION_REJECTED'
  ) {
    return `"${relatedProject?.title ?? '프로젝트'}" ${NOTIFICATION_MESSAGES[messageType]}`
  }

  return NOTIFICATION_MESSAGES[messageType]
}

const getTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

export const NotificationPopover = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { notifications, unreadCount, loading } = useAppSelector(
    (state) => state.notification
  )
  const isLoggedIn = useAppSelector((state) => !!state.user.user)

  useEffect(() => {
    if (!isLoggedIn) return
    dispatch(fetchUnreadCount())
    const timer = setInterval(() => dispatch(fetchUnreadCount()), 30000)
    return () => clearInterval(timer)
  }, [dispatch, isLoggedIn])

  const handleOpen = (open: boolean) => {
    if (open) {
      dispatch(fetchNotifications())
    }
  }

  const handleClick = (notification: Notification) => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id))
    }

    const { messageType, relatedProject } = notification
    if (messageType === 'NEW_APPLICANT' && relatedProject?._id) {
      navigate(`/projects/${relatedProject._id}`)
    } else if (
      (messageType === 'APPLICATION_APPROVED' ||
        messageType === 'APPLICATION_REJECTED') &&
      relatedProject?._id
    ) {
      navigate(`/projects/${relatedProject._id}`)
    }
  }

  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button className="text-text-muted hover:text-primary relative cursor-pointer transition-colors">
          <Bell size={22} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">알림</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              로딩 중...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              알림이 없습니다.
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification._id}
                type="button"
                onClick={() => handleClick(notification)}
                className={`w-full border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                  !notification.isRead
                    ? 'bg-blue-50/50 dark:bg-blue-950/20'
                    : ''
                }`}
              >
                <p className="text-sm leading-snug">
                  {!notification.isRead && (
                    <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-blue-500" />
                  )}
                  {getNotificationText(notification)}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {getTimeAgo(notification.createdAt)}
                </p>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
