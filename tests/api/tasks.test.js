const request = require('supertest');
const app = require('../../app');
const { Task, sequelize } = require('../../models');

describe('POST /api/tasks/reorder', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    
    // Create test tasks
    await Task.bulkCreate([
      { id: 1, title: 'Task 1', position: 0 },
      { id: 2, title: 'Task 2', position: 1 },
      { id: 3, title: 'Task 3', position: 2 }
    ]);
  });
  
  afterEach(async () => {
    await Task.destroy({ where: {}, truncate: true });
  });
  
  it('should update task positions in database using transaction', async () => {
    const taskIds = [3, 1, 2];
    
    const response = await request(app)
      .post('/api/tasks/reorder')
      .send({ taskIds })
      .expect(200);
    
    // Verify positions were updated
    const task1 = await Task.findByPk(1);
    const task2 = await Task.findByPk(2);
    const task3 = await Task.findByPk(3);
    
    expect(task3.position).toBe(0);
    expect(task1.position).toBe(1);
    expect(task2.position).toBe(2);
  });
  
  it('should return updated tasks in new order', async () => {
    const taskIds = [2, 3, 1];
    
    const response = await request(app)
      .post('/api/tasks/reorder')
      .send({ taskIds })
      .expect(200);
    
    expect(response.body.tasks).toHaveLength(3);
    expect(response.body.tasks[0].id).toBe(2);
    expect(response.body.tasks[1].id).toBe(3);
    expect(response.body.tasks[2].id).toBe(1);
  });
  
  it('should rollback transaction on error', async () => {
    const taskIds = [999]; // Non-existent task
    
    await request(app)
      .post('/api/tasks/reorder')
      .send({ taskIds })
      .expect(500);
    
    // Verify original positions unchanged
    const tasks = await Task.findAll({ order: [['id', 'ASC']] });
    expect(tasks[0].position).toBe(0);
    expect(tasks[1].position).toBe(1);
    expect(tasks[2].position).toBe(2);
  });
  
  it('should return 400 for invalid taskIds', async () => {
    await request(app)
      .post('/api/tasks/reorder')
      .send({ taskIds: [] })
      .expect(400);
    
    await request(app)
      .post('/api/tasks/reorder')
      .send({ taskIds: 'invalid' })
      .expect(400);
  });
});