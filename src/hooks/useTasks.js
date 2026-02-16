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

// Main tasks hook (placeholder - would contain other task operations)
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Placeholder implementation
  return {
    tasks,
    loading,
    error,
    setTasks
  };
};