import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from './TaskItem';
import { useTaskUpdate } from '../hooks/useTasks';

// Mock the useTaskUpdate hook
jest.mock('../hooks/useTasks', () => ({
  useTaskUpdate: jest.fn()
}));

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test description',
  status: 'todo',
  priority: 'high'
};

const mockOnUpdate = jest.fn();

describe('TaskItem', () => {
  const mockUpdateTask = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    useTaskUpdate.mockReturnValue({
      updateTask: mockUpdateTask,
      isLoading: false,
      error: null,
      clearError: mockClearError
    });
    jest.clearAllMocks();
  });

  test('renders task in view mode by default', () => {
    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  test('shows loading spinner during save operations', async () => {
    useTaskUpdate.mockReturnValue({
      updateTask: mockUpdateTask,
      isLoading: true,
      error: null,
      clearError: mockClearError
    });

    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeDisabled();
  });

  test('displays error toast when save fails', async () => {
    const mockError = new Error('Save failed');
    useTaskUpdate.mockReturnValue({
      updateTask: mockUpdateTask.mockRejectedValue(mockError),
      isLoading: false,
      error: mockError,
      clearError: mockClearError
    });

    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit'));
    
    // Trigger save
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Save failed')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  test('retry functionality works correctly', async () => {
    const mockError = new Error('Save failed');
    useTaskUpdate.mockReturnValue({
      updateTask: mockUpdateTask,
      isLoading: false,
      error: mockError,
      clearError: mockClearError
    });

    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    // Simulate error state by showing error toast
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
    
    // Click retry
    fireEvent.click(screen.getByText('Retry'));
    
    expect(mockClearError).toHaveBeenCalled();
    expect(mockUpdateTask).toHaveBeenCalled();
  });

  test('clears error state when starting new save attempt', async () => {
    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit'));
    
    // Change title and save
    fireEvent.change(screen.getByLabelText('Title:'), {
      target: { value: 'Updated Task' }
    });
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockClearError).toHaveBeenCalled();
  });

  test('shows saving text and spinner during save', () => {
    useTaskUpdate.mockReturnValue({
      updateTask: mockUpdateTask,
      isLoading: true,
      error: null,
      clearError: mockClearError
    });

    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    // Enter edit mode
    fireEvent.click(screen.getByText('Edit'));
    
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});