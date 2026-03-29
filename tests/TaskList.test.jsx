import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from '../components/TaskList';
import useTasks from '../hooks/useTasks';

// Mock the useTasks hook
jest.mock('../hooks/useTasks');

const mockTasks = [
  { id: 1, title: 'Task 1', description: 'Description 1', priority: 'High', status: 'Open' },
  { id: 2, title: 'Task 2', description: 'Description 2', priority: 'Low', status: 'Completed' },
  { id: 3, title: 'Task 3', description: 'Description 3', priority: 'Critical', status: 'In Progress' }
];

describe('TaskList', () => {
  beforeEach(() => {
    // Reset URL
    window.history.replaceState({}, '', '/');
    
    // Mock successful response by default
    useTasks.mockReturnValue({
      tasks: mockTasks,
      loading: false,
      error: null
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders task list with priority sort button', () => {
    render(<TaskList />);
    
    expect(screen.getByText('Task List')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sort by priority/i })).toBeInTheDocument();
  });

  test('sort button toggles between ascending and descending order', () => {
    render(<TaskList />);
    
    const sortButton = screen.getByRole('button', { name: /sort by priority/i });
    
    // Initially shows descending arrow
    expect(sortButton.textContent).toContain('↓');
    
    // Click to toggle
    fireEvent.click(sortButton);
    
    // Should now show ascending arrow
    expect(sortButton.textContent).toContain('↑');
  });

  test('updates URL parameters when sort order changes', async () => {
    render(<TaskList />);
    
    const sortButton = screen.getByRole('button', { name: /sort by priority/i });
    
    // Click to change sort order
    fireEvent.click(sortButton);
    
    await waitFor(() => {
      const urlParams = new URLSearchParams(window.location.search);
      expect(urlParams.get('sort')).toBe('priority');
      expect(urlParams.get('order')).toBe('asc');
    });
  });

  test('passes correct sort parameters to useTasks hook', () => {
    render(<TaskList />);
    
    expect(useTasks).toHaveBeenCalledWith({
      sort: 'priority',
      order: 'desc'
    });
    
    const sortButton = screen.getByRole('button', { name: /sort by priority/i });
    fireEvent.click(sortButton);
    
    expect(useTasks).toHaveBeenCalledWith({
      sort: 'priority',
      order: 'asc'
    });
  });

  test('initializes sort order from URL parameters', () => {
    // Set initial URL with ascending order
    window.history.replaceState({}, '', '/?sort=priority&order=asc');
    
    render(<TaskList />);
    
    const sortButton = screen.getByRole('button', { name: /sort by priority/i });
    expect(sortButton.textContent).toContain('↑');
  });

  test('displays loading state', () => {
    useTasks.mockReturnValue({
      tasks: [],
      loading: true,
      error: null
    });
    
    render(<TaskList />);
    
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  test('displays error state', () => {
    useTasks.mockReturnValue({
      tasks: [],
      loading: false,
      error: 'Failed to fetch tasks'
    });
    
    render(<TaskList />);
    
    expect(screen.getByText('Error loading tasks: Failed to fetch tasks')).toBeInTheDocument();
  });

  test('renders task items with priority and status information', () => {
    render(<TaskList />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Priority: High')).toBeInTheDocument();
    expect(screen.getByText('Status: Open')).toBeInTheDocument();
  });
});