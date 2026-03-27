import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../components/TaskItem';

describe('TaskItem', () => {
  const mockTask = {
    id: 1,
    text: 'Test task',
    completed: false
  };

  const mockOnToggleComplete = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task with correct text', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  test('applies completed class when task is completed', () => {
    const completedTask = { ...mockTask, completed: true };
    
    render(
      <TaskItem 
        task={completedTask} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    
    const taskItem = screen.getByText('Test task').closest('.task-item');
    expect(taskItem).toHaveClass('task-completed');
  });

  test('checkbox shows checked state for completed tasks', () => {
    const completedTask = { ...mockTask, completed: true };
    
    render(
      <TaskItem 
        task={completedTask} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('checked');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  test('checkbox toggles task completion on click', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockOnToggleComplete).toHaveBeenCalledWith(1);
  });

  test('checkbox toggles task completion on keyboard interaction', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.keyPress(checkbox, { key: 'Enter' });
    
    expect(mockOnToggleComplete).toHaveBeenCalledWith(1);
  });

  test('has proper accessibility attributes', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onToggleComplete={mockOnToggleComplete}
        onDelete={mockOnDelete}
      />
    );
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('tabIndex', '0');
    expect(checkbox).toHaveAttribute('aria-label');
  });
});