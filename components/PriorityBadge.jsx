import React from 'react';

const PriorityBadge = ({ priority, className = '' }) => {
  return (
    <span className={`priority-badge priority-${priority} ${className}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;