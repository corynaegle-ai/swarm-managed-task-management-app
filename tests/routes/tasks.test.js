const request = require('supertest');
const app = require('../../app');
const Task = require('../../models/Task');

describe('PUT /api/tasks/:id/complete', () => {
  let testTask;

  beforeEach(async () => {
    // Create a test task
    testTask = new Task({ title: 'Test Task', description: 'Test Description' });
    await testTask.save();
  });

  afterEach(async () => {
    // Clean up test data
    if (testTask && testTask.id) {
      await testTask.delete();
    }
  });

  it('should toggle task completion status from false to true', async () => {
    expect(testTask.completed).toBe(false);

    const response = await request(app)
      .put(`/api/tasks/${testTask.id}/complete`)
      .expect(200);

    expect(response.body.completed).toBe(true);
    expect(response.body.id).toBe(testTask.id);
    expect(response.body.title).toBe(testTask.title);
  });

  it('should toggle task completion status from true to false', async () => {
    // First, mark the task as completed
    await testTask.toggleCompleted();
    expect(testTask.completed).toBe(true);

    const response = await request(app)
      .put(`/api/tasks/${testTask.id}/complete`)
      .expect(200);

    expect(response.body.completed).toBe(false);
    expect(response.body.id).toBe(testTask.id);
  });

  it('should return 404 for non-existent task', async () => {
    const nonExistentId = 99999;

    const response = await request(app)
      .put(`/api/tasks/${nonExistentId}/complete`)
      .expect(404);

    expect(response.body.error).toBe('Task not found');
  });

  it('should handle database errors gracefully', async () => {
    // Mock Task.findById to throw an error
    const originalFindById = Task.findById;
    Task.findById = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .put(`/api/tasks/${testTask.id}/complete`)
      .expect(500);

    expect(response.body.error).toBe('Internal server error');

    // Restore original method
    Task.findById = originalFindById;
  });
});