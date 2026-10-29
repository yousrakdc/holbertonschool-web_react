import { render, screen } from '@testing-library/react';
import Login from './Login';
import userEvent from '@testing-library/user-event';

describe('Login component (checker)', () => {
  test('renders without crashing', () => {
    render(<Login />);
    expect(screen.getByText(/login to access the full dashboard/i)).toBeInTheDocument();
  });

  test('should render two inputs for login', () => {
    render(<Login />);
    const inputs = screen.getAllByRole('textbox');
    screen.getByLabelText(/password/i);
    expect(inputs.length + 1).toBe(2);
  });

  test('should render two label elements', () => {
    render(<Login />);
    expect(screen.getAllByText(/email|password/i)).toHaveLength(2);
  });

  test('should render one button', () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: /ok/i })).toBeInTheDocument();
  });

  test('clicking label focuses the input', async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.click(screen.getByText(/email/i));
    expect(emailInput).toHaveFocus();
    await userEvent.click(screen.getByText(/password/i));
    expect(passwordInput).toHaveFocus();
  });
});
