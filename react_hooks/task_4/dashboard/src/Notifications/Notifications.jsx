import { memo } from 'react'
import closeButton from '../assets/close-button.png'
import NotificationItem from './NotificationItem.jsx'

function Notifications({
  displayDrawer = true,
  notifications = [],
  handleDisplayDrawer = () => {},
  handleHideDrawer = () => {},
  markNotificationAsRead = () => {},
}) {
  return (
    <div className="root-notifications">
      <div
        className="notification-title notifications-title"
        onClick={handleDisplayDrawer}
        style={{ cursor: 'pointer' }}
      >
        Your notifications
      </div>
      {displayDrawer && (
        <div className="notification-items">
          {notifications.length === 0 ? (
            <p>No new notification for now</p>
          ) : (
            <>
              <button
                className="close-button"
                aria-label="Close"
                onClick={handleHideDrawer}
              >
                <img src={closeButton} alt="close icon" />
              </button>
              <p>Here is the list of notifications</p>
              <ul>
                {notifications.map(({ id, type, html, value }) => (
                  <NotificationItem
                    key={id}
                    id={id}
                    type={type}
                    html={html}
                    value={value}
                    markAsRead={markNotificationAsRead}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const areEqual = (prevProps, nextProps) =>
  prevProps.displayDrawer === nextProps.displayDrawer &&
  prevProps.notifications === nextProps.notifications &&
  prevProps.handleDisplayDrawer === nextProps.handleDisplayDrawer &&
  prevProps.handleHideDrawer === nextProps.handleHideDrawer &&
  prevProps.markNotificationAsRead === nextProps.markNotificationAsRead

export default memo(Notifications, areEqual)
