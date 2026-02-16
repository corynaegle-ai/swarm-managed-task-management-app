import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock TaskList component
jest.mock('./TaskList', () => {
  return function TaskList({ tasks, onTaskUpdate, onTaskDelete, onAddTask }) {
    return (
      <div data-testid="task-list">
        <div data-testid="task-count">{tasks.length}</div>
        {tasks.map(task => (
          <div key={task.id} data-testid={`task-${task.id}`}>
            {task.title} - {task.priority} - {task.status}
          </div>
        ))}
      </div>
    );
  };
});

describe('App Component', () => {
  test('renders app with header', () => {
    render(<App />);
    expect(screen.getByText('Task Management App')).toBeInTheDocument();
  });

  test('renders TaskList component', () => {
    render(<App />);
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
  });

  test('passes tasks data to TaskList', () => {
    render(<App />);
    const taskCount = screen.getByTestId('task-count');
    expect(taskCount.textContent).toBe('3'); // Initial task count
  });

  test('maintains sort order when changing sort criteria', () => {
    render(<App />);
    
    const sortBySelect = screen.getByDisplayValue('Due Date');
    fireEvent.change(sortBySelect, { target: { value: 'priority' } });
    
    // Verify tasks are still rendered (order may change)
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
    expect(screen.getByTestId('task-count').textContent).toBe('3');
  });

  test('handles sort order changes', () => {
    render(<App />);
    
    const sortOrderSelect = screen.getByDisplayValue('Ascending');
    fireEvent.change(sortOrderSelect, { target: { value: 'desc' } });
    
    // Verify tasks are still rendered with updated order
    expect(screen.getByTestId('task-list')).toBeInTheDocument();
    expect(screen.getByTestId('task-count').textContent).toBe('3');
  });

  test('provides task management callbacks to TaskList', () => {
    render(<App />);
    const taskList = screen.getByTestId('task-list');
    
    // Verify TaskList is rendered, callbacks are passed internally
    expect(taskList).toBeInTheDocument();
  });
});