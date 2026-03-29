// Task API utilities for making HTTP requests

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Custom error class for API errors
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Generic fetch wrapper with error handling
const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error.message || 'Network error occurred',
      0,
      { originalError: error }
    );
  }
};

// Update a task by ID
export const updateTask = async (id, updates) => {
  if (!id) {
    throw new ApiError('Task ID is required', 400);
  }

  if (!updates || typeof updates !== 'object') {
    throw new ApiError('Updates object is required', 400);
  }

  // Validate required fields
  if (updates.title !== undefined && (!updates.title || updates.title.trim() === '')) {
    throw new ApiError('Task title cannot be empty', 400);
  }

  try {
    const result = await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    return result;
  } catch (error) {
    // Re-throw with more context
    throw new ApiError(
      `Failed to update task: ${error.message}`,
      error.status,
      error.data
    );
  }
};

// Fetch all tasks
export const fetchTasks = async () => {
  try {
    return await apiRequest('/tasks');
  } catch (error) {
    throw new ApiError(
      `Failed to fetch tasks: ${error.message}`,
      error.status,
      error.data
    );
  }
};

// Create a new task
export const createTask = async (taskData) => {
  if (!taskData || !taskData.title) {
    throw new ApiError('Task title is required', 400);
  }

  try {
    return await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  } catch (error) {
    throw new ApiError(
      `Failed to create task: ${error.message}`,
      error.status,
      error.data
    );
  }
};

// Delete a task
export const deleteTask = async (id) => {
  if (!id) {
    throw new ApiError('Task ID is required', 400);
  }

  try {
    return await apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw new ApiError(
      `Failed to delete task: ${error.message}`,
      error.status,
      error.data
    );
  }
};