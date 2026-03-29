import React from 'react';

const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return { label: 'High', className: 'priority-badge priority-high' };
      case 'medium':
        return { label: 'Medium', className: 'priority-badge priority-medium' };
      case 'low':
        return { label: 'Low', className: 'priority-badge priority-low' };
      default:
        return { label: 'Medium', className: 'priority-badge priority-medium' };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
};

export default PriorityBadge;