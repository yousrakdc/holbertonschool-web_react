import { memo, useCallback, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, css } from 'aphrodite';
import closeButton from '../../assets/close-icon.png';
import NotificationItem from '../NotificationItem/NotificationItem.jsx';
import { markNotificationAsRead } from '../../features/notifications/notificationsSlice';
import { getFilteredNotifications } from '../../features/selectors/notificationSelector';

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
  const [currentFilter, setCurrentFilter] = useState('all');
  const filteredNotifications = useSelector((state) =>
    getFilteredNotifications(state, currentFilter)
  );
  const loading = useSelector((state) => state.notifications.loading);
  const DrawerRef = useRef(null);

  const handleToggleDrawer = useCallback(() => {
    if (DrawerRef.current) {
      DrawerRef.current.classList.toggle(css(styles.visible));
    }
  }, []);

  const handleMarkNotificationAsRead = useCallback((id) => {
    dispatch(markNotificationAsRead(id));
  }, [dispatch]);

  const handleSetFilterUrgent = useCallback(() => {
    setCurrentFilter((prev) => (prev === 'urgent' ? 'all' : 'urgent'));
  }, []);

  const handleSetFilterDefault = useCallback(() => {
    setCurrentFilter((prev) => (prev === 'default' ? 'all' : 'default'));
  }, []);

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
        className={`notification-items ${css(styles.notificationItems)}`}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>
              Here is the list of notifications
              <button aria-label="Filter urgent" onClick={handleSetFilterUrgent}>
                ‼️
              </button>
              <button aria-label="Filter default" onClick={handleSetFilterDefault}>
                ??
              </button>
            </p>
            {filteredNotifications.length === 0 ? (
              <p>No new notifications for now</p>
            ) : (
              <ul>
                {filteredNotifications.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    id={notif.id}
                    type={notif.type}
                    value={notif.value}
                    markAsRead={handleMarkNotificationAsRead}
                  />
                ))}
              </ul>
            )}
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
