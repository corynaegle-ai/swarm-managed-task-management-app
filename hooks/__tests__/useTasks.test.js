import { renderHook, act } from '@testing-library/react';
import useTasks from '../useTasks';

// Mock fetch
global.fetch = jest.fn();

describe('useTasks Hook', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch tasks with completion status', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks
    });

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.tasks[0].completed).toBe(false);
    expect(result.current.tasks[1].completed).toBe(true);
  });

  it('should toggle task completion status', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false }
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, title: 'Task 1', completed: true })
      });

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.toggleComplete(1);
    });

    expect(fetch).toHaveBeenCalledWith('/api/tasks/1', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: true })
    });
    expect(result.current.tasks[0].completed).toBe(true);
  });

  it('should preserve completion status across task operations', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: true }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks
    });

    const { result } = renderHook(() => useTasks());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.tasks[0].completed).toBe(true);
  });
});