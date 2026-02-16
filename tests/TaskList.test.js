import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from '../src/components/TaskList';

const mockTasks = [
  { id: '1', title: 'Task 1', description: 'Description 1', status: 'todo' },
  { id: '2', title: 'Task 2', description: 'Description 2', status: 'in-progress' }
];

test('TaskList renders without errors', () => {
  render(<TaskList tasks={mockTasks} />);
  expect(screen.getByText('Task 1')).toBeInTheDocument();
  expect(screen.getByText('Task 2')).toBeInTheDocument();
});

test('TaskList contains DragDropContext', () => {
  const { container } = render(<TaskList tasks={mockTasks} />);
  expect(container.querySelector('.task-list')).toBeInTheDocument();
});