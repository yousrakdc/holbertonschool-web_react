import { render, screen } from '@testing-library/react'
import App from './App.jsx'

test('renders the h1 with text School Dashboard', async () => {
    render(<App />)

    expect(screen.getByRole('heading', {level: 1, name: /^school dashboard$/i})).toBeInTheDocument()
})

test('renders login and copyright paragraph with the correct content', async () => {
    render(<App />)
    expect(screen.getByText(/^login to access the full dashboard$/i)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`^copyright ${new Date().getFullYear()} - holberton school$`, 'i')))
})

test('renders an img element', async () => {
    render(<App />)
    expect(screen.getByAltText(/^holberton logo$/i)).toBeInTheDocument()
})
