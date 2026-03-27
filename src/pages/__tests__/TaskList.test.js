import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../TaskList';

// Mock TaskForm component
jest.mock('../../components/TaskForm', () => {
  return function MockTaskForm({ onTaskCreated }) {
    return (
      <div data-testid="task-form">
        <button onClick={() => onTaskCreated({ id: 1, title: 'Test Task' })}>
          Create Task
        </button>
      </div>
    );
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('TaskList', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders TaskForm component above task list', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<TaskList />);
    
    // Check that TaskForm is rendered
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
    
    // Check that TaskForm appears before the task list section
    const taskForm = screen.getByTestId('task-form');
    const taskListSection = screen.getByText('Your Tasks');
    
    expect(taskForm.compareDocumentPosition(taskListSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('imports and renders TaskForm component correctly', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<TaskList />);
    
    // Verify TaskForm is imported and rendered
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
  });

  it('maintains page layout with form positioned correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, title: 'Test Task', status: 'pending' }
      ]
    });

    render(<TaskList />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    
    // Check layout structure
    expect(screen.getByText('Task Management')).toBeInTheDocument(); // Page title
    expect(screen.getByTestId('task-form')).toBeInTheDocument(); // TaskForm
    expect(screen.getByText('Your Tasks')).toBeInTheDocument(); // Task list section
    expect(screen.getByText('Test Task')).toBeInTheDocument(); // Task item
  });
});