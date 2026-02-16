import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editText.trim()) {
      onUpdate(task.id, { ...task, text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  return (
    <div className="task-item">
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onUpdate(task.id, { ...task, completed: e.target.checked })}
          className="task-checkbox"
        />
        
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="edit-form">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-input"
              autoFocus
            />
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={handleEditCancel} className="cancel-btn">Cancel</button>
          </form>
        ) : (
          <div className="task-text-container">
            <span className={`task-text ${task.completed ? 'completed' : ''}`}>
              {task.text}
            </span>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)} className="edit-btn">
                Edit
              </button>
              <button onClick={handleDeleteClick} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showConfirmDialog && (
        <ConfirmDialog
          task={task}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default TaskItem;