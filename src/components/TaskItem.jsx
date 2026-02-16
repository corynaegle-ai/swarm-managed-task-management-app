import React, { useState, useRef, useEffect } from 'react';
import { useTaskUpdate } from '../hooks/useTasks';

const TaskItem = ({ task, onUpdate }) => {
  const [inputValue, setInputValue] = useState(task.title || '');
  const [isEditing, setIsEditing] = useState(false);
  const { updateTask, isUpdating, error } = useTaskUpdate();
  const debounceTimeoutRef = useRef(null);

  // Update local state when task prop changes
  useEffect(() => {
    setInputValue(task.title || '');
  }, [task.title]);

  const clearDebounceTimeout = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  };

  const saveTask = async () => {
    clearDebounceTimeout();
    
    if (inputValue.trim() !== task.title) {
      const result = await updateTask(task.id, { title: inputValue.trim() });
      
      if (result.success && onUpdate) {
        onUpdate({ ...task, title: inputValue.trim() });
      }
    }
  };

  const debouncedSave = () => {
    clearDebounceTimeout();
    debounceTimeoutRef.current = setTimeout(() => {
      saveTask();
    }, 500);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    debouncedSave();
  };

  const handleBlur = () => {
    setIsEditing(false);
    saveTask(); // Immediate save on blur
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTask(); // Immediate save on Enter
      e.target.blur(); // Remove focus
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearDebounceTimeout();
  }, []);

  return (
    <div className={`task-item ${isUpdating ? 'updating' : ''}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className={`task-input ${isEditing ? 'editing' : ''}`}
        disabled={isUpdating}
      />
      {error && <div className="task-error">{error}</div>}
      {isUpdating && <div className="task-spinner">Saving...</div>}
    </div>
  );
};

export default TaskItem;