import { updateTask, fetchTasks, createTask, deleteTask } from '../taskApi';

// Mock fetch
global.fetch = jest.fn();

describe('taskApi', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const mockResponse = { id: 1, title: 'Updated Task' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await updateTask(1, { title: 'Updated Task' });
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/tasks/1',
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Updated Task' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error for empty title', async () => {
      await expect(updateTask(1, { title: '' })).rejects.toThrow(
        'Task title cannot be empty'
      );
    });

    it('should handle API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Task not found' }),
      });

      await expect(updateTask(1, { title: 'Test' })).rejects.toThrow(
        'Failed to update task: Task not found'
      );
    });
  });

  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      });

      const result = await fetchTasks();
      
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/tasks',
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual(mockTasks);
    });
  });
});