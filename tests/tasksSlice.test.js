import tasksReducer, {
  deleteTaskAsync,
  createTaskAsync,
  fetchTasksAsync,
  updateTaskAsync,
  clearError
} from '../store/tasksSlice';
import { configureStore } from '@reduxjs/toolkit';
import taskService from '../services/taskService';

// Mock the task service
jest.mock('../services/taskService');

describe('tasksSlice', () => {
  const initialState = {
    tasks: [],
    loading: false,
    taskLoadingStates: {},
    error: null
  };

  describe('deleteTaskAsync', () => {
    it('should handle deleteTask.pending', () => {
      const action = { type: deleteTaskAsync.pending.type, meta: { arg: '1' } };
      const state = tasksReducer(initialState, action);
      
      expect(state.taskLoadingStates['1']).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle deleteTask.fulfilled', () => {
      const stateWithTasks = {
        ...initialState,
        tasks: [{ id: '1', title: 'Task 1' }, { id: '2', title: 'Task 2' }],
        taskLoadingStates: { '1': true }
      };
      
      const action = { 
        type: deleteTaskAsync.fulfilled.type, 
        payload: '1',
        meta: { arg: '1' }
      };
      
      const state = tasksReducer(stateWithTasks, action);
      
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].id).toBe('2');
      expect(state.taskLoadingStates['1']).toBeUndefined();
    });

    it('should handle deleteTask.rejected', () => {
      const stateWithLoading = {
        ...initialState,
        taskLoadingStates: { '1': true }
      };
      
      const action = { 
        type: deleteTaskAsync.rejected.type, 
        payload: 'Delete failed',
        meta: { arg: '1' }
      };
      
      const state = tasksReducer(stateWithLoading, action);
      
      expect(state.taskLoadingStates['1']).toBe(false);
      expect(state.error).toBe('Delete failed');
    });
  });

  describe('async thunks', () => {
    let store;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          tasks: tasksReducer
        }
      });
      jest.clearAllMocks();
    });

    it('should call taskService.deleteTask when deleteTaskAsync is dispatched', async () => {
      taskService.deleteTask.mockResolvedValue();
      
      await store.dispatch(deleteTaskAsync('1'));
      
      expect(taskService.deleteTask).toHaveBeenCalledWith('1');
    });

    it('should handle deleteTask service rejection', async () => {
      const errorMessage = 'Network error';
      taskService.deleteTask.mockRejectedValue(new Error(errorMessage));
      
      const result = await store.dispatch(deleteTaskAsync('1'));
      
      expect(result.type).toBe(deleteTaskAsync.rejected.type);
      expect(result.payload).toBe(errorMessage);
    });
  });

  describe('other reducers', () => {
    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error'
      };
      
      const state = tasksReducer(stateWithError, clearError());
      
      expect(state.error).toBe(null);
    });
  });
});