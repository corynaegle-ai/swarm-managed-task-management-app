import React from 'react';
import { render, screen } from '@testing-library/react';
import PriorityBadge from '../components/PriorityBadge';

describe('PriorityBadge', () => {
  test('displays high priority with red indicator', () => {
    render(<PriorityBadge priority="high" />);
    const badge = screen.getByText('High');
    expect(badge).toHaveClass('priority-badge', 'priority-high');
  });

  test('displays medium priority with orange indicator', () => {
    render(<PriorityBadge priority="medium" />);
    const badge = screen.getByText('Medium');
    expect(badge).toHaveClass('priority-badge', 'priority-medium');
  });

  test('displays low priority with gray indicator', () => {
    render(<PriorityBadge priority="low" />);
    const badge = screen.getByText('Low');
    expect(badge).toHaveClass('priority-badge', 'priority-low');
  });

  test('defaults to low priority when no priority provided', () => {
    render(<PriorityBadge />);
    const badge = screen.getByText('Low');
    expect(badge).toHaveClass('priority-badge', 'priority-low');
  });
});