import { useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
  fetchNotifications,
  fetchUnreadCount,
} from '@/features/slices/notificationSlice'
import { NotificationItem } from './NotificationItem'

export const NotificationPopover = () => {
  const dispatch = useAppDispatch()
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

  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={22} strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
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
              <NotificationItem
                key={notification._id}
                notification={notification}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
