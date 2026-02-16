import React from 'react';

const TaskItem = ({ task, index }) => {
  return (
    <div className="task-item">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <span className="task-status">{task.status}</span>
    </div>
  );
};

export default TaskItem;