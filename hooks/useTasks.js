import { useState, useEffect } from 'react';

const useTasks = ({ sort = null, order = 'desc', filter = null } = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data for demonstration - replace with actual API call
        const mockTasks = [
          {
            id: 1,
            title: 'Complete project documentation',
            description: 'Write comprehensive documentation for the new feature',
            priority: 'High',
            status: 'In Progress'
          },
          {
            id: 2,
            title: 'Fix authentication bug',
            description: 'Resolve login issues reported by users',
            priority: 'Critical',
            status: 'Open'
          },
          {
            id: 3,
            title: 'Update UI components',
            description: 'Modernize the user interface elements',
            priority: 'Medium',
            status: 'Open'
          },
          {
            id: 4,
            title: 'Optimize database queries',
            description: 'Improve performance of slow queries',
            priority: 'Low',
            status: 'Completed'
          },
          {
            id: 5,
            title: 'Security audit',
            description: 'Conduct comprehensive security review',
            priority: 'High',
            status: 'Open'
          }
        ];

        let processedTasks = [...mockTasks];

        // Apply sorting
        if (sort === 'priority') {
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          
          processedTasks.sort((a, b) => {
            const aPriority = priorityOrder[a.priority] || 0;
            const bPriority = priorityOrder[b.priority] || 0;
            
            if (order === 'desc') {
              return bPriority - aPriority;
            } else {
              return aPriority - bPriority;
            }
          });
        }

        // Apply filtering if needed
        if (filter) {
          processedTasks = processedTasks.filter(task => {
            // Add filtering logic based on filter object
            // For now, this is a placeholder
            return true;
          });
        }

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTasks(processedTasks);
      } catch (err) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [sort, order, filter]);

  return { tasks, loading, error };
};

export default useTasks;