import { renderHook, act } from '@testing-library/react';
import { useTaskUpdate } from '../useTasks';
import * as taskApi from '../../utils/taskApi';

// Mock the taskApi
jest.mock('../../utils/taskApi');
const mockUpdateTask = taskApi.updateTask;

describe('useTaskUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should apply optimistic update and call API', async () => {
    const mockUpdatedTask = { id: '123', title: 'Updated Title' };
    mockUpdateTask.mockResolvedValue(mockUpdatedTask);
    
    const { result } = renderHook(() => useTaskUpdate());
    
    const mockOptimisticUpdate = jest.fn();
    const mockRevert = jest.fn();

    await act(async () => {
      await result.current.updateTaskOptimistically(
        '123',
        { title: 'Updated Title' },
        mockOptimisticUpdate,
        mockRevert
      );
    });

    expect(mockOptimisticUpdate).toHaveBeenCalledTimes(2);
    expect(mockOptimisticUpdate).toHaveBeenNthCalledWith(1, { id: '123', title: 'Updated Title' });
    expect(mockOptimisticUpdate).toHaveBeenNthCalledWith(2, mockUpdatedTask);
    expect(mockRevert).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });

  it('should revert optimistic update on API failure', async () => {
    mockUpdateTask.mockRejectedValue(new Error('API Error'));
    
    const { result } = renderHook(() => useTaskUpdate());
    
    const mockOptimisticUpdate = jest.fn();
    const mockRevert = jest.fn();

    await act(async () => {
      try {
        await result.current.updateTaskOptimistically(
          '123',
          { title: 'Updated Title' },
          mockOptimisticUpdate,
          mockRevert
        );
      } catch (error) {
        // Expected to throw
      }
    });

    expect(mockOptimisticUpdate).toHaveBeenCalledTimes(1);
    expect(mockRevert).toHaveBeenCalledWith('123');
    expect(result.current.error).toBe('API Error');
  });
});