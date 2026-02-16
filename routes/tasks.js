const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// GET /api/tasks - Get all tasks for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks - Create new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority = 'medium', dueDate } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      userId: req.user.id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify task ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update fields if provided
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    
    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Verify task ownership
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;