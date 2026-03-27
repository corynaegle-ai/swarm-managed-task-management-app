import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load tasks on component mount
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call - replace with actual implementation
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
      // Fallback to empty array if API fails
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    // Add new task to the list
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.filter(task => task.id !== taskId)
    );
  };

  return (
    <div className="task-list-page">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Task Management</h1>
        
        {/* TaskForm component positioned above task list */}
        <div className="mb-8">
          <TaskForm onTaskCreated={handleTaskCreated} />
        </div>

        {/* Task List Display */}
        <div className="task-list-section">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
          
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading tasks...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-800">Error loading tasks: {error}</p>
              <button 
                onClick={loadTasks}
                className="mt-2 text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No tasks found. Create your first task above!</p>
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status || 'pending'}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-sm text-gray-500 mb-3">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleTaskUpdate({...task, status: 'completed'})}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                      disabled={task.status === 'completed'}
                    >
                      {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button 
                      onClick={() => handleTaskDelete(task.id)}
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;