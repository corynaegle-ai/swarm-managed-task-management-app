const request = require('supertest');
const app = require('../app');
const Task = require('../models/Task');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('DELETE /api/tasks/:id', () => {
  let authToken;
  let userId;
  let taskId;
  let otherUserToken;
  let otherUserId;

  beforeEach(async () => {
    // Create test user
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    await user.save();
    userId = user._id.toString();
    authToken = jwt.sign({ id: userId }, process.env.JWT_SECRET);

    // Create another test user
    const otherUser = new User({
      username: 'otheruser',
      email: 'other@example.com',
      password: 'hashedpassword'
    });
    await otherUser.save();
    otherUserId = otherUser._id.toString();
    otherUserToken = jwt.sign({ id: otherUserId }, process.env.JWT_SECRET);

    // Create test task
    const task = new Task({
      title: 'Test Task',
      description: 'Test Description',
      userId: userId
    });
    await task.save();
    taskId = task._id.toString();
  });

  afterEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
  });

  test('should delete task and return 204', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
    
    // Verify task was deleted from database
    const deletedTask = await Task.findById(taskId);
    expect(deletedTask).toBeNull();
  });

  test('should return 404 for non-existent task', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011';
    
    const response = await request(app)
      .delete(`/api/tasks/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Task not found');
  });

  test('should return 403 when trying to delete another user\'s task', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Access denied');
    
    // Verify task was not deleted
    const task = await Task.findById(taskId);
    expect(task).not.toBeNull();
  });

  test('should return 401 without authentication', async () => {
    const response = await request(app)
      .delete(`/api/tasks/${taskId}`);

    expect(response.status).toBe(401);
  });
});