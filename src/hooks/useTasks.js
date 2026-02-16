import { useState, useCallback } from 'react';
import { updateTask } from '../utils/taskApi';

export const useTaskUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateTaskData = useCallback(async (taskId, updates) => {
    setIsUpdating(true);
    setError(null);
    
    try {
      await updateTask(taskId, updates);
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Task update failed:', err);
      return { success: false, error: err.message };
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    updateTask: updateTaskData,
    isUpdating,
    error
  };
};