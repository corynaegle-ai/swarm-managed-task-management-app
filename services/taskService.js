const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return null;
};

// Helper function to handle network errors
const handleNetworkError = (error) => {
  console.error('Network error:', error);
  throw new Error('Network error occurred. Please check your connection.');
};

// Get all tasks
export const getTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    throw error;
  }
};

// Update an existing task
export const updateTask = async (id, taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      handleNetworkError(error);
    }
    throw error;
  }
};

// Default export with all service methods
const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;