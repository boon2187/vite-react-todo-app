import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TodoForm } from '../TodoForm';

describe('TodoForm Component', () => {
  test('renders input and submit button', () => {
    render(<TodoForm addTodo={jest.fn()} />);
    expect(
      screen.getByPlaceholderText('What is the task today?'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Task' }),
    ).toBeInTheDocument();
  });

  test('calls addTodo with entered value on submit', async () => {
    const user = userEvent.setup();
    const mockAddTodo = jest.fn();
    render(<TodoForm addTodo={mockAddTodo} />);

    await user.type(
      screen.getByPlaceholderText('What is the task today?'),
      'Buy milk',
    );
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(mockAddTodo).toHaveBeenCalledWith('Buy milk');
  });

  test('does not call addTodo when submitting empty input', async () => {
    const user = userEvent.setup();
    const mockAddTodo = jest.fn();
    render(<TodoForm addTodo={mockAddTodo} />);

    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  test('clears input after successful submit', async () => {
    const user = userEvent.setup();
    render(<TodoForm addTodo={jest.fn()} />);

    const input = screen.getByPlaceholderText(
      'What is the task today?',
    ) as HTMLInputElement;
    await user.type(input, 'Buy milk');
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(input.value).toBe('');
  });
});
