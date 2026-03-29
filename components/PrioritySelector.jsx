import React from 'react';

const PrioritySelector = ({ value, onChange }) => {
  const priorities = [
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'low', label: 'Low', color: '#10b981' }
  ];

  return (
    <div className="priority-selector">
      <label htmlFor="priority" className="form-label">
        Priority
      </label>
      <select
        id="priority"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="priority-select"
      >
        {priorities.map(priority => (
          <option key={priority.value} value={priority.value}>
            {priority.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PrioritySelector;