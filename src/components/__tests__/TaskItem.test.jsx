import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '../TaskItem';
import * as taskApi from '../../utils/taskApi';

// Mock the task API
jest.mock('../../utils/taskApi');

describe('TaskItem Auto-save Functionality', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task'
  };

  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    taskApi.updateTask.mockResolvedValue({ success: true });
  });

  test('saves task automatically when input loses focus', async () => {
    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    const input = screen.getByDisplayValue('Test Task');
    
    // Change the input value
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Task');
    
    // Blur the input
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(taskApi.updateTask).toHaveBeenCalledWith('1', { title: 'Updated Task' });
    });
  });

  test('saves task automatically when Enter key is pressed', async () => {
    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    const input = screen.getByDisplayValue('Test Task');
    
    // Change the input value and press Enter
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated Task{enter}');
    
    await waitFor(() => {
      expect(taskApi.updateTask).toHaveBeenCalledWith('1', { title: 'Updated Task' });
    });
  });

  test('debounces rapid typing to prevent excessive API calls', async () => {
    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    const input = screen.getByDisplayValue('Test Task');
    
    // Type rapidly
    await userEvent.clear(input);
    await userEvent.type(input, 'A');
    await userEvent.type(input, 'B');
    await userEvent.type(input, 'C');
    
    // Wait for debounce delay (500ms)
    await waitFor(() => {
      expect(taskApi.updateTask).toHaveBeenCalledTimes(1);
      expect(taskApi.updateTask).toHaveBeenCalledWith('1', { title: 'ABC' });
    }, { timeout: 1000 });
  });

  test('clears debounce timeout on blur to prevent duplicate saves', async () => {
    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    const input = screen.getByDisplayValue('Test Task');
    
    // Start typing (triggers debounce)
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated');
    
    // Immediately blur (should cancel debounce and save immediately)
    fireEvent.blur(input);
    
    // Wait a bit longer than debounce delay
    await waitFor(() => {
      expect(taskApi.updateTask).toHaveBeenCalledTimes(1);
    }, { timeout: 1000 });
  });

  test('clears debounce timeout on Enter to prevent duplicate saves', async () => {
    render(<TaskItem task={mockTask} onUpdate={mockOnUpdate} />);
    
    const input = screen.getByDisplayValue('Test Task');
    
    // Start typing (triggers debounce)
    await userEvent.clear(input);
    await userEvent.type(input, 'Updated');
    
    // Immediately press Enter (should cancel debounce and save immediately)
    await userEvent.keyboard('{enter}');
    
    // Wait a bit longer than debounce delay
    await waitFor(() => {
      expect(taskApi.updateTask).toHaveBeenCalledTimes(1);
    }, { timeout: 1000 });
  });
});