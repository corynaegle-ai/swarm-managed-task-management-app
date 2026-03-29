import React, { useState } from 'react';
import PriorityBadge from './PriorityBadge';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onUpdate(task.id, { ...task, completed: !task.completed });
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-meta">
            <PriorityBadge priority={task.priority || 'medium'} />
            <span className="task-date">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-actions">
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className={`btn btn-sm ${task.completed ? 'btn-secondary' : 'btn-success'}`}
        >
          {isCompleting ? '...' : task.completed ? 'Undo' : 'Complete'}
        </button>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-sm btn-outline"
        >
          Edit
        </button>
        
        <button
          onClick={handleDelete}
          className="btn btn-sm btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;