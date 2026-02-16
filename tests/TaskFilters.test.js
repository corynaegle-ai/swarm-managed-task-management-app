import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskFilters from '../components/TaskFilters';

describe('TaskFilters', () => {
  const mockOnPriorityFilter = jest.fn();
  const mockOnStatusFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders priority filter buttons', () => {
    render(
      <TaskFilters 
        onPriorityFilter={mockOnPriorityFilter}
        onStatusFilter={mockOnStatusFilter}
      />
    );

    expect(screen.getByText('All Priorities')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  test('calls onPriorityFilter when priority button is clicked', () => {
    render(
      <TaskFilters 
        onPriorityFilter={mockOnPriorityFilter}
        onStatusFilter={mockOnStatusFilter}
      />
    );

    fireEvent.click(screen.getByText('High'));
    expect(mockOnPriorityFilter).toHaveBeenCalledWith('High');
  });

  test('clears priority filter when All Priorities is clicked', () => {
    render(
      <TaskFilters 
        onPriorityFilter={mockOnPriorityFilter}
        onStatusFilter={mockOnStatusFilter}
      />
    );

    fireEvent.click(screen.getByText('All Priorities'));
    expect(mockOnPriorityFilter).toHaveBeenCalledWith(null);
  });

  test('applies active class to selected priority button', () => {
    render(
      <TaskFilters 
        onPriorityFilter={mockOnPriorityFilter}
        onStatusFilter={mockOnStatusFilter}
      />
    );

    const highButton = screen.getByText('High');
    fireEvent.click(highButton);
    
    expect(highButton).toHaveClass('active');
  });
});