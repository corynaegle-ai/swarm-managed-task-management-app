import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './TaskItem.css';

const TaskItem = ({ task, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`task-item ${snapshot.isDragging ? 'dragging' : ''}`}
        >
          <div
            {...provided.dragHandleProps}
            className="drag-handle"
            title="Drag to reorder"
          >
            <span className="drag-icon">⋮⋮</span>
          </div>
          <div className="task-content">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-actions">
                {onEdit && (
                  <button
                    onClick={() => onEdit(task)}
                    className="edit-btn"
                    aria-label="Edit task"
                  >
                    ✏️
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(task.id)}
                    className="delete-btn"
                    aria-label="Delete task"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
              <span className={`priority priority-${task.priority || 'medium'}`}>
                {task.priority || 'medium'}
              </span>
              {task.dueDate && (
                <span className="due-date">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;