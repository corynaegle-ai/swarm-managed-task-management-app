import React from 'react';
import PriorityBadge from './PriorityBadge';
import '../styles/tasks.css';

const TaskItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className="task-item">
      <div className="task-header">
        <input
          type="checkbox"
          checked={task.completed || false}
          onChange={() => onToggle(task.id)}
          className="task-checkbox"
        />
        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </h3>
        <PriorityBadge priority={task.priority} />
      </div>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-actions">
        <button
          onClick={() => onDelete(task.id)}
          className="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;