import { memo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import closeButton from '../../assets/close-icon.png';
import NotificationItem from '../NotificationItem/NotificationItem.jsx';
import { markNotificationAsRead } from '../../features/notifications/notificationsSlice';

const styles = StyleSheet.create({
  notificationItems: {
    opacity: 0,
    visibility: 'hidden',
  },
  visible: {
    opacity: 1,
    visibility: 'visible',
  },
});

const Notifications = memo(function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const DrawerRef = useRef(null);

  const handleToggleDrawer = useCallback(() => {
    if (DrawerRef.current) {
      DrawerRef.current.classList.toggle(css(styles.visible));
    }
  }, []);

  const handleMarkNotificationAsRead = useCallback((id) => {
    dispatch(markNotificationAsRead(id));
  }, [dispatch]);

  return (
    <div className="root-notifications">
      <div
        className="notifications-title"
        onClick={handleToggleDrawer}
        style={{ cursor: 'pointer' }}
      >
        <p>Your notifications</p>
      </div>
      <div
        ref={DrawerRef}
        className={`notification-items ${css(styles.notificationItems)} ${css(styles.visible)}`}
      >
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
        <button
          className="close-button"
          aria-label="Close"
          onClick={handleToggleDrawer}
        >
          <img src={closeButton} alt="close-button" />
        </button>
      </div>
    </div>
  );
});

export default Notifications;
