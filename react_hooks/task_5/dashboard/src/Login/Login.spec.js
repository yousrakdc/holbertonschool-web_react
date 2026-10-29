import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

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

describe('Login form validation (useLogin)', () => {
  const fillForm = async (email, password) => {
    if (email) {
      await userEvent.type(screen.getByLabelText(/^email:$/i), email);
    }
    if (password) {
      await userEvent.type(screen.getByLabelText(/^password:$/i), password);
    }
  };

  test('the submit button is disabled by default', () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled();
  });

  test('stays disabled with an invalid email', async () => {
    render(<Login />);
    await fillForm('not-an-email', 'password123');
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled();
  });

  test('stays disabled with a password shorter than 8 characters', async () => {
    render(<Login />);
    await fillForm('test@example.com', 'short');
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled();
  });

  test('becomes enabled with a valid email and a password of 8+ characters', async () => {
    render(<Login />);
    await fillForm('test@example.com', 'password123');
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeEnabled();
  });

  test('becomes disabled again if the input becomes invalid', async () => {
    render(<Login />);
    await fillForm('test@example.com', 'password123');
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeEnabled();

    await userEvent.clear(screen.getByLabelText(/^password:$/i));
    await userEvent.type(screen.getByLabelText(/^password:$/i), 'short');
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeDisabled();
  });

  test('inputs are controlled and reflect typed values', async () => {
    render(<Login />);
    await fillForm('test@example.com', 'password123');
    expect(screen.getByLabelText(/^email:$/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/^password:$/i)).toHaveValue('password123');
  });

  test('calls logIn with email and password on submit', async () => {
    const logIn = jest.fn();
    render(<Login logIn={logIn} />);
    await fillForm('test@example.com', 'password123');
    await userEvent.click(screen.getByRole('button', { name: /^ok$/i }));
    expect(logIn).toHaveBeenCalledTimes(1);
    expect(logIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  test('does not call logIn when the form is invalid', async () => {
    const logIn = jest.fn();
    render(<Login logIn={logIn} />);
    await fillForm('bad-email', 'short');
    await userEvent.click(screen.getByRole('button', { name: /^ok$/i }));
    expect(logIn).not.toHaveBeenCalled();
  });
});
