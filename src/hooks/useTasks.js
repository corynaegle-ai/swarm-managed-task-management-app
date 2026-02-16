import { useState, useCallback } from 'react';
import { updateTask as apiUpdateTask } from '../utils/taskApi';

// Hook for managing task updates with loading and error states
export const useTaskUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTask = useCallback(async (id, updates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiUpdateTask(id, updates);
      return result;
    } catch (err) {
      setError(err);
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