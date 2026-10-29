import { memo } from 'react'

const NotificationItem = memo(function NotificationItem({
  type,
  html,
  value,
  markAsRead,
  id,
}) {
  const notificationType = type ?? 'default'

  const handleClick = () => {
    if (markAsRead) {
      markAsRead(id)
    }
  }

  const colorStyle = {
    color: notificationType === 'urgent' ? 'red' : 'blue',
  }

  const className =
    (notificationType === 'default'
      ? 'text-[var(--default-notification-item)]'
      : 'text-[var(--urgent-notification-item)]') +
    ' text-sm sm:text-base max-[912px]:text-base max-[912px]:py-2 max-[912px]:px-2 max-[912px]:border-b max-[912px]:border-gray-200 max-[912px]:last:border-b-0'

  if (html) {
    const markup = typeof html === 'string' ? { __html: html } : html
    return (
      <li
        data-notification-type={notificationType}
        style={colorStyle}
        className={className}
        onClick={handleClick}
        dangerouslySetInnerHTML={markup}
      />
    )
  }

  return (
    <li
      data-notification-type={notificationType}
      style={colorStyle}
      className={className}
      onClick={handleClick}
    >
      {value}
    </li>
  )
})

export default NotificationItem
