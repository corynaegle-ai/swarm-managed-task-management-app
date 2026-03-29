import React, { useState } from 'react';
import PrioritySelector from './PrioritySelector';

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority);
    
    // API call for priority updates if this is an existing task
    try {
      // This would be called when editing existing tasks
      // await updateTaskPriority(taskId, newPriority);
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        createdAt: new Date().toISOString()
      };

      await onSubmit(taskData);
      
      // Reset form after successful submission
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
          placeholder="Enter task description (optional)"
          rows={3}
        />
      </div>

      <div className="form-group">
        <PrioritySelector 
          value={priority} 
          onChange={handlePriorityChange}
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;