import { render, screen, fireEvent } from '@testing-library/react'
import App from './App.jsx'

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

describe('logOut with ctrl + h', () => {
    let alertSpy

    beforeEach(() => {
        alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    })

    afterEach(() => {
        alertSpy.mockRestore()
    })

    test('calls logOut once when ctrl and h are pressed', () => {
        const logOut = jest.fn()
        render(<App logOut={logOut} />)

        fireEvent.keyDown(document, { key: 'h', ctrlKey: true })

        expect(logOut).toHaveBeenCalledTimes(1)
    })

    test('calls alert with "Logging you out" when ctrl and h are pressed', () => {
        render(<App />)

        fireEvent.keyDown(document, { key: 'h', ctrlKey: true })

        expect(alertSpy).toHaveBeenCalledWith('Logging you out')
    })
})
