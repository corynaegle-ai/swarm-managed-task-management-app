import React from 'react';

const TaskFilters = ({ onFilterChange, currentFilters = {} }) => {
  const handleStatusFilter = (status) => {
    onFilterChange({
      ...currentFilters,
      status: currentFilters.status === status ? null : status
    });
  };

  const handlePriorityFilter = (priority) => {
    onFilterChange({
      ...currentFilters,
      priority: currentFilters.priority === priority ? null : priority
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="task-filters">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <h4>Status</h4>
        <div className="filter-buttons">
          {['Open', 'In Progress', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`filter-button ${
                currentFilters.status === status ? 'active' : ''
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h4>Priority</h4>
        <div className="filter-buttons">
          {['Critical', 'High', 'Medium', 'Low'].map(priority => (
            <button
              key={priority}
              onClick={() => handlePriorityFilter(priority)}
              className={`filter-button ${
                currentFilters.priority === priority ? 'active' : ''
              }`}
            >
              {priority}
            </button>
          ))}
        </div>
      </div>

      {(currentFilters.status || currentFilters.priority) && (
        <button onClick={clearAllFilters} className="clear-filters-button">
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;