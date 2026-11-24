import { render, screen, fireEvent } from '@testing-library/react';
import NotificationItem from './NotificationItem';

function renderItem(props) {
  render(
    <ul>
      <NotificationItem markAsRead={() => {}} {...props} />
    </ul>
  );
  return screen.getByRole('listitem');
}

test('a default notification is displayed in blue', () => {
  const item = renderItem({ id: 'a1', type: 'default', value: 'Default notif' });

  expect(item).toHaveTextContent('Default notif');
  expect(item.style.color).toBe('blue');
  expect(item).toHaveAttribute('data-notification-type', 'default');
});

test('an urgent notification is displayed in red', () => {
  const item = renderItem({ id: 'a2', type: 'urgent', value: 'Urgent notif' });

  expect(item).toHaveTextContent('Urgent notif');
  expect(item.style.color).toBe('red');
  expect(item).toHaveAttribute('data-notification-type', 'urgent');
});

test('clicking the item calls markAsRead with its id', () => {
  const markAsRead = jest.fn();
  const item = renderItem({ id: 'a3', type: 'default', value: 'Click me', markAsRead });

  fireEvent.click(item);

  expect(markAsRead).toHaveBeenCalledWith('a3');
});
