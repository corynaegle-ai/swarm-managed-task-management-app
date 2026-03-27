import { useState, useEffect } from 'react';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Preserve completed field from API response
      const tasksWithCompletion = data.map(task => ({
        ...task,
        completed: task.completed || false
      }));
      
      setTasks(tasksWithCompletion);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion status
  const toggleComplete = async (taskId) => {
    try {
      // Find the task to toggle
      const taskToToggle = tasks.find(task => task.id === taskId);
      if (!taskToToggle) {
        throw new Error('Task not found');
      }

      const newCompletedStatus = !taskToToggle.completed;

      // Optimistically update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: newCompletedStatus }
            : task
        )
      );

      // Send PATCH request to API
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: newCompletedStatus })
      });

      if (!response.ok) {
        // Revert optimistic update on failure
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: taskToToggle.completed }
              : task
          )
        );
        throw new Error(`Failed to update task: ${response.status}`);
      }

      // Update with server response to ensure consistency
      const updatedTask = await response.json();
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: updatedTask.completed }
            : task
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error toggling task completion:', err);
    }
  };

  // Add new task
  const addTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...taskData, completed: false })
      });

      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.status}`);
      }

      const newTask = await response.json();
      setTasks(prevTasks => [...prevTasks, { ...newTask, completed: newTask.completed || false }]);
      return newTask;
    } catch (err) {
      setError(err.message);
      console.error('Error adding task:', err);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status}`);
      }

      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    }
  };

  // Update task
  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.status}`);
      }

      const updatedTask = await response.json();
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, ...updatedTask, completed: updatedTask.completed || false }
            : task
        )
      );
      return updatedTask;
    } catch (err) {
      setError(err.message);
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    toggleComplete,
    addTask,
    deleteTask,
    updateTask
  };
};

export default useTasks;