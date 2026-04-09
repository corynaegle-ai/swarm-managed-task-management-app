import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../hooks/useTasks';

// Mock fetch
global.fetch = jest.fn();

describe('useTasks hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('toggleTaskCompletion', () => {
    it('should toggle task completion status optimistically', async () => {
      const mockTasks = [
        { id: 1, title: 'Test Task', completed: false },
        { id: 2, title: 'Another Task', completed: true }
      ];

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTasks
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, title: 'Test Task', completed: true })
        });

      const { result } = renderHook(() => useTasks());

      // Wait for initial fetch to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Toggle completion
      await act(async () => {
        await result.current.toggleTaskCompletion(1);
      });

      // Verify task was toggled in local state
      expect(result.current.tasks[0].completed).toBe(true);
      
      // Verify API was called with correct parameters
      expect(fetch).toHaveBeenCalledWith('/api/tasks/1/complete', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true })
      });
    });

    it('should revert optimistic update on API failure', async () => {
      const mockTasks = [
        { id: 1, title: 'Test Task', completed: false }
      ];

      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockTasks
        })
        .mockRejectedValueOnce(new Error('API Error'));

      const { result } = renderHook(() => useTasks());

      // Wait for initial fetch to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Toggle completion (should fail)
      await act(async () => {
        try {
          await result.current.toggleTaskCompletion(1);
        } catch (error) {
          // Expected to throw
        }
      });

      // Verify task completion was reverted to original state
      expect(result.current.tasks[0].completed).toBe(false);
    });

    it('should throw error for non-existent task', async () => {
      const mockTasks = [];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks
      });

      const { result } = renderHook(() => useTasks());

      // Wait for initial fetch to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Try to toggle non-existent task
      await act(async () => {
        await expect(result.current.toggleTaskCompletion(999)).rejects.toThrow('Task not found');
      });
    });
  });
});