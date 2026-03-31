/**
 * Task API utility functions
 */

const API_BASE_URL = '/api';

/**
 * Update a task by ID
 * @param {string} taskId - The ID of the task to update
 * @param {Object} updates - The updates to apply to the task
 * @returns {Promise<Object>} The updated task data
 * @throws {Error} If the API request fails or returns invalid data
 */
export const updateTask = async (taskId, updates) => {
  if (!taskId) {
    throw new Error('Task ID is required');
  }

  if (!updates || typeof updates !== 'object') {
    throw new Error('Updates object is required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const updatedTask = await response.json();
    
    // Validate response has required fields
    if (!updatedTask || typeof updatedTask.id === 'undefined') {
      throw new Error('Invalid response: missing task data');
    }

    return updatedTask;
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server');
    }
    throw error;
  }
};

export default {
  updateTask,
};