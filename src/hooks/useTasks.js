import { useState, useEffect } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask, reorderTasks as reorderTasksAPI } from '../services/taskService';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      setError(null);
      const newTask = await createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editTask = async (taskId, taskData) => {
    try {
      setError(null);
      const updatedTask = await updateTask(taskId, taskData);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeTask = async (taskId) => {
    try {
      setError(null);
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const reorderTasks = async (newOrder) => {
    // Store previous order for rollback
    const previousOrder = [...tasks];
    
    try {
      setError(null);
      setReorderLoading(true);
      
      // Optimistic update - immediately update local state
      setTasks(newOrder);
      
      // Call API in background
      await reorderTasksAPI(newOrder.map(task => task.id));
    } catch (err) {
      // Revert to previous order on API failure
      setTasks(previousOrder);
      setError(err.message);
      throw err;
    } finally {
      setReorderLoading(false);
    }
  };

  return {
    tasks,
    loading,
    reorderLoading,
    error,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    reorderTasks
  };
};

export default useTasks;