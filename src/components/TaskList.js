import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';

const TaskList = ({ tasks = [] }) => {
  const onDragEnd = (result) => {
    // Drag and drop logic will be implemented in next ticket
    if (!result.destination) {
      return;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="task-list">
        <h2>Tasks</h2>
        <Droppable droppableId="tasks">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`task-list-container ${
                snapshot.isDraggingOver ? 'dragging-over' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default TaskList;