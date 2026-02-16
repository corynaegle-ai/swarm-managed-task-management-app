import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Test description 1',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Test description 2',
    status: 'completed'
  }
];

describe('TaskList Component', () => {
  test('renders without errors', () => {
    render(<TaskList tasks={mockTasks} />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  test('renders tasks correctly', () => {
    render(<TaskList tasks={mockTasks} />);
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  test('handles empty task list', () => {
    render(<TaskList tasks={[]} />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });
});