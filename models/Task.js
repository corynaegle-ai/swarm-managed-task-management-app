const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to toggle completion status and save
taskSchema.methods.toggleCompleted = async function() {
  try {
    this.completed = !this.completed;
    const updatedTask = await this.save();
    return updatedTask;
  } catch (error) {
    throw new Error(`Failed to toggle task completion: ${error.message}`);
  }
};

// Method to mark task as completed
taskSchema.methods.markCompleted = async function() {
  try {
    this.completed = true;
    const updatedTask = await this.save();
    return updatedTask;
  } catch (error) {
    throw new Error(`Failed to mark task as completed: ${error.message}`);
  }
};

// Method to mark task as incomplete
taskSchema.methods.markIncomplete = async function() {
  try {
    this.completed = false;
    const updatedTask = await this.save();
    return updatedTask;
  } catch (error) {
    throw new Error(`Failed to mark task as incomplete: ${error.message}`);
  }
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;