import { useState, useCallback } from 'react';
import { updateTask } from '../utils/taskApi';

/**
 * Custom hook for task operations with optimistic updates
 * @returns {Object} Task operation functions and state
 */
export const useTaskUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Update a task with optimistic UI updates
   * @param {string} taskId - The ID of the task to update
   * @param {Object} updates - The updates to apply
   * @param {Function} onOptimisticUpdate - Callback to apply optimistic update to local state
   * @param {Function} onRevert - Callback to revert optimistic update on error
   * @returns {Promise<Object>} The updated task data
   */
  const updateTaskOptimistically = useCallback(async (
    taskId,
    updates,
    onOptimisticUpdate,
    onRevert
  ) => {
    if (!taskId || !updates) {
      throw new Error('Task ID and updates are required');
    }

    if (!onOptimisticUpdate || !onRevert) {
      throw new Error('Optimistic update and revert callbacks are required');
    }

    setIsUpdating(true);
    setError(null);

    // Apply optimistic update immediately
    const optimisticTask = { id: taskId, ...updates };
    onOptimisticUpdate(optimisticTask);

    try {
      // Make the actual API call
      const updatedTask = await updateTask(taskId, updates);
      
      // Update with real data from server (in case server modified anything)
      onOptimisticUpdate(updatedTask);
      
      return updatedTask;
    } catch (apiError) {
      // Revert optimistic update on error
      onRevert(taskId);
      
      const errorMessage = apiError.message || 'Failed to update task';
      setError(errorMessage);
      
      // Re-throw so caller can handle if needed
      throw new Error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, []);

  /**
   * Clear any existing error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    updateTaskOptimistically,
    isUpdating,
    error,
    clearError,
  };
};

export default useTaskUpdate;