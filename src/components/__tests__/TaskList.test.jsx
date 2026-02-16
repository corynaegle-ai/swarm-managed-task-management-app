import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList';

describe('TaskList Component', () => {
  test('renders empty state when no tasks provided', () => {
    render(<TaskList />);
    expect(screen.getByText('No tasks available. Start by adding your first task!')).toBeInTheDocument();
  });

  test('renders empty state when tasks array is empty', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText('No tasks available. Start by adding your first task!')).toBeInTheDocument();
  });

  test('maps through tasks array when provided', () => {
    const mockTasks = [
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' },
      { id: 3, name: 'Task 3' }
    ];
    
    render(<TaskList tasks={mockTasks} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  test('renders basic container structure', () => {
    const { container } = render(<TaskList tasks={[]} />);
    expect(container.querySelector('.task-list-container')).toBeInTheDocument();
  });

  test('handles tasks without id using index as key', () => {
    const mockTasks = [
      { title: 'Task without ID' }
    ];
    
    render(<TaskList tasks={mockTasks} />);
    expect(screen.getByText('Task without ID')).toBeInTheDocument();
  });
});