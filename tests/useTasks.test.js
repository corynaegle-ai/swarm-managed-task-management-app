import { renderHook, waitFor } from '@testing-library/react';
import useTasks from '../hooks/useTasks';

describe('useTasks', () => {
  test('returns tasks sorted by priority in descending order by default', async () => {
    const { result } = renderHook(() => useTasks({ sort: 'priority', order: 'desc' }));
    
    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.tasks).toHaveLength(5);
    expect(result.current.tasks[0].priority).toBe('Critical');
    expect(result.current.error).toBeNull();
  });

  test('returns tasks sorted by priority in ascending order', async () => {
    const { result } = renderHook(() => useTasks({ sort: 'priority', order: 'asc' }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.tasks).toHaveLength(5);
    expect(result.current.tasks[0].priority).toBe('Low');
    expect(result.current.tasks[result.current.tasks.length - 1].priority).toBe('Critical');
  });

  test('handles sorting correctly with priority order: Critical > High > Medium > Low', async () => {
    const { result } = renderHook(() => useTasks({ sort: 'priority', order: 'desc' }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const priorities = result.current.tasks.map(task => task.priority);
    const priorityValues = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    
    // Check that tasks are sorted in descending order of priority
    for (let i = 0; i < priorities.length - 1; i++) {
      expect(priorityValues[priorities[i]]).toBeGreaterThanOrEqual(
        priorityValues[priorities[i + 1]]
      );
    }
  });

  test('updates when sort parameters change', async () => {
    const { result, rerender } = renderHook(
      ({ sort, order }) => useTasks({ sort, order }),
      {
        initialProps: { sort: 'priority', order: 'desc' }
      }
    );
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const initialFirstTask = result.current.tasks[0];
    
    rerender({ sort: 'priority', order: 'asc' });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // First task should be different after reordering
    expect(result.current.tasks[0]).not.toEqual(initialFirstTask);
  });
});