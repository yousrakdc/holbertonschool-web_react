import { render, screen, fireEvent } from '@testing-library/react'
import Notifications from './Notifications'

test('Renders the notifications title', () => {
    render(<Notifications />)
    expect(screen.getByText(/^here is the list of notifications$/i)).toBeInTheDocument()
})

test('Renders a button in the notifications', () => {
    render(<Notifications />)
    expect(screen.getByRole('button', { name: /^close$/i})).toBeInTheDocument()
})

test('Renders exactly 3 li elements', () => {
    render(<Notifications />)
    expect(screen.getAllByRole('listitem').length).toBe(3)
})

test('Clicking the close button logs Close button has been clicked to the console', () => {
    render(<Notifications />)
    console.log = jest.fn()
    fireEvent.click(screen.getByRole('button', { name: /^close$/i}))
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/^close button has been clicked$/i))
})
