import { PureComponent } from 'react'

class NotificationItem extends PureComponent {
    static defaultProps = {
        type: 'default',
        markAsRead: () => {},
    }

    handleClick = () => {
        const { markAsRead, id } = this.props
        markAsRead(id)
    }

    render() {
        const { type, value, html } = this.props

        if (html) {
            return (
                <li
                    data-priority={type}
                    dangerouslySetInnerHTML={html}
                    onClick={this.handleClick}
                ></li>
            )
        }

        return (
            <li data-priority={type} onClick={this.handleClick}>
                {value}
            </li>
        )
    }
}

export default NotificationItem
