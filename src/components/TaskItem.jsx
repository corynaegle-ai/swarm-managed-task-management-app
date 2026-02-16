import React, { useState } from 'react';
import { useTaskUpdate } from '../hooks/useTasks';
import './TaskItem.css';

// Simple toast notification component
const Toast = ({ message, type, onRetry, onClose }) => {
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <div className="toast-actions">
          {onRetry && (
            <button className="toast-button retry" onClick={onRetry}>
              Retry
            </button>
          )}
          <button className="toast-button close" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading spinner component
const LoadingSpinner = () => (
  <div className="loading-spinner" aria-label="Loading">
    <div className="spinner"></div>
  </div>
);

const TaskItem = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [showError, setShowError] = useState(false);
  
  const { updateTask, isLoading, error, clearError } = useTaskUpdate();

  const handleSave = async () => {
    try {
      // Clear any existing errors when starting new save
      clearError();
      setShowError(false);
      
      await updateTask(task.id, {
        title: editedTitle,
        description: editedDescription
      });
      
      // Update parent component
      onUpdate(task.id, { title: editedTitle, description: editedDescription });
      setIsEditing(false);
    } catch (err) {
      setShowError(true);
    }
  };

  const handleRetry = () => {
    handleSave();
  };

  const handleCloseError = () => {
    setShowError(false);
    clearError();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setShowError(false);
    clearError();
  };

  return (
    <div className={`task-item ${isLoading ? 'loading' : ''}`}>
      {/* Error toast notification */}
      {showError && error && (
        <Toast
          message={error.message || 'Failed to save task'}
          type="error"
          onRetry={handleRetry}
          onClose={handleCloseError}
        />
      )}
      
      {!isEditing ? (
        <div className="task-view">
          <div className="task-header">
            <h3 className="task-title">{task.title}</h3>
            <div className="task-actions">
              {isLoading && <LoadingSpinner />}
              <button 
                className="edit-button" 
                onClick={handleEdit}
                disabled={isLoading}
              >
                Edit
              </button>
            </div>
          </div>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            <span className={`task-status status-${task.status}`}>
              {task.status}
            </span>
            <span className="task-priority priority-${task.priority}">
              {task.priority} priority
            </span>
          </div>
        </div>
      ) : (
        <div className="task-edit">
          <div className="form-group">
            <label htmlFor={`title-${task.id}`}>Title:</label>
            <input
              id={`title-${task.id}`}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="form-input"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`description-${task.id}`}>Description:</label>
            <textarea
              id={`description-${task.id}`}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="form-textarea"
              rows="3"
              disabled={isLoading}
            />
          </div>
          <div className="form-actions">
            <button 
              className="save-button"
              onClick={handleSave}
              disabled={isLoading || !editedTitle.trim()}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
            <button 
              className="cancel-button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;