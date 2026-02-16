import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PrioritySelector from '../components/PrioritySelector';

describe('PrioritySelector', () => {
  it('renders dropdown with high/medium/low options', () => {
    render(<PrioritySelector value="" onChange={() => {}} />);
    const selector = screen.getByRole('combobox');
    expect(selector).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4); // Including "Select Priority"
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const mockOnChange = jest.fn();
    render(<PrioritySelector value="" onChange={mockOnChange} />);
    
    const selector = screen.getByRole('combobox');
    fireEvent.change(selector, { target: { value: 'high' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('high');
  });
});