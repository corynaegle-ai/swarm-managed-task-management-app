import React, { useEffect, useRef } from 'react';
import '../styles/ConfirmDialog.css';

const ConfirmDialog = ({ task, onConfirm, onCancel, title = 'Confirm Deletion', message }) => {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    // Focus the confirm button when dialog opens
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }

    // Handle escape key press
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent body scroll when dialog is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [onCancel]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  const defaultMessage = task ? 
    `Are you sure you want to delete the task "${task.text}"? This action cannot be undone.` :
    'Are you sure you want to proceed? This action cannot be undone.';

  return (
    <div className="confirm-dialog-backdrop" onClick={handleBackdropClick}>
      <div className="confirm-dialog" ref={dialogRef} role="dialog" aria-modal="true">
        <div className="confirm-dialog-header">
          <h3 className="confirm-dialog-title">{title}</h3>
          <button 
            className="confirm-dialog-close"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        
        <div className="confirm-dialog-body">
          <p className="confirm-dialog-message">
            {message || defaultMessage}
          </p>
          
          {task && (
            <div className="task-details">
              <div className="task-preview">
                <strong>Task:</strong> {task.text}
                <br />
                <strong>Status:</strong> {task.completed ? 'Completed' : 'Pending'}
              </div>
            </div>
          )}
        </div>
        
        <div className="confirm-dialog-actions">
          <button 
            className="confirm-dialog-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="confirm-dialog-confirm"
            onClick={onConfirm}
            ref={confirmButtonRef}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;