const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/tasks - Retrieve all tasks with completed status
router.get('/', (req, res) => {
  try {
    // Query to select all fields including completed from tasks table
    const query = 'SELECT id, title, description, completed FROM tasks ORDER BY id ASC';
    
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'Failed to retrieve tasks',
          details: err.message 
        });
      }
      
      // Transform rows to ensure completed is boolean
      const tasks = rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        completed: Boolean(row.completed)
      }));
      
      res.json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// POST /api/tasks - Create a new task
router.post('/', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const query = 'INSERT INTO tasks (title, description, completed) VALUES (?, ?, 0)';
  
  db.run(query, [title, description || ''], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to create task',
        details: err.message 
      });
    }
    
    res.status(201).json({
      success: true,
      data: {
        id: this.lastID,
        title,
        description: description || '',
        completed: false
      }
    });
  });
});

// PUT /api/tasks/:id - Update task completion status
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  
  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be a boolean value' });
  }
  
  const query = 'UPDATE tasks SET completed = ? WHERE id = ?';
  
  db.run(query, [completed ? 1 : 0, id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to update task',
        details: err.message 
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({
      success: true,
      message: 'Task updated successfully'
    });
  });
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM tasks WHERE id = ?';
  
  db.run(query, [id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to delete task',
        details: err.message 
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  });
});

module.exports = router;