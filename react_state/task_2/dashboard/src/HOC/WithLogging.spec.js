import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import WithLogging from './WithLogging'

class MockApp extends React.Component {
  render() {
    return (
      <h1>
        Hello from Mock App Component
      </h1>
    )
  }
}

const MockAppWithLogging = WithLogging(MockApp)

describe('WithLogging HOC', () => {
  let consoleSpy

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    cleanup()
  })

  test('renders a heading with the text Hello from Mock App Component', () => {
    render(<MockAppWithLogging />)
    expect(screen.getByRole('heading', { level: 1, name: /^hello from mock app component$/i })).toBeInTheDocument()
  })

  test('logs when the wrapped component mounts and unmounts', () => {
    const { unmount } = render(<MockAppWithLogging />)
    expect(consoleSpy).toHaveBeenCalledWith('Component MockApp is mounted')

    unmount()
    expect(consoleSpy).toHaveBeenCalledWith('Component MockApp is going to unmount')
  })

  test('sets the displayName to WithLogging(NAME)', () => {
    expect(MockAppWithLogging.displayName).toBe('WithLogging(MockApp)')
  })

  test('defaults the name to Component when the wrapped element has none', () => {
    const Anonymous = WithLogging(() => <p>anonymous</p>)
    expect(Anonymous.displayName).toBe('WithLogging(Component)')
  })
})
