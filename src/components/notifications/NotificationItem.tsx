import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks'
import {
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

interface NotificationItemProps {
  notification: Notification
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleClick = () => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id))
    }

    const { messageType, relatedProject } = notification
    if (
      (messageType === 'NEW_APPLICANT' ||
        messageType === 'APPLICATION_APPROVED' ||
        messageType === 'APPLICATION_REJECTED') &&
      relatedProject?._id
    ) {
      navigate(`/projects/${relatedProject._id}`)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
      }`}
    >
      <p className="text-sm leading-snug">
        {!notification.isRead && (
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-blue-500" />
        )}
        {getNotificationText(notification)}
      </p>
      <p className="text-muted-foreground mt-1 text-xs">
        {formatDistanceToNow(new Date(notification.createdAt), {
          addSuffix: true,
          locale: ko,
        })}
      </p>
    </button>
  )
}
