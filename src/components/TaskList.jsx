import React, { useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ initialTasks = [] }) => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleUpdateTask = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Task',
      dueDate: '',
      priority: 'medium'
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Task List</h2>
        <button 
          onClick={handleAddTask}
          className="add-task-btn"
        >
          Add Task
        </button>
      </div>
      
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Click "Add Task" to get started!</p>
        </div>
      ) : (
        <div className="task-items">
          {tasks.map(task => (
            <div key={task.id} className="task-item-wrapper">
              <TaskItem 
                task={task} 
                onUpdateTask={handleUpdateTask}
              />
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="delete-task-btn"
                title="Delete task"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .task-list {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .task-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .add-task-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .add-task-btn:hover {
          background: #0056b3;
        }
        
        .empty-state {
          text-align: center;
          color: #666;
          padding: 40px 0;
        }
        
        .task-item-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
        }
        
        .task-item {
          flex: 1;
          display: flex;
          gap: 20px;
          align-items: center;
        }
        
        .task-title {
          flex: 2;
        }
        
        .task-due-date {
          flex: 1;
        }
        
        .task-priority {
          flex: 1;
        }
        
        .editable-field {
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 3px;
          transition: background-color 0.2s;
          min-height: 20px;
          display: inline-block;
        }
        
        .editable-field:hover {
          background-color: #f0f0f0;
        }
        
        .edit-input {
          padding: 4px 8px;
          border: 1px solid #007bff;
          border-radius: 3px;
          font-size: inherit;
          width: 100%;
        }
        
        .edit-input:focus {
          outline: none;
          border-color: #0056b3;
          box-shadow: 0 0 3px rgba(0, 123, 255, 0.3);
        }
        
        .priority-badge {
          text-transform: capitalize;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.85em;
        }
        
        .delete-task-btn {
          background: #dc3545;
          color: white;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .delete-task-btn:hover {
          background: #c82333;
        }
      `}</style>
    </div>
  );
};

export default TaskList;