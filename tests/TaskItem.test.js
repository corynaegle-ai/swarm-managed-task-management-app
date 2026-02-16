import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../components/TaskItem';

describe('TaskItem', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false
  };

  const mockOnDelete = jest.fn();
  const mockOnToggleComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task item with delete button', () => {
    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete Test Task')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const deleteButton = screen.getByLabelText('Delete Test Task');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('delete button is accessible with proper ARIA labels', () => {
    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const deleteButton = screen.getByLabelText('Delete Test Task');
    expect(deleteButton).toHaveAttribute('aria-label', 'Delete Test Task');
    expect(deleteButton).toHaveAttribute('title', 'Delete task');
  });

  it('renders trash icon in delete button', () => {
    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const trashIcon = screen.getByLabelText('Delete Test Task').querySelector('svg');
    expect(trashIcon).toBeInTheDocument();
    expect(trashIcon).toHaveClass('trash-icon');
  });

  it('delete button has proper styling classes', () => {
    render(
      <TaskItem
        task={mockTask}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const deleteButton = screen.getByLabelText('Delete Test Task');
    expect(deleteButton).toHaveClass('task-action-button', 'delete-button');
  });
});