-- Migration: Add completed boolean field to tasks table
-- Created: 2024
-- Description: Adds a completed column to track task completion status

ALTER TABLE tasks ADD COLUMN completed BOOLEAN DEFAULT FALSE;

-- Verify the column was added successfully
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'tasks' AND column_name = 'completed';