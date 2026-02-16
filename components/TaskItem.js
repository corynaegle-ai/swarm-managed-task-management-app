import React from 'react';
import './styles/TaskItem.css';

const TaskItem = ({ task, onDelete, onToggleComplete }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
  };

  const handleToggleComplete = () => {
    if (onToggleComplete) {
      onToggleComplete(task.id);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed || false}
          onChange={handleToggleComplete}
          className="task-checkbox"
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="task-details">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button
          onClick={handleDelete}
          className="task-action-button delete-button"
          aria-label={`Delete ${task.title}`}
          title="Delete task"
        >
          <svg
            className="trash-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 11v6m4-6v6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;