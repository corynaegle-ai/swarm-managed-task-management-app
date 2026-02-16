// Task API utility functions
export const updateTask = async (id, updates) => {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};