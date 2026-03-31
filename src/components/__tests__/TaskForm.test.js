import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('renders form with all required fields', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  test('shows validation error for empty title', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('priority defaults to medium', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const prioritySelect = screen.getByLabelText(/priority/i);
    expect(prioritySelect.value).toBe('medium');
  });

  test('submits form with valid data', async () => {
    mockOnSubmit.mockResolvedValue();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const dueDateInput = screen.getByLabelText(/due date/i);
    const prioritySelect = screen.getByLabelText(/priority/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(dueDateInput, { target: { value: '2023-12-31' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Task',
        dueDate: '2023-12-31',
        priority: 'high'
      });
    });
  });

  test('resets form after successful submission', async () => {
    mockOnSubmit.mockResolvedValue();
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const dueDateInput = screen.getByLabelText(/due date/i);
    const prioritySelect = screen.getByLabelText(/priority/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(dueDateInput, { target: { value: '2023-12-31' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(dueDateInput.value).toBe('');
      expect(prioritySelect.value).toBe('medium');
    });
  });

  test('clears validation errors when user starts typing', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
    
    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: 'T' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });
});