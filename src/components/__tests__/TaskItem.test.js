import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskItem from '../TaskItem';

const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'high',
  dueDate: '2024-12-31'
};

const TestWrapper = ({ children }) => (
  <DragDropContext onDragEnd={() => {}}>
    <Droppable droppableId="test">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

describe('TaskItem', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnDelete.mockClear();
  });

  test('renders task item with drag handle', () => {
    render(
      <TestWrapper>
        <TaskItem task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTitle('Drag to reorder')).toBeInTheDocument();
  });

  test('drag handle has proper styling', () => {
    render(
      <TestWrapper>
        <TaskItem task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </TestWrapper>
    );

    const dragHandle = screen.getByTitle('Drag to reorder');
    expect(dragHandle).toHaveClass('drag-handle');
    expect(window.getComputedStyle(dragHandle).cursor).toBe('grab');
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <TestWrapper>
        <TaskItem task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </TestWrapper>
    );

    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <TestWrapper>
        <TaskItem task={mockTask} index={0} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      </TestWrapper>
    );

    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  test('renders without edit and delete handlers', () => {
    render(
      <TestWrapper>
        <TaskItem task={mockTask} index={0} />
      </TestWrapper>
    );

    expect(screen.queryByLabelText('Edit task')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete task')).not.toBeInTheDocument();
  });
});