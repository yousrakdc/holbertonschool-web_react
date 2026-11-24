import { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import closeButton from '../../assets/close-icon.png';
import NotificationItem from '../NotificationItem/NotificationItem.jsx';
import {
  markNotificationAsRead,
  showDrawer,
  hideDrawer,
} from '../../features/notifications/notificationsSlice';

const Notifications = memo(function Notifications() {
  const dispatch = useDispatch();
  const displayDrawer = useSelector((state) => state.notifications.displayDrawer);
  const notifications = useSelector((state) => state.notifications.notifications);

  const handleDisplayDrawer = useCallback(() => {
    dispatch(showDrawer());
  }, [dispatch]);

  const handleHideDrawer = useCallback(() => {
    dispatch(hideDrawer());
  }, [dispatch]);

  const handleMarkNotificationAsRead = useCallback((id) => {
    dispatch(markNotificationAsRead(id));
  }, [dispatch]);

  return (
    <div className="root-notifications">
      <div
        className="notifications-title"
        onClick={handleDisplayDrawer}
        style={{ cursor: 'pointer' }}
      >
        <p>Your notifications</p>
      </div>
      {displayDrawer && (
        <>
          <div className="notification-items">
            {notifications.length === 0 ? (
              <p>No new notification for now</p>
            ) : (
              <>
                <p>Here is the list of notifications</p>
                <ul>
                  {notifications.map((notif) => (
                    <NotificationItem
                      key={notif.id}
                      id={notif.id}
                      type={notif.type}
                      value={notif.value}
                      html={notif.html}
                      markAsRead={handleMarkNotificationAsRead}
                    />
                  ))}
                </ul>
              </>
            )}
          </div>
          <button
            className="close-button"
            aria-label="Close"
            onClick={handleHideDrawer}
          >
            <img src={closeButton} alt="close-button" />
          </button>
        </>
      )}
    </div>
  );
});

export default Notifications;
