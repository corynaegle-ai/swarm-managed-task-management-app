import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../services/taskService';

// Async thunk for deleting a task
export const deleteTaskAsync = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

// Async thunk for fetching tasks
export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTasks();
      return tasks;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    deletingTasks: {}, // Track deletion state per task
    deleteErrors: {}   // Track delete errors per task
  },
  reducers: {
    clearDeleteError: (state, action) => {
      delete state.deleteErrors[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete task
      .addCase(deleteTaskAsync.pending, (state, action) => {
        const taskId = action.meta.arg;
        state.deletingTasks[taskId] = true;
        delete state.deleteErrors[taskId];
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        const taskId = action.payload;
        delete state.deletingTasks[taskId];
        delete state.deleteErrors[taskId];
        // Remove task from items array
        state.items = state.items.filter(task => task.id !== taskId);
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        const taskId = action.meta.arg;
        delete state.deletingTasks[taskId];
        state.deleteErrors[taskId] = action.payload;
      });
  }
});

export const { clearDeleteError } = tasksSlice.actions;
export default tasksSlice.reducer;