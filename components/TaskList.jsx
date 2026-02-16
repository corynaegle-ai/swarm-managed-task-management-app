import React, { useState, useEffect } from 'react';
import useTasks from '../hooks/useTasks';

const TaskList = () => {
  const [sortOrder, setSortOrder] = useState('desc');

  // Update URL params when sort changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('sort', 'priority');
    params.set('order', sortOrder);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [sortOrder]);

  // Initialize sort order from URL params on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrder = params.get('order');
    if (urlOrder && (urlOrder === 'asc' || urlOrder === 'desc')) {
      setSortOrder(urlOrder);
    }
  }, []);

  const { tasks, loading, error } = useTasks({ sort: 'priority', order: sortOrder });

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">Error loading tasks: {error}</div>;
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Task List</h2>
        <button 
          onClick={handleSortToggle}
          className="sort-button"
          aria-label={`Sort by priority ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
        >
          Sort by Priority {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>
      
      <div className="tasks">
        {tasks && tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className="task-item">
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                  <span className={`priority priority-${task.priority.toLowerCase()}`}>
                    Priority: {task.priority}
                  </span>
                  <span className={`status status-${task.status.toLowerCase()}`}>
                    Status: {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tasks">No tasks available</div>
        )}
      </div>
    </div>
  );
};

export default TaskList;