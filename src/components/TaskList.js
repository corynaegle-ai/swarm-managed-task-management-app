import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';

const TaskList = ({ tasks }) => {
  const handleDragEnd = (result) => {
    // Drag and drop logic will be implemented in next ticket
    if (!result.destination) {
      return;
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            className="task-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
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
    </DragDropContext>
  );
};

export default TaskList;