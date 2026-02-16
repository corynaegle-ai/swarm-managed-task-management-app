import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../components/TaskList';
import useTasks from '../hooks/useTasks';

// Mock the useTasks hook
jest.mock('../hooks/useTasks');

describe('TaskList Component', () => {
  const mockTasks = [
    { id: 1, title: 'High Priority Task', priority: 'high', status: 'pending' },
    { id: 2, title: 'Medium Priority Task', priority: 'medium', status: 'in-progress' }
  ];

  beforeEach(() => {
    useTasks.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null
    });
  });

  test('renders TaskFilters component', () => {
    render(<TaskList />);
    expect(screen.getByText('Filter by Priority:')).toBeInTheDocument();
  });

  test('passes priority filter to useTasks hook', () => {
    render(<TaskList />);
    
    const prioritySelect = screen.getByLabelText('Filter by Priority:');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    
    expect(useTasks).toHaveBeenCalledWith({
      sort: 'priority',
      order: 'asc',
      priorityFilter: 'high'
    });
  });

  test('updates URL parameters when priority filter changes', () => {
    const mockReplaceState = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { replaceState: mockReplaceState },
      writable: true
    });
    
    render(<TaskList />);
    
    const prioritySelect = screen.getByLabelText('Filter by Priority:');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    
    expect(mockReplaceState).toHaveBeenCalledWith({}, '', '/?priority=high&order=asc');
  });
});