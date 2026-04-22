import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { EditTodoForm } from '../EditTodoForm';

describe('EditTodoForm Component', () => {
  const defaultProps = {
    id: '1',
    task: 'Original task',
    editTask: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders input prefilled with the current task', () => {
    render(<EditTodoForm {...defaultProps} />);
    expect(screen.getByDisplayValue('Original task')).toBeInTheDocument();
  });

  test('calls editTask with id and new value on submit', async () => {
    const user = userEvent.setup();
    const mockEditTask = jest.fn();
    render(<EditTodoForm {...defaultProps} editTask={mockEditTask} />);

    const input = screen.getByDisplayValue('Original task');
    await user.clear(input);
    await user.type(input, 'Updated task');
    await user.click(screen.getByRole('button', { name: 'Update Task' }));

    expect(mockEditTask).toHaveBeenCalledWith('1', 'Updated task');
  });

  test('opens warning modal and does not call editTask when submitting empty input', async () => {
    const user = userEvent.setup();
    const mockEditTask = jest.fn();
    render(<EditTodoForm {...defaultProps} editTask={mockEditTask} />);

    const input = screen.getByDisplayValue('Original task');
    await user.clear(input);
    await user.click(screen.getByRole('button', { name: 'Update Task' }));

    expect(await screen.findByText('Warning!')).toBeInTheDocument();
    expect(mockEditTask).not.toHaveBeenCalled();
  });

  test('closes warning modal when OK button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditTodoForm {...defaultProps} />);

    const input = screen.getByDisplayValue('Original task');
    await user.clear(input);
    await user.click(screen.getByRole('button', { name: 'Update Task' }));

    expect(await screen.findByText('Warning!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'OK' }));

    await waitFor(() => {
      expect(screen.queryByText('Warning!')).not.toBeInTheDocument();
    });
  });
});
