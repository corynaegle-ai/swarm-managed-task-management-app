import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch existing tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle task creation with POST API call
  const handleCreateTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks(prevTasks => [...prevTasks, newTask]);
        return newTask;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-list-container">
      <h1>Task Management</h1>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      <div className="task-form-section">
        <h2>Create New Task</h2>
        <TaskForm 
          onSubmit={handleCreateTask}
          loading={loading}
        />
      </div>
      
      <div className="task-list-section">
        <h2>Tasks</h2>
        {loading && tasks.length === 0 ? (
          <div>Loading tasks...</div>
        ) : (
          <div className="tasks">
            {tasks.length === 0 ? (
              <p>No tasks available. Create your first task above!</p>
            ) : (
              tasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;