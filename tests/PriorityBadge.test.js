import React from 'react';
import { render, screen } from '@testing-library/react';
import PriorityBadge from '../components/PriorityBadge';

describe('PriorityBadge', () => {
  it('renders priority text with correct CSS class', () => {
    render(<PriorityBadge priority="high" />);
    const badge = screen.getByText('high');
    expect(badge).toHaveClass('priority-badge', 'priority-high');
  });

  it('applies custom className', () => {
    render(<PriorityBadge priority="medium" className="custom-class" />);
    const badge = screen.getByText('medium');
    expect(badge).toHaveClass('priority-badge', 'priority-medium', 'custom-class');
  });
});