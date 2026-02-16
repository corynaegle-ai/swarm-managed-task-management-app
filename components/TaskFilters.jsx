import React, { useState } from 'react';

const TaskFilters = ({ onPriorityFilter }) => {
  const [selectedPriority, setSelectedPriority] = useState('');

  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handlePriorityChange = (event) => {
    const priority = event.target.value || null;
    setSelectedPriority(event.target.value);
    onPriorityFilter(priority);
  };

  return (
    <div className="task-filters">
      <div className="filter-group">
        <label htmlFor="priority-filter">Filter by Priority:</label>
        <select
          id="priority-filter"
          value={selectedPriority}
          onChange={handlePriorityChange}
          className="priority-filter-select"
        >
          {priorities.map(priority => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;