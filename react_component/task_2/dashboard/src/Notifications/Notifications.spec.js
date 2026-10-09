import { render, screen, fireEvent } from '@testing-library/react'
import Notifications from './Notifications'

describe('Notifications', () => {
    let consoleSpy

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        consoleSpy.mockRestore()
    })

    test('Renders the notifications title', () => {
        render(<Notifications />)
        expect(screen.getByText(/^here is the list of notifications$/i)).toBeInTheDocument()
    })

    test('Renders a button in the notifications', () => {
        render(<Notifications />)
        expect(screen.getByRole('button', { name: /^close$/i })).toBeInTheDocument()
    })

    test('Renders exactly 3 li elements', () => {
        render(<Notifications />)
        expect(screen.getAllByRole('listitem').length).toBe(3)
    })

    test('Clicking the close button logs Close button has been clicked to the console', () => {
        render(<Notifications />)
        fireEvent.click(screen.getByRole('button', { name: /^close$/i }))
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/^close button has been clicked$/i))
    })

    test('Clicking a notification item logs that it has been marked as read', () => {
        render(<Notifications />)
        const items = screen.getAllByRole('listitem')

        fireEvent.click(items[0])
        expect(consoleSpy).toHaveBeenCalledWith('Notification 1 has been marked as read')

        fireEvent.click(items[2])
        expect(consoleSpy).toHaveBeenCalledWith('Notification 3 has been marked as read')
    })
})
