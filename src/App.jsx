import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Complete project setup',
      description: 'Set up the initial project structure and dependencies',
      priority: 'high',
      status: 'in-progress',
      createdAt: new Date('2024-01-15'),
      dueDate: new Date('2024-01-20')
    },
    {
      id: 2,
      title: 'Review code changes',
      description: 'Review pull requests and provide feedback',
      priority: 'medium',
      status: 'pending',
      createdAt: new Date('2024-01-16'),
      dueDate: new Date('2024-01-22')
    },
    {
      id: 3,
      title: 'Update documentation',
      description: 'Update API documentation with new endpoints',
      priority: 'low',
      status: 'completed',
      createdAt: new Date('2024-01-14'),
      dueDate: new Date('2024-01-18')
    }
  ]);

  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Sort tasks based on current sort criteria
  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle date sorting
    if (sortBy === 'createdAt' || sortBy === 'dueDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Handle string sorting
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleAddTask = (newTask) => {
    const task = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date()
    };
    setTasks(prevTasks => [...prevTasks, task]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Management App</h1>
        <div className="sort-controls">
          <label>
            Sort by:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
              <option value="createdAt">Created Date</option>
            </select>
          </label>
          <label>
            Order:
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </header>
      <main className="App-main">
        <TaskList 
          tasks={sortedTasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          onAddTask={handleAddTask}
        />
      </main>
    </div>
  );
}

export default App;