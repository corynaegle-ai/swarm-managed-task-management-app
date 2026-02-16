import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTasks } from '../hooks/useTasks';

const TaskList = () => {
  const { tasks, loading, error, reorderTasks } = useTasks();
  const [reorderLoading, setReorderLoading] = useState(false);
  const [reorderError, setReorderError] = useState(null);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // If no destination or dropped in same position, do nothing
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Create new array with reordered tasks
    const newTasks = Array.from(tasks);
    const [movedTask] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, movedTask);

    // Create order array with task IDs in new order
    const newOrder = newTasks.map(task => task.id);

    try {
      setReorderLoading(true);
      setReorderError(null);
      await reorderTasks(newOrder);
    } catch (err) {
      setReorderError('Failed to reorder tasks. Please try again.');
      console.error('Reorder failed:', err);
    } finally {
      setReorderLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">Error loading tasks: {error}</div>;
  }

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      
      {reorderError && (
        <div className="error-message" role="alert">
          {reorderError}
        </div>
      )}
      
      {reorderLoading && (
        <div className="reorder-loading">Reordering tasks...</div>
      )}
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`tasks-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              {tasks.map((task, index) => (
                <Draggable 
                  key={task.id} 
                  draggableId={task.id.toString()} 
                  index={index}
                  isDragDisabled={reorderLoading}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`task-item ${
                        snapshot.isDragging ? 'dragging' : ''
                      } ${
                        reorderLoading ? 'disabled' : ''
                      }`}
                    >
                      <div className="task-content">
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <span className="task-status">{task.status}</span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;