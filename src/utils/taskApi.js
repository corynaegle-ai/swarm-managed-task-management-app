// Task API utility functions
export const updateTask = async (id, updates) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const error = new Error(`Failed to update task: ${response.status} ${response.statusText}`);
      error.type = 'HTTP_ERROR';
      error.status = response.status;
      throw error;
    }
    
    return response.json();
  } catch (error) {
    // Handle network failures (no response) separately from HTTP errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const networkError = new Error('Network error: Unable to reach the server. Please check your connection.');
      networkError.type = 'NETWORK_ERROR';
      throw networkError;
    }
    // Re-throw other errors (including HTTP errors from response.ok check)
    throw error;
  }
};