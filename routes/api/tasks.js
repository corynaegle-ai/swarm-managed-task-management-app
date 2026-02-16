const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const auth = require('../../middleware/auth');

// PUT /api/tasks/reorder - Reorder tasks
router.put('/reorder', auth, async (req, res) => {
  try {
    // Extract taskIds from request body
    const { taskIds } = req.body;

    // Input validation: check taskIds is array and not empty
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        error: 'taskIds must be a non-empty array'
      });
    }

    // User authentication check (handled by auth middleware)
    const userId = req.user.id;

    // Query database to verify all taskIds exist and belong to current user
    const tasks = await Task.find({
      _id: { $in: taskIds },
      userId: userId
    });

    // Check if all tasks exist and belong to user
    if (tasks.length !== taskIds.length) {
      return res.status(404).json({
        error: 'One or more tasks not found or do not belong to user'
      });
    }

    // Return 200 with placeholder response
    res.json({
      message: 'Validation successful',
      taskIds
    });
  } catch (error) {
    console.error('Error in task reorder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;