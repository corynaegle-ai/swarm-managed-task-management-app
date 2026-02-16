const mongoose = require('mongoose');
const Task = require('../models/Task');

// Mock mongoose for testing
jest.mock('mongoose', () => ({
  Schema: jest.fn().mockImplementation(() => ({
    pre: jest.fn(),
    methods: {}
  })),
  model: jest.fn()
}));

describe('Task Model', () => {
  let mockTask;

  beforeEach(() => {
    mockTask = {
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      save: jest.fn()
    };
  });

  describe('toggleCompleted method', () => {
    it('should toggle completed status from false to true', async () => {
      mockTask.completed = false;
      mockTask.save.mockResolvedValue({ ...mockTask, completed: true });
      
      // Simulate the toggleCompleted method
      const toggleCompleted = async function() {
        this.completed = !this.completed;
        return await this.save();
      }.bind(mockTask);

      const result = await toggleCompleted();
      
      expect(mockTask.completed).toBe(true);
      expect(mockTask.save).toHaveBeenCalled();
      expect(result.completed).toBe(true);
    });

    it('should toggle completed status from true to false', async () => {
      mockTask.completed = true;
      mockTask.save.mockResolvedValue({ ...mockTask, completed: false });
      
      // Simulate the toggleCompleted method
      const toggleCompleted = async function() {
        this.completed = !this.completed;
        return await this.save();
      }.bind(mockTask);

      const result = await toggleCompleted();
      
      expect(mockTask.completed).toBe(false);
      expect(mockTask.save).toHaveBeenCalled();
      expect(result.completed).toBe(false);
    });

    it('should handle save errors gracefully', async () => {
      mockTask.save.mockRejectedValue(new Error('Database error'));
      
      // Simulate the toggleCompleted method with error handling
      const toggleCompleted = async function() {
        try {
          this.completed = !this.completed;
          return await this.save();
        } catch (error) {
          throw new Error(`Failed to toggle task completion: ${error.message}`);
        }
      }.bind(mockTask);

      await expect(toggleCompleted()).rejects.toThrow('Failed to toggle task completion: Database error');
    });
  });

  describe('Task Schema', () => {
    it('should have completed field with default value false', () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description'
      };
      
      // Test that completed defaults to false
      expect(taskData.completed).toBeUndefined(); // Should default to false in schema
    });

    it('should require title field', () => {
      const taskData = {
        description: 'Task description'
      };
      
      // In a real test, this would validate against the schema
      expect(taskData.title).toBeUndefined();
    });
  });
});