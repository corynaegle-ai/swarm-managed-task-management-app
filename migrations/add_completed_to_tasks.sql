-- Migration: Add completed column to tasks table
-- This migration adds a completed boolean field to track task completion status

-- Add completed column with default value of false (0)
ALTER TABLE tasks ADD COLUMN completed BOOLEAN DEFAULT 0;

-- Create index on completed column for faster queries
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Update existing tasks to have completed = false by default
UPDATE tasks SET completed = 0 WHERE completed IS NULL;