import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskItem from '../TaskItem';

// Mock the drag and drop context for testing
const MockDragDropContext = ({ children }) => (
  <DragDropContext onDragEnd={() => {}}>
    <Droppable droppableId="test-droppable">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

const mockTask = {
  id: 1,
  text: 'Test task',
  completed: false
};

const mockCompletedTask = {
  id: 2,
  text: 'Completed task',
  completed: true
};

describe('TaskItem', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task item with drag handle', () => {
    render(
      <MockDragDropContext>
        <TaskItem
          task={mockTask}
          index={0}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      </MockDragDropContext>
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('⋮⋮')).toBeInTheDocument(); // drag handle
  });

  test('renders completed task with proper styling', () => {
    render(
      <MockDragDropContext>
        <TaskItem
          task={mockCompletedTask}
          index={0}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      </MockDragDropContext>
    );

    const taskSpan = screen.getByText('Completed task');
    expect(taskSpan).toHaveStyle('text-decoration: line-through');
    expect(taskSpan).toHaveStyle('color: #888');
  });

  test('calls onToggle when checkbox is clicked', () => {
    render(
      <MockDragDropContext>
        <TaskItem
          task={mockTask}
          index={0}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      </MockDragDropContext>
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <MockDragDropContext>
        <TaskItem
          task={mockTask}
          index={0}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      </MockDragDropContext>
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('drag handle has proper cursor styling', () => {
    render(
      <MockDragDropContext>
        <TaskItem
          task={mockTask}
          index={0}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      </MockDragDropContext>
    );

    const dragHandle = screen.getByText('⋮⋮');
    expect(dragHandle).toHaveStyle('cursor: grab');
  });

  test('drag handle hover effects work', () => {
    render(
      <MockDragDropContext>
        <TaskItem
          task={mockTask}
          index={0}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      </MockDragDropContext>
    );

    const dragHandle = screen.getByText('⋮⋮');
    
    fireEvent.mouseEnter(dragHandle);
    expect(dragHandle).toHaveStyle('background-color: #f0f0f0');
    
    fireEvent.mouseLeave(dragHandle);
    expect(dragHandle).toHaveStyle('background-color: transparent');
  });
});