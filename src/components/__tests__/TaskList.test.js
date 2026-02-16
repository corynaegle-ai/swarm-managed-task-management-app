import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskList from '../TaskList';
import { useTasks } from '../../hooks/useTasks';

// Mock the useTasks hook
jest.mock('../../hooks/useTasks');

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => {
    // Store onDragEnd for testing
    window.testOnDragEnd = onDragEnd;
    return <div data-testid="drag-drop-context">{children}</div>;
  },
  Droppable: ({ children }) => children({
    draggableProps: {},
    innerRef: jest.fn(),
  }, {}),
  Draggable: ({ children, index }) => children({
    draggableProps: {},
    dragHandleProps: {},
    innerRef: jest.fn(),
  }, {})
}));

const mockTasks = [
  { id: 1, title: 'Task 1', description: 'Description 1', status: 'pending' },
  { id: 2, title: 'Task 2', description: 'Description 2', status: 'completed' },
  { id: 3, title: 'Task 3', description: 'Description 3', status: 'in-progress' }
];

const mockUseTasks = {
  tasks: mockTasks,
  loading: false,
  error: null,
  reorderTasks: jest.fn()
};

describe('TaskList', () => {
  beforeEach(() => {
    useTasks.mockReturnValue(mockUseTasks);
    jest.clearAllMocks();
  });

  test('renders tasks correctly', () => {
    render(<TaskList />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  test('calls reorderTasks API when drag and drop occurs', async () => {
    const mockReorderTasks = jest.fn().mockResolvedValue();
    useTasks.mockReturnValue({
      ...mockUseTasks,
      reorderTasks: mockReorderTasks
    });

    render(<TaskList />);

    // Simulate drag and drop
    const dragResult = {
      destination: { droppableId: 'tasks', index: 2 },
      source: { droppableId: 'tasks', index: 0 },
      draggableId: '1'
    };

    await window.testOnDragEnd(dragResult);

    await waitFor(() => {
      expect(mockReorderTasks).toHaveBeenCalledWith([2, 3, 1]);
    });
  });

  test('shows loading state during reorder operation', async () => {
    const mockReorderTasks = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    useTasks.mockReturnValue({
      ...mockUseTasks,
      reorderTasks: mockReorderTasks
    });

    render(<TaskList />);

    const dragResult = {
      destination: { droppableId: 'tasks', index: 1 },
      source: { droppableId: 'tasks', index: 0 },
      draggableId: '1'
    };

    window.testOnDragEnd(dragResult);

    await waitFor(() => {
      expect(screen.getByText('Reordering tasks...')).toBeInTheDocument();
    });
  });

  test('displays error message when reorder fails', async () => {
    const mockReorderTasks = jest.fn().mockRejectedValue(new Error('API Error'));
    useTasks.mockReturnValue({
      ...mockUseTasks,
      reorderTasks: mockReorderTasks
    });

    render(<TaskList />);

    const dragResult = {
      destination: { droppableId: 'tasks', index: 1 },
      source: { droppableId: 'tasks', index: 0 },
      draggableId: '1'
    };

    await window.testOnDragEnd(dragResult);

    await waitFor(() => {
      expect(screen.getByText('Failed to reorder tasks. Please try again.')).toBeInTheDocument();
    });
  });

  test('disables dragging during reorder operation', async () => {
    const mockReorderTasks = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    useTasks.mockReturnValue({
      ...mockUseTasks,
      reorderTasks: mockReorderTasks
    });

    render(<TaskList />);

    const dragResult = {
      destination: { droppableId: 'tasks', index: 1 },
      source: { droppableId: 'tasks', index: 0 },
      draggableId: '1'
    };

    window.testOnDragEnd(dragResult);

    await waitFor(() => {
      const taskItems = screen.getAllByTestId('task-item');
      taskItems.forEach(item => {
        expect(item).toHaveClass('disabled');
      });
    });
  });
});