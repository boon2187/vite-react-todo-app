import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo } from '../Todo';

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
    render(<Todo {...todoProps} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('calls toggleComplete when task text is clicked', () => {
    render(<Todo {...todoProps} />);
    fireEvent.click(screen.getByText('Test Task'));
    expect(mockToggleComplete).toHaveBeenCalledWith('1');
  });

  test('calls editTodo when edit button is clicked', () => {
    render(<Todo {...todoProps} />);
    fireEvent.click(screen.getByLabelText('Edit Todo'));
    expect(mockEditTodo).toHaveBeenCalledWith('1');
  });

  test('calls deleteTodo when delete button is clicked', () => {
    render(<Todo {...todoProps} />);
    fireEvent.click(screen.getByLabelText('Delete Todo'));
    expect(mockDeleteTodo).toHaveBeenCalledWith('1');
  });

  test('空のタスクで更新しようとするとWarning!のモーダルが表示される', () => {
    render(<Todo {...todoProps} />);

    // 編集ボタンをクリック
    fireEvent.click(screen.getByLabelText('Edit Todo'));

    // 入力フィールドをクリア
    const input = screen.getByText('Test Task');
    fireEvent.change(input, { target: { value: '' } });

    // Update Taskボタンをクリック
    const updateButton = screen.getByText('Update Task');
    fireEvent.click(updateButton);

    // Warning!のモーダルが表示されることを確認
    expect(screen.getByText('Warning!')).toBeInTheDocument();
  });
});
