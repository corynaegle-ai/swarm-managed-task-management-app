import { useState, useEffect } from 'react';

const useTasks = ({ sort = 'priority', order = 'asc', priorityFilter = null } = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (sort) params.set('sort', sort);
        if (order) params.set('order', order);
        if (priorityFilter) params.set('priority', priorityFilter);
        
        // Mock API call - replace with actual API endpoint
        const response = await fetch(`/api/tasks?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Apply client-side filtering and sorting if API doesn't support it
        let filteredTasks = data.tasks || data;
        
        // Filter by priority if specified
        if (priorityFilter) {
          filteredTasks = filteredTasks.filter(task => 
            task.priority && task.priority.toLowerCase() === priorityFilter.toLowerCase()
          );
        }
        
        // Sort by priority
        if (sort === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          filteredTasks.sort((a, b) => {
            const aPriority = priorityOrder[a.priority?.toLowerCase()] || 0;
            const bPriority = priorityOrder[b.priority?.toLowerCase()] || 0;
            
            if (order === 'desc') {
              return bPriority - aPriority;
            }
            return aPriority - bPriority;
          });
        }
        
        setTasks(filteredTasks);
      } catch (err) {
        setError(err);
        console.error('Error fetching tasks:', err);
        
        // Fallback to mock data for development
        const mockTasks = [
          { id: 1, title: 'High Priority Task', priority: 'high', status: 'pending' },
          { id: 2, title: 'Medium Priority Task', priority: 'medium', status: 'in-progress' },
          { id: 3, title: 'Low Priority Task', priority: 'low', status: 'completed' },
          { id: 4, title: 'Another High Task', priority: 'high', status: 'pending' }
        ];
        
        let filteredMockTasks = mockTasks;
        
        if (priorityFilter) {
          filteredMockTasks = mockTasks.filter(task => 
            task.priority.toLowerCase() === priorityFilter.toLowerCase()
          );
        }
        
        if (sort === 'priority') {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          filteredMockTasks.sort((a, b) => {
            const aPriority = priorityOrder[a.priority.toLowerCase()];
            const bPriority = priorityOrder[b.priority.toLowerCase()];
            
            if (order === 'desc') {
              return bPriority - aPriority;
            }
            return aPriority - bPriority;
          });
        }
        
        setTasks(filteredMockTasks);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [sort, order, priorityFilter]);

  return { tasks, loading, error };
};

export default useTasks;