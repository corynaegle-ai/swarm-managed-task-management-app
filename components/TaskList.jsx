import React, { useState, useEffect } from 'react';
import TaskFilters from './TaskFilters';
import useTasks from '../hooks/useTasks';

const TaskList = () => {
  const [sortOrder, setSortOrder] = useState('asc');
  const [priorityFilter, setPriorityFilter] = useState(null);

  // Initialize state from URL params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const priority = urlParams.get('priority');
    const order = urlParams.get('order');
    
    if (priority) setPriorityFilter(priority);
    if (order) setSortOrder(order);
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (priorityFilter) params.set('priority', priorityFilter);
    if (sortOrder) params.set('order', sortOrder);
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [priorityFilter, sortOrder]);

  const { tasks, loading, error } = useTasks({ 
    sort: 'priority', 
    order: sortOrder, 
    priorityFilter 
  });

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">Error loading tasks: {error.message}</div>;

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <div className="controls">
          <TaskFilters onPriorityFilter={setPriorityFilter} />
          <div className="sort-controls">
            <button 
              className={sortOrder === 'asc' ? 'active' : ''}
              onClick={() => handleSortOrderChange('asc')}
            >
              Priority ↑
            </button>
            <button 
              className={sortOrder === 'desc' ? 'active' : ''}
              onClick={() => handleSortOrderChange('desc')}
            >
              Priority ↓
            </button>
          </div>
        </div>
      </div>
      
      <div className="task-items">
        {tasks.length === 0 ? (
          <div className="no-tasks">No tasks found</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-title">{task.title}</div>
              <div className="task-priority">
                Priority: {task.priority}
              </div>
              <div className="task-status">{task.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;