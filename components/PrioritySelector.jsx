import React from 'react';
import '../styles/tasks.css';

const PrioritySelector = ({ priority, onChange, label = 'Priority' }) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="priority-selector">
      <label htmlFor="priority-select">{label}</label>
      <select
        id="priority-select"
        value={priority || 'low'}
        onChange={handleChange}
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
  );
};

export default PrioritySelector;