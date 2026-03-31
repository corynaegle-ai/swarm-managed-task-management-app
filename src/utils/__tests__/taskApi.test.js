import { updateTask } from '../taskApi';

// Mock fetch
global.fetch = jest.fn();

describe('taskApi', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('updateTask', () => {
    it('should make PUT request to correct endpoint', async () => {
      const mockTask = { id: '123', title: 'Updated Task' };
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTask,
      });

      const result = await updateTask('123', { title: 'Updated Task' });

      expect(fetch).toHaveBeenCalledWith('/api/tasks/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Task' }),
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw error for missing taskId', async () => {
      await expect(updateTask('', { title: 'test' })).rejects.toThrow('Task ID is required');
    });

    it('should throw error for missing updates', async () => {
      await expect(updateTask('123', null)).rejects.toThrow('Updates object is required');
    });

    it('should handle API errors', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Task not found' }),
      });

      await expect(updateTask('123', { title: 'test' })).rejects.toThrow('Task not found');
    });
  });
});