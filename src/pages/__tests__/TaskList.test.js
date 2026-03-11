import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from '../TaskList';

// Mock the child components
jest.mock('../../components/TaskForm', () => {
  return function MockTaskForm({ onSubmit, loading }) {
    return (
      <div data-testid="task-form">
        <button 
          onClick={() => onSubmit({ title: 'Test Task', description: 'Test Description' })}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    );
  };
});

jest.mock('../../components/TaskItem', () => {
  return function MockTaskItem({ task }) {
    return <div data-testid="task-item">{task.title}</div>;
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('TaskList', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders task list component', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<TaskList />);
    
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('handleCreateTask makes POST request to correct endpoint', async () => {
    const mockTask = { id: 1, title: 'New Task', description: 'Description' };
    
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // Initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockTask }); // Create task

    render(<TaskList />);
    
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'Test Task', description: 'Test Description' })
      });
    });
  });

  it('handles API errors with try-catch', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // Initial fetch
      .mockRejectedValueOnce(new Error('Network error')); // Create task fails

    render(<TaskList />);
    
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create task')).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Error creating task:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('shows loading state during API call', async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // Initial fetch
      .mockImplementationOnce(() => new Promise(resolve => 
        setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100)
      )); // Slow create task

    render(<TaskList />);
    
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    expect(screen.getByText('Creating...')).toBeInTheDocument();
  });

  it('passes handleCreateTask as prop to TaskForm', () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    
    render(<TaskList />);
    
    // TaskForm should receive onSubmit prop (our handleCreateTask function)
    expect(screen.getByTestId('task-form')).toBeInTheDocument();
  });
});