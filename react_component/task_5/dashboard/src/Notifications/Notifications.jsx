import { Component } from 'react'
import './Notifications.css'
import closeButton from '../assets/close-button.png'
import { getLatestNotification } from '../utils/utils'
import NotificationItem from './NotificationItem'

class Notifications extends Component {
    markAsRead(id) {
        console.log(`Notification ${id} has been marked as read`)
    }

    render() {
        const notificationsList = [
            { id: 1, type: 'default', value: 'New course available' },
            { id: 2, type: 'urgent', value: 'New resume available' },
            { id: 3, type: 'urgent', html: { __html: getLatestNotification() } },
        ]

        return (
            <>
                <div className="notification-items">
                    <p>Here is the list of notifications</p>
                    <ul>
                        {notificationsList.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                id={notification.id}
                                type={notification.type}
                                value={notification.value}
                                html={notification.html}
                                markAsRead={this.markAsRead}
                            />
                        ))}
                    </ul>
                    <button style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        background: 'transparent',
                        border: 'none',
                        color: '#343434',
                        cursor: 'pointer',
                        }}
                        onClick={() => console.log('Close button has been clicked')}
                        aria-label="Close">
                        <img src={closeButton} alt="close-button" />
                    </button>
                </div>
            </>
        )
    }
}

export default Notifications
