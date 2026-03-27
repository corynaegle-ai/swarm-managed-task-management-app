import React, { useState } from 'react';

const TaskItem = ({ task, onUpdateTask }) => {
  const [editMode, setEditMode] = useState({
    title: false,
    dueDate: false,
    priority: false
  });
  
  const [editValues, setEditValues] = useState({
    title: task.title,
    dueDate: task.dueDate,
    priority: task.priority
  });

  const handleEditToggle = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    if (!editMode[field]) {
      setEditValues(prev => ({
        ...prev,
        [field]: task[field]
      }));
    }
  };

  const handleSave = (field) => {
    onUpdateTask({
      ...task,
      [field]: editValues[field]
    });
    setEditMode(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleCancel = (field) => {
    setEditValues(prev => ({
      ...prev,
      [field]: task[field]
    }));
    setEditMode(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(field);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel(field);
    }
  };

  const handleInputChange = (field, value) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBlur = (field) => {
    // Auto-save on blur
    handleSave(field);
  };

  return (
    <div className="task-item">
      <div className="task-title">
        {editMode.title ? (
          <input
            type="text"
            value={editValues.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'title')}
            onBlur={() => handleBlur('title')}
            className="edit-input edit-title"
            autoFocus
          />
        ) : (
          <span
            className="editable-field"
            onClick={() => handleEditToggle('title')}
          >
            {task.title}
          </span>
        )}
      </div>
      
      <div className="task-due-date">
        {editMode.dueDate ? (
          <input
            type="date"
            value={editValues.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'dueDate')}
            onBlur={() => handleBlur('dueDate')}
            className="edit-input edit-date"
            autoFocus
          />
        ) : (
          <span
            className="editable-field"
            onClick={() => handleEditToggle('dueDate')}
          >
            {task.dueDate || 'No due date'}
          </span>
        )}
      </div>
      
      <div className="task-priority">
        {editMode.priority ? (
          <select
            value={editValues.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'priority')}
            onBlur={() => handleBlur('priority')}
            className="edit-input edit-select"
            autoFocus
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        ) : (
          <span
            className="editable-field priority-badge"
            onClick={() => handleEditToggle('priority')}
          >
            {task.priority || 'medium'}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem;