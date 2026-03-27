import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../TaskList';

// Mock fetch
global.fetch = jest.fn();

describe('TaskList Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders task list with create form', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<TaskList />);
    
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Title *')).toBeInTheDocument();
  });

  test('creates new task and updates local state', async () => {
    const mockTasks = [];
    const newTask = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'pending',
      createdAt: '2023-01-01T00:00:00.000Z'
    };

    // Mock initial load
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks
    });

    // Mock task creation
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newTask
    });

    render(<TaskList />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'Test Task' }
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test Description' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Create Task'));

    // Wait for task to appear in list
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Tasks (1)')).toBeInTheDocument();
    });

    // Verify API was called correctly
    expect(fetch).toHaveBeenCalledWith('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        createdAt: expect.any(String)
      })
    });
  });

  test('displays error message on task creation failure', async () => {
    // Mock initial load
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    // Mock failed task creation
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<TaskList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'Test Task' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Create Task'));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to create task. Please try again.')).toBeInTheDocument();
    });

    // Verify error has alert role
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('clears error message when new task creation is attempted', async () => {
    // Mock initial load
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    // Mock failed task creation first
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<TaskList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    // Fill form and submit to get error
    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'Test Task' }
    });
    fireEvent.click(screen.getByText('Create Task'));

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText('Failed to create task. Please try again.')).toBeInTheDocument();
    });

    // Mock successful task creation
    const newTask = {
      id: '1',
      title: 'New Task',
      description: '',
      status: 'pending',
      createdAt: '2023-01-01T00:00:00.000Z'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newTask
    });

    // Change title and submit again
    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'New Task' }
    });
    fireEvent.click(screen.getByText('Create Task'));

    // Error should be cleared immediately when new attempt starts
    await waitFor(() => {
      expect(screen.queryByText('Failed to create task. Please try again.')).not.toBeInTheDocument();
    });
  });

  test('validates required title field', async () => {
    // Mock initial load
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<TaskList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    });

    // Submit form without title
    fireEvent.click(screen.getByText('Create Task'));

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Task title is required')).toBeInTheDocument();
    });

    // Verify no API call was made
    expect(fetch).toHaveBeenCalledTimes(1); // Only initial load
  });
});