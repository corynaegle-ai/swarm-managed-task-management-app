import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskItem = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          className="task-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <span className="task-status">{task.status}</span>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;