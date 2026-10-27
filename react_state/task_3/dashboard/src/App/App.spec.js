import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

const logInThroughForm = async () => {
    await userEvent.type(screen.getByLabelText(/^email:$/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/^password:$/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /^ok$/i }))
}

test('renders the h1 with text School Dashboard', async () => {
    render(<App />)
    expect(screen.getByRole('heading', {level: 1, name: /^school dashboard$/i})).toBeInTheDocument()
})

test('renders login and copyright paragraph with the correct content', async () => {
    render(<App />)
    expect(screen.getByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
    expect(screen.getByText(/^copyright/i)).toBeInTheDocument()
})

test('renders an img element', async () => {
    render(<App />)
    expect(screen.getByAltText(/^holberton logo$/i)).toBeInTheDocument()
})

test('renders email input and password input elements', async () => {
    render(<App />)
    expect(screen.getByRole('textbox', {name: /^email:$/i})).toBeInTheDocument()
    expect(screen.getByLabelText(/^password:$/i)).toBeInTheDocument()
})

test('renders Email and Password label element', async () => {
    render(<App />)
    expect(screen.getByText(/^email:$/i)).toBeInTheDocument()
    expect(screen.getByText(/^password:$/i)).toBeInTheDocument()
})

test('renders a button with text OK', async () => {
    render(<App />)
    expect(screen.getByRole('button', {name: /^ok$/i})).toBeInTheDocument()
})

test('displays the News from the School title and paragraph by default', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: /^news from the school$/i })).toBeInTheDocument()
    expect(screen.getByText(/^holberton school news goes here$/i)).toBeInTheDocument()
})

test('does not show the logout section before logging in', () => {
    const { container } = render(<App />)
    expect(container.querySelector('#logoutSection')).toBeNull()
})

test('shows the course list and the logout section after logging in', async () => {
    const { container } = render(<App />)
    await logInThroughForm()

    expect(screen.getByRole('heading', { level: 2, name: /^course list$/i })).toBeInTheDocument()
    expect(screen.queryByText(/^login to access the full dashboard$/i)).not.toBeInTheDocument()

    const section = container.querySelector('#logoutSection')
    expect(section).toBeInTheDocument()
    expect(section).toHaveTextContent(/welcome test@example\.com/i)
})

test('logs the user out when clicking the logout link in the header', async () => {
    const { container } = render(<App />)
    await logInThroughForm()

    await userEvent.click(screen.getByRole('link', { name: /logout/i }))

    expect(screen.getByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: /^course list$/i })).not.toBeInTheDocument()
    expect(container.querySelector('#logoutSection')).toBeNull()
})

describe('logOut with ctrl + h', () => {
    let alertSpy

    beforeEach(() => {
        alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    })

    afterEach(() => {
        alertSpy.mockRestore()
    })

    test('logs the user out when ctrl and h are pressed', async () => {
        const { container } = render(<App />)
        await logInThroughForm()
        expect(screen.getByRole('heading', { level: 2, name: /^course list$/i })).toBeInTheDocument()

        fireEvent.keyDown(document, { key: 'h', ctrlKey: true })

        expect(await screen.findByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
        expect(screen.queryByRole('heading', { level: 2, name: /^course list$/i })).not.toBeInTheDocument()
        expect(container.querySelector('#logoutSection')).toBeNull()
    })

    test('calls alert with "Logging you out" when ctrl and h are pressed', () => {
        render(<App />)

        fireEvent.keyDown(document, { key: 'h', ctrlKey: true })

        expect(alertSpy).toHaveBeenCalledWith('Logging you out')
    })
})
