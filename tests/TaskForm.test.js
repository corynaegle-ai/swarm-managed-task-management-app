import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('displays priority dropdown selector', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const prioritySelect = screen.getByLabelText('Priority');
    expect(prioritySelect).toBeInTheDocument();
    expect(prioritySelect).toHaveValue('medium');
  });

  test('priority dropdown allows selecting high/medium/low values', () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const prioritySelect = screen.getByLabelText('Priority');
    
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    expect(prioritySelect).toHaveValue('high');
    
    fireEvent.change(prioritySelect, { target: { value: 'low' } });
    expect(prioritySelect).toHaveValue('low');
    
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });
    expect(prioritySelect).toHaveValue('medium');
  });

  test('new tasks can be created with selected priority', async () => {
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const titleInput = screen.getByLabelText('Title *');
    const prioritySelect = screen.getByLabelText('Priority');
    const submitButton = screen.getByRole('button', { name: 'Create Task' });
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Task',
          priority: 'high'
        })
      );
    });
  });

  test('form validation requires title', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: 'Create Task' });
    fireEvent.click(submitButton);
    
    expect(alertSpy).toHaveBeenCalledWith('Title is required');
    expect(mockOnSubmit).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });
});