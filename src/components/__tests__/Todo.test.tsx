import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo } from '../Todo';
import { renderSortable } from './testUtils';

describe('Todo Component', () => {
  const mockToggleComplete = jest.fn();
  const mockDeleteTodo = jest.fn();
  const mockEditTodo = jest.fn();

  const todoProps = {
    id: '1',
    task: 'Test Task',
    completed: false,
    toggleComplete: mockToggleComplete,
    deleteTodo: mockDeleteTodo,
    editTodo: mockEditTodo,
  };

  test('renders task text', () => {
    renderSortable(<Todo {...todoProps} />, [todoProps.id]);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('calls toggleComplete when task text is clicked', () => {
    renderSortable(<Todo {...todoProps} />, [todoProps.id]);
    fireEvent.click(screen.getByText('Test Task'));
    expect(mockToggleComplete).toHaveBeenCalledWith('1');
  });

  test('calls editTodo when edit button is clicked', () => {
    renderSortable(<Todo {...todoProps} />, [todoProps.id]);
    fireEvent.click(screen.getByLabelText('Edit Todo'));
    expect(mockEditTodo).toHaveBeenCalledWith('1');
  });

  test('calls deleteTodo when delete button is clicked', () => {
    renderSortable(<Todo {...todoProps} />, [todoProps.id]);
    fireEvent.click(screen.getByLabelText('Delete Todo'));
    expect(mockDeleteTodo).toHaveBeenCalledWith('1');
  });

  test('renders a drag handle', () => {
    renderSortable(<Todo {...todoProps} />, [todoProps.id]);
    expect(screen.getByLabelText('Reorder Todo')).toBeInTheDocument();
  });
});
