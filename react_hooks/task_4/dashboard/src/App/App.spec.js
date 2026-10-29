import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

const logInThroughForm = async () => {
  await userEvent.type(screen.getByLabelText(/^email:?$/i), 'test@example.com')
  await userEvent.type(screen.getByLabelText(/^password:?$/i), 'password123')
  await userEvent.click(screen.getByRole('button', { name: /^ok$/i }))
}

let logSpy

beforeEach(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  logSpy.mockRestore()
})

test('App is a function component', () => {
  expect(typeof App).toBe('function')
  expect(App.prototype?.isReactComponent).toBeUndefined()
})

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

test('renders email input, password input and a button with text OK', () => {
  render(<App />)
  expect(screen.getByLabelText(/^email:?$/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/^password:?$/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
})

test('displays the News from the School title and paragraph by default', () => {
  render(<App />)
  expect(screen.getByRole('heading', { level: 2, name: /^news from the school$/i })).toBeInTheDocument()
  expect(screen.getByText(/^holberton school news goes here$/i)).toBeInTheDocument()
})

test('renders the 3 notifications immediately', () => {
  render(<App />)
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
})

describe('notifications drawer (handleDisplayDrawer / handleHideDrawer)', () => {
  test('is displayed by default', () => {
    render(<App />)
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument()
  })

  test('handleHideDrawer hides the drawer', () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText(/close/i))
    expect(screen.queryByText(/here is the list of notifications/i)).not.toBeInTheDocument()
  })

  test('handleDisplayDrawer shows the drawer again', () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText(/close/i))
    fireEvent.click(screen.getByText(/your notifications/i))
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument()
  })
})

describe('logIn and logOut', () => {
  test('logIn updates email, password and isLoggedIn', async () => {
    const { container } = render(<App />)
    expect(container.querySelector('#logoutSection')).toBeNull()

    await logInThroughForm()

    expect(screen.getByRole('heading', { level: 2, name: /^course list$/i })).toBeInTheDocument()
    expect(screen.queryByText(/^login to access the full dashboard$/i)).not.toBeInTheDocument()
    expect(container.querySelector('#logoutSection')).toHaveTextContent(/welcome test@example\.com/i)
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument()
  })

  test('logOut sets isLoggedIn to false and clears email and password', async () => {
    const { container } = render(<App />)
    await logInThroughForm()

    await userEvent.click(screen.getByRole('link', { name: /logout/i }))

    expect(screen.getByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
    expect(container.querySelector('#logoutSection')).toBeNull()
    expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument()
    expect(screen.getByLabelText(/^email:?$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^password:?$/i)).toHaveValue('')
  })
})

describe('markNotificationAsRead', () => {
  test('removes the clicked notification and logs the expected message', () => {
    render(<App />)

    fireEvent.click(screen.getByText(/^new course available$/i))

    expect(logSpy).toHaveBeenCalledWith('Notification 1 has been marked as read')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByText(/^new course available$/i)).not.toBeInTheDocument()
  })

  test('deleted notifications stay deleted through login and logout', async () => {
    render(<App />)
    fireEvent.click(screen.getByText(/^new course available$/i))

    await logInThroughForm()
    await userEvent.click(screen.getByRole('link', { name: /logout/i }))

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
