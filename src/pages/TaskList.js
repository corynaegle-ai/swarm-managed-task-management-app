import React, { useState, useEffect } from 'react';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to load tasks');
      }
      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors when attempting new task creation
    setError('');
    
    if (!newTaskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setIsCreating(true);
      
      const taskData = {
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();
      
      // Update local task state with new task after successful API response
      setTasks(prevTasks => [...prevTasks, createdTask]);
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      
    } catch (err) {
      // Set user-friendly error message in catch block
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="task-list-container">
        <div className="loading-spinner">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <header className="task-list-header">
        <h1>Task Management</h1>
      </header>

      {/* Conditional rendering for error messages */}
      {error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          {error}
          <button 
            className="error-dismiss" 
            onClick={() => setError('')}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <section className="task-creation-section">
        <h2>Create New Task</h2>
        <form onSubmit={handleCreateTask} className="task-creation-form">
          <div className="form-group">
            <label htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title"
              disabled={isCreating}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              disabled={isCreating}
              rows={3}
            />
          </div>
          
          <button 
            type="submit" 
            className="create-task-btn"
            disabled={isCreating || !newTaskTitle.trim()}
          >
            {isCreating ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </section>

      <section className="task-list-section">
        <h2>Tasks ({tasks.length})</h2>
        
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create your first task above!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task.id} className={`task-card task-${task.status}`}>
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                
                <div className="task-footer">
                  <span className="task-date">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="delete-btn"
                    aria-label={`Delete task: ${task.title}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TaskList;