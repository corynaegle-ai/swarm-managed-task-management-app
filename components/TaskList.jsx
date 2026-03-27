import React from 'react';
import TaskFilters from './TaskFilters';
import { useTasks } from '../hooks/useTasks';

const TaskList = () => {
  const { 
    tasks, 
    filteredTasks, 
    loading, 
    error, 
    handlePriorityFilter, 
    handleStatusFilter 
  } = useTasks();

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error">Error loading tasks: {error}</div>;
  }

  return (
    <div className="task-list-container">
      <TaskFilters 
        onPriorityFilter={handlePriorityFilter}
        onStatusFilter={handleStatusFilter}
      />
      
      <div className="task-list">
        <h2>Tasks ({filteredTasks.length})</h2>
        
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">No tasks match the current filters</div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
                
                <p className="task-description">{task.description}</p>
                
                <div className="task-footer">
                  <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                    {task.status}
                  </span>
                  <span className="task-date">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;