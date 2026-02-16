// Task service for API communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class TaskService {
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getTasks() {
    try {
      return await this.makeRequest('/tasks');
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw new Error('Failed to load tasks. Please check your connection.');
    }
  }

  async createTask(taskData) {
    try {
      return await this.makeRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      });
    } catch (error) {
      console.error('Failed to create task:', error);
      throw new Error('Failed to create task. Please try again.');
    }
  }

  async updateTask(taskId, updates) {
    try {
      return await this.makeRequest(`/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      throw new Error('Failed to update task. Please try again.');
    }
  }

  async deleteTask(taskId) {
    try {
      return await this.makeRequest(`/tasks/${taskId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw new Error('Failed to delete task. Please try again.');
    }
  }

  async reorderTasks(taskOrder) {
    try {
      return await this.makeRequest('/tasks/reorder', {
        method: 'POST',
        body: JSON.stringify({ order: taskOrder })
      });
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
      throw new Error('Failed to reorder tasks. Please try again.');
    }
  }
}

export const taskService = new TaskService();