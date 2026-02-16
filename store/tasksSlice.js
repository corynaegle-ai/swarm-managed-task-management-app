import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../services/taskService';

// Async thunk for creating a task
export const createTaskAsync = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskService.createTask(taskData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

// Async thunk for fetching tasks
export const fetchTasksAsync = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskService.getTasks();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

// Async thunk for updating a task
export const updateTaskAsync = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await taskService.updateTask(id, updates);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

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

const initialState = {
  tasks: [],
  loading: false,
  taskLoadingStates: {}, // Track loading state for individual tasks
  error: null
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTaskLoading: (state, action) => {
      const { taskId, loading } = action.payload;
      state.taskLoadingStates[taskId] = loading;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create task cases
      .addCase(createTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch tasks cases
      .addCase(fetchTasksAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update task cases
      .addCase(updateTaskAsync.pending, (state, action) => {
        const taskId = action.meta.arg.id;
        state.taskLoadingStates[taskId] = true;
        state.error = null;
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
        state.taskLoadingStates[updatedTask.id] = false;
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        const taskId = action.meta.arg.id;
        state.taskLoadingStates[taskId] = false;
        state.error = action.payload;
      })
      // Delete task cases
      .addCase(deleteTaskAsync.pending, (state, action) => {
        const taskId = action.meta.arg;
        state.taskLoadingStates[taskId] = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        const taskId = action.payload;
        state.tasks = state.tasks.filter(task => task.id !== taskId);
        delete state.taskLoadingStates[taskId];
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        const taskId = action.meta.arg;
        state.taskLoadingStates[taskId] = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setTaskLoading } = tasksSlice.actions;
export default tasksSlice.reducer;