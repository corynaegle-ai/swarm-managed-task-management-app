const db = require('../config/database');

class Task {
  constructor({ id, title, description, completed = false, created_at, updated_at }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Save task (create or update)
  async save() {
    if (this.id) {
      // Update existing task
      const query = `
        UPDATE tasks 
        SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      await db.run(query, [this.title, this.description, this.completed, this.id]);
      return this.reload();
    } else {
      // Create new task
      const query = `
        INSERT INTO tasks (title, description, completed, created_at, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      
      const result = await db.run(query, [this.title, this.description, this.completed]);
      this.id = result.lastID;
      return this.reload();
    }
  }

  // Reload task data from database
  async reload() {
    const task = await Task.findById(this.id);
    Object.assign(this, task);
    return this;
  }

  // Toggle completion status
  async toggleCompleted() {
    this.completed = !this.completed;
    return await this.save();
  }

  // Delete task
  async delete() {
    const query = 'DELETE FROM tasks WHERE id = ?';
    await db.run(query, [this.id]);
  }

  // Static methods
  static async findById(id) {
    const query = 'SELECT * FROM tasks WHERE id = ?';
    const row = await db.get(query, [id]);
    
    if (!row) {
      return null;
    }
    
    return new Task({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: Boolean(row.completed),
      created_at: row.created_at,
      updated_at: row.updated_at
    });
  }

  static async getAll() {
    const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
    const rows = await db.all(query);
    
    return rows.map(row => new Task({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: Boolean(row.completed),
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }

  static async findByCompleted(completed = true) {
    const query = 'SELECT * FROM tasks WHERE completed = ? ORDER BY created_at DESC';
    const rows = await db.all(query, [completed ? 1 : 0]);
    
    return rows.map(row => new Task({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: Boolean(row.completed),
      created_at: row.created_at,
      updated_at: row.updated_at
    }));
  }
}

module.exports = Task;