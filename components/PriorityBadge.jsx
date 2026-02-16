import React from 'react';
import '../styles/tasks.css';

const PriorityBadge = ({ priority }) => {
  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'priority-badge priority-high';
      case 'medium':
        return 'priority-badge priority-medium';
      case 'low':
        return 'priority-badge priority-low';
      default:
        return 'priority-badge priority-low';
    }
  };

  const getPriorityLabel = (priority) => {
    return priority?.charAt(0).toUpperCase() + priority?.slice(1).toLowerCase() || 'Low';
  };

  return (
    <span className={getPriorityClass(priority)}>
      {getPriorityLabel(priority)}
    </span>
  );
};

export default PriorityBadge;