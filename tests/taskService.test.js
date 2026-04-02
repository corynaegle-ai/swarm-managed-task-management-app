import { deleteTask } from '../services/taskService';

// Mock fetch globally
global.fetch = jest.fn();

describe('taskService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('deleteTask', () => {
    it('should make DELETE request to correct endpoint', async () => {
      const taskId = '123';
      const mockResponse = { ok: true, status: 204 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: {
          get: () => null
        },
        text: () => Promise.resolve('')
      });

      await deleteTask(taskId);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/tasks/123',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should handle network errors appropriately', async () => {
      const taskId = '123';
      
      fetch.mockRejectedValueOnce(new TypeError('Network error'));

      await expect(deleteTask(taskId)).rejects.toThrow(
        'Network error occurred. Please check your connection.'
      );
    });

    it('should handle API errors appropriately', async () => {
      const taskId = '123';
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Task not found')
      });

      await expect(deleteTask(taskId)).rejects.toThrow(
        'API Error: 404 - Task not found'
      );
    });

    it('should return a promise that resolves on successful deletion', async () => {
      const taskId = '123';
      
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: {
          get: () => null
        },
        text: () => Promise.resolve('')
      });

      const result = await deleteTask(taskId);
      expect(result).toBeNull();
    });
  });
});