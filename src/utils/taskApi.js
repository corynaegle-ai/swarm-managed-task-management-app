// Task API utility functions
export const updateTask = async (id, updates) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate occasional failures for testing
  if (Math.random() < 0.2) {
    throw new Error('Failed to save task. Please try again.');
  }
  
  // In a real app, this would be an actual API call
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};