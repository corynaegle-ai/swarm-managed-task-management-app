import React, { useState } from 'react';

const TaskFilters = ({ onPriorityFilter, onStatusFilter }) => {
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handlePriorityFilter = (priority) => {
    const newPriority = priority === selectedPriority ? null : priority;
    setSelectedPriority(newPriority);
    onPriorityFilter(newPriority);
    
    // Update URL params
    const url = new URL(window.location);
    if (newPriority) {
      url.searchParams.set('priority', newPriority);
    } else {
      url.searchParams.delete('priority');
    }
    window.history.pushState({}, '', url);
  };

  const handleStatusFilter = (status) => {
    const newStatus = status === selectedStatus ? null : status;
    setSelectedStatus(newStatus);
    onStatusFilter(newStatus);
    
    // Update URL params
    const url = new URL(window.location);
    if (newStatus) {
      url.searchParams.set('status', newStatus);
    } else {
      url.searchParams.delete('status');
    }
    window.history.pushState({}, '', url);
  };

  return (
    <div className="task-filters">
      <div className="filter-group">
        <h3>Priority</h3>
        <button 
          className={selectedPriority === null ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handlePriorityFilter(null)}
        >
          All Priorities
        </button>
        {['High', 'Medium', 'Low'].map(priority => (
          <button
            key={priority}
            className={selectedPriority === priority ? 'filter-btn active' : 'filter-btn'}
            onClick={() => handlePriorityFilter(priority)}
          >
            {priority}
          </button>
        ))}
      </div>
      
      <div className="filter-group">
        <h3>Status</h3>
        <button 
          className={selectedStatus === null ? 'filter-btn active' : 'filter-btn'}
          onClick={() => handleStatusFilter(null)}
        >
          All Status
        </button>
        {['Todo', 'In Progress', 'Done'].map(status => (
          <button
            key={status}
            className={selectedStatus === status ? 'filter-btn active' : 'filter-btn'}
            onClick={() => handleStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskFilters;