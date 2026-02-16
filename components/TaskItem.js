import React from 'react';
import '../styles/components/TaskItem.css';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  const handleCheckboxClick = () => {
    onToggleComplete(task.id);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCheckboxClick();
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'task-completed' : ''}`}>
      <div
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={handleCheckboxClick}
        onKeyPress={handleKeyPress}
        tabIndex={0}
        role="checkbox"
        aria-checked={task.completed}
        aria-label={`Mark task "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <span className="task-text">
        {task.text}
      </span>
      {onDelete && (
        <button
          className="task-delete"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task "${task.text}"`}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default TaskItem;