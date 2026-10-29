import { PureComponent } from 'react';
import closeButton from '../assets/close-button.png';
import './Notifications.css';
import NotificationItem from './NotificationItem.jsx';

class Notifications extends PureComponent {
  static defaultProps = {
    notifications: [],
    displayDrawer: false,
    markNotificationAsRead: () => {},
    handleDisplayDrawer: () => {},
    handleHideDrawer: () => {},
  };

  render() {
    const {
      notifications,
      displayDrawer,
      markNotificationAsRead,
      handleDisplayDrawer,
      handleHideDrawer,
    } = this.props;

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
                        markAsRead={markNotificationAsRead}
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
  }
}

export default Notifications;