import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TaskItem from '../components/TaskItem';
import tasksSlice, { deleteTaskAsync } from '../store/tasksSlice';

// Mock the task service
jest.mock('../services/taskService', () => ({
  taskService: {
    deleteTask: jest.fn()
  }
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      tasks: tasksSlice
    },
    preloadedState: {
      tasks: {
        items: [],
        loading: false,
        error: null,
        deletingTasks: {},
        deleteErrors: {},
        ...initialState.tasks
      }
    }
  });
};

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'high'
};

describe('TaskItem', () => {
  it('renders task information correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <TaskItem task={mockTask} />
      </Provider>
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('shows delete confirmation dialog when delete button is clicked', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <TaskItem task={mockTask} />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete "Test Task"?')).toBeInTheDocument();
  });

  it('shows loading state during deletion', () => {
    const store = createMockStore({
      tasks: {
        deletingTasks: { '1': true }
      }
    });
    
    render(
      <Provider store={store}>
        <TaskItem task={mockTask} />
      </Provider>
    );
    
    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('shows error message when deletion fails', () => {
    const store = createMockStore({
      tasks: {
        deleteErrors: { '1': 'Failed to delete task' }
      }
    });
    
    render(
      <Provider store={store}>
        <TaskItem task={mockTask} />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Error: Failed to delete task')).toBeInTheDocument();
  });
});