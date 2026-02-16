// Mock API service for task management
// In a real application, this would make HTTP requests to a backend API

class TaskService {
  constructor() {
    // Initialize with some mock data
    this.tasks = [
      {
        id: '1',
        title: 'Sample Task 1',
        description: 'This is a sample task for testing',
        status: 'pending',
        priority: 'high',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Sample Task 2',
        description: 'Another sample task',
        status: 'completed',
        priority: 'medium',
        createdAt: new Date().toISOString()
      }
    ];
  }

  // Simulate API delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all tasks
  async getTasks() {
    await this.delay(500); // Simulate network delay
    return [...this.tasks];
  }

  // Get a single task by ID
  async getTask(id) {
    await this.delay(300);
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return task;
  }

  // Delete a task
  async deleteTask(id) {
    await this.delay(800); // Simulate network delay
    
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    // Simulate occasional API errors (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Server error: Unable to delete task');
    }
    
    this.tasks.splice(taskIndex, 1);
    return { success: true, deletedId: id };
  }

  // Create a new task
  async createTask(taskData) {
    await this.delay(600);
    
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString()
    };
    
    this.tasks.push(newTask);
    return newTask;
  }

  // Update an existing task
  async updateTask(id, updates) {
    await this.delay(500);
    
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.tasks[taskIndex];
  }
}

// Export a singleton instance
export const taskService = new TaskService();
export default taskService;