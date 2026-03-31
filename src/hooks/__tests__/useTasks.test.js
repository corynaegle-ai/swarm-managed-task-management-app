import { renderHook, act } from '@testing-library/react';
import useTasks from '../useTasks';
import * as taskService from '../../services/taskService';

// Mock the task service
jest.mock('../../services/taskService');

const mockTasks = [
  { id: '1', title: 'Task 1', completed: false, order: 1 },
  { id: '2', title: 'Task 2', completed: true, order: 2 },
  { id: '3', title: 'Task 3', completed: false, order: 3 }
];

describe('useTasks hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    taskService.fetchTasks.mockResolvedValue(mockTasks);
  });

  test('should expose reorderTasks function', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.reorderTasks).toBeDefined();
    expect(typeof result.current.reorderTasks).toBe('function');
  });

  test('should implement optimistic updates for reorderTasks', async () => {
    const { result } = renderHook(() => useTasks());
    
    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    const reorderedTasks = [
      mockTasks[2], // Move task 3 to first
      mockTasks[0], // Move task 1 to second
      mockTasks[1]  // Move task 2 to third
    ];
    
    taskService.reorderTasks.mockResolvedValue();
    
    await act(async () => {
      await result.current.reorderTasks(reorderedTasks);
    });
    
    // Check that tasks were immediately updated (optimistic)
    expect(result.current.tasks).toEqual(reorderedTasks);
    expect(taskService.reorderTasks).toHaveBeenCalledWith(['3', '1', '2']);
  });

  test('should revert to previous order on API failure', async () => {
    const { result } = renderHook(() => useTasks());
    
    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    const originalOrder = result.current.tasks;
    const reorderedTasks = [mockTasks[2], mockTasks[0], mockTasks[1]];
    
    taskService.reorderTasks.mockRejectedValue(new Error('API Error'));
    
    await act(async () => {
      try {
        await result.current.reorderTasks(reorderedTasks);
      } catch (error) {
        // Expected to throw
      }
    });
    
    // Check that tasks were reverted to original order
    expect(result.current.tasks).toEqual(originalOrder);
    expect(result.current.error).toBe('API Error');
  });

  test('should manage loading state during reorder operations', async () => {
    const { result } = renderHook(() => useTasks());
    
    // Wait for initial load
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    const reorderedTasks = [mockTasks[2], mockTasks[0], mockTasks[1]];
    let resolveReorder;
    taskService.reorderTasks.mockImplementation(() => 
      new Promise(resolve => { resolveReorder = resolve; })
    );
    
    // Start reorder operation
    act(() => {
      result.current.reorderTasks(reorderedTasks);
    });
    
    // Check loading state is true during operation
    expect(result.current.reorderLoading).toBe(true);
    
    // Complete the operation
    await act(async () => {
      resolveReorder();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Check loading state is false after completion
    expect(result.current.reorderLoading).toBe(false);
  });
});