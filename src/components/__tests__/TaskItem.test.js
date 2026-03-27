import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../TaskItem';

const mockTask = {
  id: 1,
  title: 'Test Task',
  dueDate: '2024-01-15',
  priority: 'high'
};

const mockOnUpdateTask = jest.fn();

describe('TaskItem', () => {
  beforeEach(() => {
    mockOnUpdateTask.mockClear();
  });

  test('renders task information', () => {
    render(<TaskItem task={mockTask} onUpdateTask={mockOnUpdateTask} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  test('enters edit mode when title is clicked', () => {
    render(<TaskItem task={mockTask} onUpdateTask={mockOnUpdateTask} />);
    
    fireEvent.click(screen.getByText('Test Task'));
    
    const input = screen.getByDisplayValue('Test Task');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  test('shows date picker when due date is clicked', () => {
    render(<TaskItem task={mockTask} onUpdateTask={mockOnUpdateTask} />);
    
    fireEvent.click(screen.getByText('2024-01-15'));
    
    const dateInput = screen.getByDisplayValue('2024-01-15');
    expect(dateInput).toBeInTheDocument();
    expect(dateInput.type).toBe('date');
  });

  test('shows dropdown when priority is clicked', () => {
    render(<TaskItem task={mockTask} onUpdateTask={mockOnUpdateTask} />);
    
    fireEvent.click(screen.getByText('high'));
    
    const select = screen.getByDisplayValue('high');
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe('SELECT');
  });

  test('saves changes on Enter key press', () => {
    render(<TaskItem task={mockTask} onUpdateTask={mockOnUpdateTask} />);
    
    fireEvent.click(screen.getByText('Test Task'));
    const input = screen.getByDisplayValue('Test Task');
    
    fireEvent.change(input, { target: { value: 'Updated Task' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockOnUpdateTask).toHaveBeenCalledWith({
      ...mockTask,
      title: 'Updated Task'
    });
  });

  test('cancels changes on Escape key press', () => {
    render(<TaskItem task={mockTask} onUpdateTask={mockOnUpdateTask} />);
    
    fireEvent.click(screen.getByText('Test Task'));
    const input = screen.getByDisplayValue('Test Task');
    
    fireEvent.change(input, { target: { value: 'Updated Task' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    
    expect(mockOnUpdateTask).not.toHaveBeenCalled();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});