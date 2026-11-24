import { render, screen, fireEvent } from '@testing-library/react'
import NotificationItem from './NotificationItem'

test('calls markAsRead with the right id when clicked', () => {
  const markAsRead = jest.fn();
  render(<NotificationItem id={1} type="default" value="test" markAsRead={markAsRead} />);
  fireEvent.click(screen.getByRole('listitem'));
  expect(markAsRead).toHaveBeenCalledWith(1);
});
