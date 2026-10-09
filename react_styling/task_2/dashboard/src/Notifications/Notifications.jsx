import React from 'react';
import closeButton from '../assets/close-button.png';
import NotificationItem from './NotificationItem.jsx';

class Notifications extends React.Component {
  static defaultProps = {
    notifications: [],
    displayDrawer: true,
    markAsRead: () => {},
  };

  markAsRead(id) {
    console.log(`Notification ${id} has been marked as read`);
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.notifications !== nextProps.notifications ||
      this.props.displayDrawer !== nextProps.displayDrawer
    );
  }

  render() {
    return (
      <div className="root-notifications flex flex-col items-end">
        <div className="notifications-title text-right">
          <p>Your notifications</p>
        </div>
        {this.props.displayDrawer && (
          <div className="notification-items relative w-full md:w-1/4 p-1.5 border-2 border-dashed border-[var(--main-color)]">
            {this.props.notifications.length === 0 ? (
              <p>No new notification for now</p>
            ) : (
              <>
                <p>Here is the list of notifications</p>
                <ul>
                  {this.props.notifications.map((notif) => (
                    <NotificationItem
                      key={notif.id}
                      id={notif.id}
                      type={notif.type}
                      value={notif.value}
                      html={notif.html}
                      markAsRead={this.markAsRead}
                    />
                  ))}
                </ul>
              </>
            )}
            <button
              className="close-button absolute top-2 right-2 bg-transparent border-none cursor-pointer"
              aria-label="Close"
              onClick={() => console.log('Close button has been clicked')}
            >
              <img src={closeButton} alt="close-button" className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Notifications;
