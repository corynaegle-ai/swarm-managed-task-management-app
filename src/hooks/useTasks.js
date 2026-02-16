import { useState, useCallback } from 'react';

// Safely import taskApi with fallback
let apiUpdateTask;
try {
  const taskApi = require('../utils/taskApi');
  apiUpdateTask = taskApi.updateTask;
} catch (err) {
  console.warn('taskApi module not found, using mock implementation');
  apiUpdateTask = async (id, updates) => {
    // Mock implementation for development
    return { id, ...updates };
  };
}

// Hook for managing task updates with loading and error states
export const useTaskUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTask = useCallback(async (id, updates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!apiUpdateTask) {
        throw new Error('Task API is not available. Please check your configuration.');
      }
      const result = await apiUpdateTask(id, updates);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update task';
      setError(new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateTask,
    isLoading,
    error,
    clearError
  };
};

// Main tasks hook for managing task list state
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTaskInList = useCallback((id, updates) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, []);

  return {
    tasks,
    loading,
    error,
    setTasks,
    updateTaskInList
  };
};