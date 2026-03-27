import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTaskAsync } from '../store/tasksSlice';

const TaskItem = ({ task }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dispatch = useDispatch();
  const { isDeleting, deleteError } = useSelector(state => ({
    isDeleting: state.tasks.deletingTasks[task.id] || false,
    deleteError: state.tasks.deleteErrors[task.id] || null
  }));

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteTaskAsync(task.id)).unwrap();
      setShowDeleteDialog(false);
    } catch (error) {
      // Error is handled by Redux state, dialog stays open to show error
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  return (
    <div className="task-item">
      <div className="task-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <div className="task-meta">
          <span className={`status ${task.status}`}>{task.status}</span>
          <span className="priority">{task.priority}</span>
        </div>
      </div>
      
      <div className="task-actions">
        <button 
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="delete-btn"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {showDeleteDialog && (
        <div className="delete-dialog-overlay">
          <div className="delete-dialog">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete "{task.title}"?</p>
            
            {deleteError && (
              <div className="error-message">
                Error: {deleteError}
              </div>
            )}
            
            <div className="dialog-actions">
              <button 
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="confirm-btn"
              >
                {isDeleting ? (
                  <span className="loading-spinner">⏳ Deleting...</span>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;