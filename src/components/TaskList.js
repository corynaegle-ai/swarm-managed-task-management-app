import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';

const TaskList = ({ tasks = [] }) => {
  const onDragEnd = (result) => {
    // TODO: Implement drag and drop logic in next ticket
    console.log('Drag ended:', result);
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