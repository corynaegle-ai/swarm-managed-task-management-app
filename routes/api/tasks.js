const express = require('express');
const router = express.Router();
const { Task } = require('../../models');
const { sequelize } = require('../../models');

// POST /api/tasks/reorder
router.post('/reorder', async (req, res) => {
  const { taskIds } = req.body;
  
  if (!Array.isArray(taskIds) || taskIds.length === 0) {
    return res.status(400).json({ error: 'taskIds must be a non-empty array' });
  }
  
  const transaction = await sequelize.transaction();
  
  try {
    // Update each task's position within the transaction
    await Promise.all(
      taskIds.map(async (taskId, index) => {
        await Task.update(
          { position: index },
          { where: { id: taskId }, transaction }
        );
      })
    );
    
    // Commit the transaction
    await transaction.commit();
    
    // Query updated tasks in new order
    const updatedTasks = await Task.findAll({
      where: { id: taskIds },
      order: [['position', 'ASC']]
    });
    
    // Return updated tasks
    res.json({ tasks: updatedTasks });
    
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error('Error updating task positions:', error);
    res.status(500).json({ error: 'Failed to update task positions' });
  }
});

module.exports = router;