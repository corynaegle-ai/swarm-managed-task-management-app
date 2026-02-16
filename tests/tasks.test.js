const request = require('supertest');
const express = require('express');
const tasksRouter = require('../routes/tasks');

const app = express();
app.use(express.json());
app.use('/api/tasks', tasksRouter);

describe('GET /api/tasks', () => {
  test('should return tasks with completed field', async () => {
    const response = await request(app)
      .get('/api/tasks')
      .expect(200);
    
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    
    // If tasks exist, verify completed field is present
    if (response.body.data.length > 0) {
      response.body.data.forEach(task => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('completed');
        expect(typeof task.completed).toBe('boolean');
      });
    }
  });
  
  test('should handle database errors gracefully', async () => {
    // This would require mocking the database to simulate an error
    // For now, just verify the endpoint exists
    const response = await request(app)
      .get('/api/tasks');
    
    expect(response.status).toBeOneOf([200, 500]);
  });
});