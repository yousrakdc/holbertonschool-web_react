import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import mockAxios from 'jest-mock-axios'
import App from './App.jsx'

const NOTIFICATIONS_URL = 'http://localhost:5173/notifications.json'
const COURSES_URL = 'http://localhost:5173/courses.json'

const respond = async (url, data) => {
  await act(async () => {
    mockAxios.mockResponseFor({ url }, { data })
  })
}

const countCalls = (url) =>
  mockAxios.get.mock.calls.filter(([calledUrl]) => calledUrl === url).length

const logIn = async (email = 'test@example.com', password = 'password123') => {
  await userEvent.type(screen.getByLabelText(/^email:?$/i), email)
  await userEvent.type(screen.getByLabelText(/^password:?$/i), password)
  await userEvent.click(screen.getByRole('button', { name: /^ok$/i }))
}

const logOut = async () => {
  await userEvent.click(screen.getByRole('link', { name: /logout/i }))
}

let logSpy

beforeEach(() => {
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  logSpy.mockRestore()
  mockAxios.reset()
})

test('App is a function component', () => {
  expect(typeof App).toBe('function')
  expect(App.prototype?.isReactComponent).toBeUndefined()
})

describe('rendering', () => {
  test('renders the h1 with text School Dashboard', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: /^school dashboard$/i })).toBeInTheDocument()
  })

  test('renders the login form and the footer by default', () => {
    render(<App />)
    expect(screen.getByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email:?$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password:?$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
    expect(screen.getByText(/^copyright/i)).toBeInTheDocument()
  })

  test('renders the News from the School section', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: /^news from the school$/i })).toBeInTheDocument()
    expect(screen.getByText(/^holberton school news goes here$/i)).toBeInTheDocument()
  })
})

describe('notifications data', () => {
  test('renders the 3 initial notifications immediately', () => {
    render(<App />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText(/^new course available$/i)).toBeInTheDocument()
    expect(screen.getByText(/^new resume available$/i)).toBeInTheDocument()
    expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument()
  })

  test('fetches notifications.json once on mount and uses the response', async () => {
    render(<App />)
    expect(mockAxios.get).toHaveBeenCalledWith(NOTIFICATIONS_URL)

    await respond(NOTIFICATIONS_URL, {
      notifications: [
        { id: 1, type: 'default', value: 'New course available' },
        { id: 3, type: 'urgent', html: { __html: '' } },
      ],
    })

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText(/urgent requirement/i)).toBeInTheDocument()
    expect(countCalls(NOTIFICATIONS_URL)).toBe(1)
  })

  test('keeps the initial notifications when the request fails', async () => {
    render(<App />)
    await act(async () => {
      mockAxios.mockError(new Error('Network error'))
    })
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})

describe('courses data', () => {
  test('does not fetch courses while logged out', () => {
    render(<App />)
    expect(countCalls(COURSES_URL)).toBe(0)
  })

  test('fetches courses.json when the user logs in', async () => {
    render(<App />)
    await logIn()

    expect(countCalls(COURSES_URL)).toBe(1)
    expect(screen.getByText('ES6')).toBeInTheDocument()

    await respond(COURSES_URL, {
      courses: [{ id: 4, name: 'Jest', credit: 10 }],
    })

    expect(screen.getByText('Jest')).toBeInTheDocument()
    expect(screen.queryByText('ES6')).not.toBeInTheDocument()
  })
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

  test('handleDisplayDrawer keeps an open drawer open', () => {
    render(<App />)
    fireEvent.click(screen.getByText(/your notifications/i))
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument()
  })
})

describe('logIn and logOut', () => {
  test('logIn updates email, password and isLoggedIn', async () => {
    const { container } = render(<App />)
    expect(container.querySelector('#logoutSection')).toBeNull()

    await logIn()

    expect(screen.getByRole('heading', { level: 2, name: /^course list$/i })).toBeInTheDocument()
    expect(screen.queryByText(/^login to access the full dashboard$/i)).not.toBeInTheDocument()
    expect(container.querySelector('#logoutSection')).toHaveTextContent(/welcome test@example\.com/i)
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument()
  })

  test('logOut sets isLoggedIn to false and clears email and password', async () => {
    const { container } = render(<App />)
    await logIn()
    await logOut()

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

    await logIn()
    await logOut()

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByText(/^new course available$/i)).not.toBeInTheDocument()
    expect(countCalls(NOTIFICATIONS_URL)).toBe(1)
  })
})
