import React from 'react';
import PropTypes from 'prop-types';

const TaskList = ({ tasks = [] }) => {
  // Handle empty state when no tasks exist
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="empty-state">
          <p>No tasks available. Start by adding your first task!</p>
        </div>
      </div>
    );
  }

  // Render tasks when array has items
  return (
    <div className="task-list-container">
      <div className="task-list">
        {tasks.map((task, index) => (
          <div key={task.id || index} className="task-item">
            {/* Task content will be rendered here */}
            <span>{task.title || task.name || 'Untitled Task'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// PropTypes validation for tasks array
TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      name: PropTypes.string
    })
  )
};

TaskList.defaultProps = {
  tasks: []
};

export default TaskList;