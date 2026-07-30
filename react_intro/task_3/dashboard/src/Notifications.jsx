import './Notifications.css'
import closeButton from './assets/close-button.png'
import { getLatestNotification } from './utils'

function Notifications() {
    const latestNotification = { __html: getLatestNotification() }
    return (
        <>
            <div className="notification-items">
                <p>Here is the list of notifications</p>
                <ul>
                    <li data-priority="Default">New course available</li>
                    <li data-priority="Urgent">New resume available</li>
                    <li dangerouslySetInnerHTML={latestNotification}></li>
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
                    onClick={() => console.log("Close button has been clicked")}
                    aria-label='Close'>
                    <img src={closeButton} alt="close-button" />
                </button>
            </div>
        </>
    )
}

export default Notifications
