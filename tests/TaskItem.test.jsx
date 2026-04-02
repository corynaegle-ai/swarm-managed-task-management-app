import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskItem from '../components/TaskItem';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  priority: 'high',
  completed: false
};

describe('TaskItem', () => {
  test('renders task with priority badge', () => {
    render(<TaskItem task={mockTask} onToggle={() => {}} onDelete={() => {}} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  test('displays priority badge with correct color for different priorities', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' };
    const { rerender } = render(
      <TaskItem task={highPriorityTask} onToggle={() => {}} onDelete={() => {}} />
    );
    
    expect(screen.getByText('High')).toHaveClass('priority-high');
    
    const mediumPriorityTask = { ...mockTask, priority: 'medium' };
    rerender(<TaskItem task={mediumPriorityTask} onToggle={() => {}} onDelete={() => {}} />);
    
    expect(screen.getByText('Medium')).toHaveClass('priority-medium');
    
    const lowPriorityTask = { ...mockTask, priority: 'low' };
    rerender(<TaskItem task={lowPriorityTask} onToggle={() => {}} onDelete={() => {}} />);
    
    expect(screen.getByText('Low')).toHaveClass('priority-low');
  });
});