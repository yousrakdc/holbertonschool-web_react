import { render, screen, fireEvent } from '@testing-library/react'
import NotificationItem from './NotificationItem'

test('calls markAsRead with the item id when clicked', () => {
    const markAsRead = jest.fn()
    render(
        <ul>
            <NotificationItem id={1} type="default" value="test" markAsRead={markAsRead} />
        </ul>
    )

    fireEvent.click(screen.getByRole('listitem'))

    expect(markAsRead).toHaveBeenCalledTimes(1)
    expect(markAsRead).toHaveBeenCalledWith(1)
})
