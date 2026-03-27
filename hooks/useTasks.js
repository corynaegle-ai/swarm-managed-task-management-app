import { useState, useEffect, useMemo } from 'react';

// Mock data for demonstration
const mockTasks = [
  {
    id: 1,
    title: 'Implement user authentication',
    description: 'Add login and registration functionality',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Design homepage layout',
    description: 'Create responsive homepage design',
    priority: 'Medium',
    status: 'Todo',
    createdAt: '2024-01-16'
  },
  {
    id: 3,
    title: 'Setup database',
    description: 'Configure PostgreSQL database',
    priority: 'High',
    status: 'Done',
    createdAt: '2024-01-14'
  },
  {
    id: 4,
    title: 'Write documentation',
    description: 'Document API endpoints',
    priority: 'Low',
    status: 'Todo',
    createdAt: '2024-01-17'
  },
  {
    id: 5,
    title: 'Add unit tests',
    description: 'Write comprehensive test suite',
    priority: 'Medium',
    status: 'In Progress',
    createdAt: '2024-01-18'
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  // Simulate API call
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setTasks(mockTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Initialize filters from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const priorityParam = urlParams.get('priority');
    const statusParam = urlParams.get('status');
    
    if (priorityParam) setPriorityFilter(priorityParam);
    if (statusParam) setStatusFilter(statusParam);
  }, []);

  // Filter tasks based on selected filters
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    return filtered;
  }, [tasks, priorityFilter, statusFilter]);

  const handlePriorityFilter = (priority) => {
    setPriorityFilter(priority);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    priorityFilter,
    statusFilter,
    handlePriorityFilter,
    handleStatusFilter
  };
};