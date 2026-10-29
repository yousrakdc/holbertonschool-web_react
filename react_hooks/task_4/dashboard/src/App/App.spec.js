import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import mockAxios from 'jest-mock-axios'
import App from './App.jsx'

const NOTIFICATIONS_URL = 'http://localhost:5173/notifications.json'
const COURSES_URL = 'http://localhost:5173/courses.json'

const notificationsData = [
  { id: 1, type: 'default', value: 'New course available' },
  { id: 2, type: 'urgent', value: 'New resume available' },
  { id: 3, type: 'urgent', html: { __html: '' } },
]

const coursesData = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
]

const respond = async (url, data) => {
  await act(async () => {
    mockAxios.mockResponseFor({ url }, { data })
  })
}

const renderApp = async () => {
  const utils = render(<App />)
  await respond(NOTIFICATIONS_URL, notificationsData)
  await respond(COURSES_URL, coursesData)
  return utils
}

const logInThroughForm = async () => {
  await userEvent.type(screen.getByLabelText(/^email:$/i), 'test@example.com')
  await userEvent.type(screen.getByLabelText(/^password:$/i), 'password123')
  await userEvent.click(screen.getByRole('button', { name: /^ok$/i }))
}

const countCalls = (url) =>
  mockAxios.get.mock.calls.filter(([calledUrl]) => calledUrl === url).length

afterEach(() => {
  mockAxios.reset()
})

describe('data fetching', () => {
  test('fetches notifications when the App loads', async () => {
    render(<App />)
    expect(mockAxios.get).toHaveBeenCalledWith(NOTIFICATIONS_URL)

    await respond(NOTIFICATIONS_URL, notificationsData)
    await respond(COURSES_URL, coursesData)

    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText(/^new course available$/i)).toBeInTheDocument()
    expect(screen.getByText(/^new resume available$/i)).toBeInTheDocument()
  })

  test('shows "No new notification for now" before the data arrives', () => {
    render(<App />)
    expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument()
  })

  test('fetches courses again whenever the user state changes', async () => {
    await renderApp()
    expect(countCalls(COURSES_URL)).toBe(1)

    await logInThroughForm()
    expect(countCalls(COURSES_URL)).toBe(2)
    await respond(COURSES_URL, coursesData)

    expect(screen.getByRole('heading', { level: 2, name: /^course list$/i })).toBeInTheDocument()
    expect(screen.getByText('ES6')).toBeInTheDocument()
    expect(screen.getByText('Webpack')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('link', { name: /logout/i }))
    expect(countCalls(COURSES_URL)).toBe(3)
    await respond(COURSES_URL, coursesData)
  })

  test('keeps working when the notifications request fails', async () => {
    render(<App />)
    await act(async () => {
      mockAxios.mockError(new Error('Network error'), mockAxios.getReqByUrl(NOTIFICATIONS_URL))
    })
    await respond(COURSES_URL, coursesData)
    expect(screen.getByText(/no new notification for now/i)).toBeInTheDocument()
  })

  test('deleted notifications stay deleted through login and logout', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    await renderApp()

    await userEvent.click(screen.getByText(/^new course available$/i))
    expect(screen.getAllByRole('listitem')).toHaveLength(2)

    await logInThroughForm()
    await respond(COURSES_URL, coursesData)
    await userEvent.click(screen.getByRole('link', { name: /logout/i }))
    await respond(COURSES_URL, coursesData)

    expect(countCalls(NOTIFICATIONS_URL)).toBe(1)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByText(/^new course available$/i)).not.toBeInTheDocument()
    logSpy.mockRestore()
  })
})

test('renders the h1 with text School Dashboard', async () => {
  await renderApp()
  expect(screen.getByRole('heading', { level: 1, name: /^school dashboard$/i })).toBeInTheDocument()
})

test('renders login and copyright paragraph with the correct content', async () => {
  await renderApp()
  expect(screen.getByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
  expect(screen.getByText(/^copyright/i)).toBeInTheDocument()
})

test('renders an img element', async () => {
  await renderApp()
  expect(screen.getByAltText(/^holberton logo$/i)).toBeInTheDocument()
})

test('renders email input, password input and their labels', async () => {
  await renderApp()
  expect(screen.getByRole('textbox', { name: /^email:$/i })).toBeInTheDocument()
  expect(screen.getByLabelText(/^password:$/i)).toBeInTheDocument()
  expect(screen.getByText(/^email:$/i)).toBeInTheDocument()
  expect(screen.getByText(/^password:$/i)).toBeInTheDocument()
})

test('renders a button with text OK', async () => {
  await renderApp()
  expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
})

test('displays the News from the School title and paragraph by default', async () => {
  await renderApp()
  expect(screen.getByRole('heading', { level: 2, name: /^news from the school$/i })).toBeInTheDocument()
  expect(screen.getByText(/^holberton school news goes here$/i)).toBeInTheDocument()
})

describe('notifications drawer', () => {
  test('is displayed by default', async () => {
    await renderApp()
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument()
  })

  test('handleHideDrawer hides the drawer', async () => {
    await renderApp()
    await userEvent.click(screen.getByLabelText(/close/i))
    expect(screen.queryByText(/here is the list of notifications/i)).not.toBeInTheDocument()
  })

  test('handleDisplayDrawer shows the drawer again', async () => {
    await renderApp()
    await userEvent.click(screen.getByLabelText(/close/i))
    await userEvent.click(screen.getByText(/your notifications/i))
    expect(screen.getByText(/here is the list of notifications/i)).toBeInTheDocument()
  })
})

describe('logIn and logOut', () => {
  test('logIn updates email, password and isLoggedIn', async () => {
    const { container } = await renderApp()
    expect(container.querySelector('#logoutSection')).toBeNull()

    await logInThroughForm()
    await respond(COURSES_URL, coursesData)

    expect(screen.getByRole('heading', { level: 2, name: /^course list$/i })).toBeInTheDocument()
    expect(screen.queryByText(/^login to access the full dashboard$/i)).not.toBeInTheDocument()
    expect(container.querySelector('#logoutSection')).toHaveTextContent(/welcome test@example\.com/i)
    expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument()
  })

  test('logOut sets isLoggedIn to false and clears email and password', async () => {
    const { container } = await renderApp()
    await logInThroughForm()
    await respond(COURSES_URL, coursesData)

    await userEvent.click(screen.getByRole('link', { name: /logout/i }))
    await respond(COURSES_URL, coursesData)

    expect(screen.getByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
    expect(container.querySelector('#logoutSection')).toBeNull()
    expect(screen.queryByRole('link', { name: /contact us/i })).not.toBeInTheDocument()
    expect(screen.getByLabelText(/^email:$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^password:$/i)).toHaveValue('')
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
    await renderApp()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)

    await userEvent.click(screen.getByText(/^new course available$/i))

    expect(logSpy).toHaveBeenCalledWith('Notification 1 has been marked as read')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.queryByText(/^new course available$/i)).not.toBeInTheDocument()
  })
})
