// Mock API implementation for task updates
// In a real application, this would make HTTP requests to your backend

export const updateTask = async (taskId, updates) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Simulate potential API errors
      if (Math.random() < 0.1) { // 10% chance of error
        reject(new Error('Network error: Failed to update task'));
        return;
      }

      // Simulate successful update
      console.log(`Task ${taskId} updated:`, updates);
      resolve({ id: taskId, ...updates });
    }, 200);
  });
};