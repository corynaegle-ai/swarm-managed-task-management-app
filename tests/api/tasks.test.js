const request = require('supertest');
const app = require('../../app');
const Task = require('../../models/Task');
const User = require('../../models/User');

describe('PUT /api/tasks/reorder', () => {
  let user, authToken, task1, task2;

  beforeEach(async () => {
    // Setup test user and tasks
    user = new User({ email: 'test@example.com', password: 'password123' });
    await user.save();
    authToken = user.generateAuthToken();

    task1 = new Task({ title: 'Task 1', userId: user._id });
    task2 = new Task({ title: 'Task 2', userId: user._id });
    await task1.save();
    await task2.save();
  });

  afterEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
  });

  it('should return 400 for invalid taskIds (not array)', async () => {
    const response = await request(app)
      .put('/api/tasks/reorder')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ taskIds: 'not-an-array' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('taskIds must be a non-empty array');
  });

  it('should return 400 for empty taskIds array', async () => {
    const response = await request(app)
      .put('/api/tasks/reorder')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ taskIds: [] });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('taskIds must be a non-empty array');
  });

  it('should return 401 for unauthenticated user', async () => {
    const response = await request(app)
      .put('/api/tasks/reorder')
      .send({ taskIds: [task1._id.toString()] });

    expect(response.status).toBe(401);
  });

  it('should return 404 for non-existent task IDs', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const response = await request(app)
      .put('/api/tasks/reorder')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ taskIds: [fakeId] });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('One or more tasks not found or do not belong to user');
  });

  it('should return 200 for valid taskIds belonging to user', async () => {
    const taskIds = [task1._id.toString(), task2._id.toString()];
    const response = await request(app)
      .put('/api/tasks/reorder')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ taskIds });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Validation successful');
    expect(response.body.taskIds).toEqual(taskIds);
  });
});