import { render, screen } from '@testing-library/react'
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
