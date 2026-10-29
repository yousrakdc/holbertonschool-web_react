import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

const logInThroughForm = async (email = 'test@example.com', password = 'password123') => {
    await userEvent.type(screen.getByLabelText(/^email:$/i), email)
    await userEvent.type(screen.getByLabelText(/^password:$/i), password)
    await userEvent.click(screen.getByRole('button', { name: /^ok$/i }))
}

test('renders the h1 with text School Dashboard', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /^school dashboard$/i })).toBeInTheDocument()
})

test('renders login and copyright paragraph with the correct content', () => {
    render(<App />)
    expect(screen.getByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
    expect(screen.getByText(/^copyright/i)).toBeInTheDocument()
})

test('renders an img element', () => {
    render(<App />)
    expect(screen.getByAltText(/^holberton logo$/i)).toBeInTheDocument()
})

test('renders email input and password input elements', () => {
    render(<App />)
    expect(screen.getByRole('textbox', { name: /^email:$/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/^password:$/i)).toBeInTheDocument()
})

test('renders Email and Password label element', () => {
    render(<App />)
    expect(screen.getByText(/^email:$/i)).toBeInTheDocument()
    expect(screen.getByText(/^password:$/i)).toBeInTheDocument()
})

test('renders a button with text OK', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
})

test('displays the News from the School title and paragraph by default', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: /^news from the school$/i })).toBeInTheDocument()
    expect(screen.getByText(/^holberton school news goes here$/i)).toBeInTheDocument()
})

describe('notifications drawer (handleDisplayDrawer / handleHideDrawer)', () => {
    test('drawer is displayed by default', () => {
        render(<App />)
        expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument()
    })

    test('handleHideDrawer hides the drawer when the close button is clicked', async () => {
        render(<App />)
        await userEvent.click(await userEvent.click(screen.getByLabelText(/close/i)))
        expect(screen.queryByText(/here is the list of notifications/i)).not.toBeInTheDocument()
    })

    test('handleDisplayDrawer shows the drawer again when the menu item is clicked', async () => {
        render(<App />)
        await userEvent.click(await userEvent.click(screen.getByLabelText(/close/i)))
        expect(screen.queryByText(/here is the list of notifications/i)).not.toBeInTheDocument()

        await userEvent.click(screen.getByText(/your notifications/i))
        expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument()
    })
})

describe('logIn', () => {
    test('updates email, password and isLoggedIn in the user state', async () => {
        const { container } = render(<App />)
        expect(container.querySelector('#logoutSection')).toBeNull()

        await logInThroughForm('user@holberton.io', 'secret123')

        // isLoggedIn: true -> course list is rendered, login form is gone
        expect(screen.getByRole('heading', { level: 2, name: /^course list$/i })).toBeInTheDocument()
        expect(screen.queryByText(/^login to access the full dashboard$/i)).not.toBeInTheDocument()

        // email stored in state -> displayed in the header via context
        const section = container.querySelector('#logoutSection')
        expect(section).toBeInTheDocument()
        expect(section).toHaveTextContent(/welcome user@holberton\.io/i)

        // isLoggedIn also drives the footer
        expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument()
    })
})

describe('logOut', () => {
    test('sets isLoggedIn to false and clears email and password', async () => {
        const { container } = render(<App />)
        await logInThroughForm('user@holberton.io', 'secret123')

        await userEvent.click(screen.getByRole('link', { name: /logout/i }))

        // isLoggedIn: false
        expect(screen.getByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
        expect(screen.queryByRole('heading', { level: 2, name: /^course list$/i })).not.toBeInTheDocument()
        expect(container.querySelector('#logoutSection')).toBeNull()
        expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument()

        // email and password cleared: the remounted Login receives empty values
        expect(screen.getByLabelText(/^email:$/i)).toHaveValue('')
        expect(screen.getByLabelText(/^password:$/i)).toHaveValue('')
    })
})

describe('Contact us link in the footer', () => {
    test('is not displayed before logging in', () => {
        render(<App />)
        expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument()
    })

    test('is displayed after logging in', async () => {
        render(<App />)
        await logInThroughForm()
        expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument()
    })
})

describe('markNotificationAsRead', () => {
    let logSpy

    beforeEach(() => {
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        logSpy.mockRestore()
    })

    test('removes the clicked notification and logs the expected message', async () => {
        render(<App />)

        expect(screen.getAllByRole('listitem')).toHaveLength(3)

        await userEvent.click(screen.getByText(/^new course available$/i))

        expect(logSpy).toHaveBeenCalledWith('Notification 1 has been marked as read')
        expect(screen.getAllByRole('listitem')).toHaveLength(2)
        expect(screen.queryByText(/^new course available$/i)).not.toBeInTheDocument()
    })
})
