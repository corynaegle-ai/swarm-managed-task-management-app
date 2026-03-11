# TaskItem Component Documentation

## Overview

The `TaskItem` component provides a complete task display and editing interface with inline editing capabilities, state management, and validation. It handles both display and edit modes with proper callback patterns for parent component integration.

## Component Interface

### Props

```typescript
interface TaskItemProps {
  task: Task;
  onEdit: (id: string, updates: Partial<TaskInput>) => void;
  onToggleComplete: (id: string) => void;
  isEditing: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
}
```

### Prop Descriptions

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `task` | `Task` | Yes | The task object to display/edit |
| `onEdit` | `Function` | Yes | Callback fired when task updates are saved |
| `onToggleComplete` | `Function` | Yes | Callback fired when task completion status changes |
| `isEditing` | `boolean` | Yes | Controls whether component is in edit mode |
| `onEditStart` | `Function` | Yes | Callback fired when edit mode is initiated |
| `onEditCancel` | `Function` | Yes | Callback fired when edit mode is cancelled |

## Usage Examples

### Basic Usage

```tsx
import React, { useState } from 'react';
import { TaskItem } from './TaskItem';

function TaskList() {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleEdit = (id: string, updates: Partial<TaskInput>) => {
    // Update task via API
    updateTask(id, updates).then(() => {
      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        )
      );
      setEditingTaskId(null);
    });
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      handleEdit(id, { completed: !task.completed });
    }
  };

  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={handleEdit}
          onToggleComplete={handleToggleComplete}
          isEditing={editingTaskId === task.id}
          onEditStart={() => setEditingTaskId(task.id)}
          onEditCancel={() => setEditingTaskId(null)}
        />
      ))}
    </div>
  );
}
```

### With Error Handling

```tsx
import React, { useState } from 'react';
import { TaskItem } from './TaskItem';
import { toast } from 'react-hot-toast';

function TaskListWithErrorHandling() {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleEdit = async (id: string, updates: Partial<TaskInput>) => {
    try {
      const response = await updateTask(id, updates);
      
      if (response.success) {
        setTasks(prev => 
          prev.map(task => 
            task.id === id ? response.data : task
          )
        );
        setEditingTaskId(null);
        toast.success('Task updated successfully');
      } else {
        toast.error(response.error || 'Failed to update task');
      }
    } catch (error) {
      toast.error('An error occurred while updating the task');
    }
  };

  // ... rest of component
}
```

## TaskInput Validation

### Validation Rules

The component validates input according to these rules:

```typescript
interface TaskInput {
  title: string;        // 3-200 characters, required
  description?: string; // 0-1000 characters, optional
  priority: Priority;   // Must be valid Priority enum value
  dueDate?: string;     // ISO 8601 format, optional
  completed: boolean;   // Boolean value
  tags?: string[];      // Max 10 items, each max 50 characters
}

enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}
```

### Client-Side Validation Example

```tsx
const validateTaskInput = (input: Partial<TaskInput>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (input.title !== undefined) {
    if (input.title.length < 3) {
      errors.push({
        field: 'title',
        message: 'Title must be at least 3 characters long',
        code: 'MIN_LENGTH'
      });
    }
    if (input.title.length > 200) {
      errors.push({
        field: 'title',
        message: 'Title must be no more than 200 characters',
        code: 'MAX_LENGTH'
      });
    }
  }

  if (input.description && input.description.length > 1000) {
    errors.push({
      field: 'description',
      message: 'Description must be no more than 1000 characters',
      code: 'MAX_LENGTH'
    });
  }

  if (input.priority && !Object.values(Priority).includes(input.priority)) {
    errors.push({
      field: 'priority',
      message: 'Priority must be one of: low, medium, high',
      code: 'INVALID_ENUM'
    });
  }

  if (input.dueDate) {
    const date = new Date(input.dueDate);
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'dueDate',
        message: 'Due date must be a valid ISO 8601 date',
        code: 'INVALID_DATE_FORMAT'
      });
    }
  }

  if (input.tags) {
    if (input.tags.length > 10) {
      errors.push({
        field: 'tags',
        message: 'Maximum 10 tags allowed',
        code: 'MAX_ITEMS'
      });
    }
    
    input.tags.forEach((tag, index) => {
      if (tag.length > 50) {
        errors.push({
          field: `tags[${index}]`,
          message: 'Each tag must be no more than 50 characters',
          code: 'ITEM_TOO_LONG'
        });
      }
    });
  }

  return errors;
};
```

## Editing State Management

### State Flow Diagram

```
Display Mode → Edit Mode → Saving → Display Mode
     ↑           ↓                      ↑
     └─────── Cancel ──────────────────┘
```

### State Management Pattern

```tsx
interface TaskEditingState {
  editingTaskId: string | null;
  editingValues: Partial<TaskInput>;
  validationErrors: ValidationError[];
  isSaving: boolean;
}

function useTaskEditing() {
  const [state, setState] = useState<TaskEditingState>({
    editingTaskId: null,
    editingValues: {},
    validationErrors: [],
    isSaving: false
  });

  const startEditing = (task: Task) => {
    setState({
      editingTaskId: task.id,
      editingValues: {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        completed: task.completed,
        tags: task.tags
      },
      validationErrors: [],
      isSaving: false
    });
  };

  const updateEditingValue = (field: keyof TaskInput, value: any) => {
    setState(prev => ({
      ...prev,
      editingValues: { ...prev.editingValues, [field]: value },
      validationErrors: prev.validationErrors.filter(e => e.field !== field)
    }));
  };

  const cancelEditing = () => {
    setState({
      editingTaskId: null,
      editingValues: {},
      validationErrors: [],
      isSaving: false
    });
  };

  const saveChanges = async (onEdit: (id: string, updates: Partial<TaskInput>) => Promise<void>) => {
    if (!state.editingTaskId) return;

    const errors = validateTaskInput(state.editingValues);
    if (errors.length > 0) {
      setState(prev => ({ ...prev, validationErrors: errors }));
      return;
    }

    setState(prev => ({ ...prev, isSaving: true }));

    try {
      await onEdit(state.editingTaskId, state.editingValues);
      cancelEditing();
    } catch (error) {
      setState(prev => ({ ...prev, isSaving: false }));
      throw error;
    }
  };

  return {
    state,
    startEditing,
    updateEditingValue,
    cancelEditing,
    saveChanges
  };
}
```

## Callback Patterns

### onEdit Callback

The `onEdit` callback should handle the API call and state updates:

```tsx
const handleEdit = async (id: string, updates: Partial<TaskInput>) => {
  try {
    // Make API call
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, updates })
    });

    const result = await response.json();

    if (result.success) {
      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? result.data : task
        )
      );
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    // Handle error (show toast, etc.)
    throw error;
  }
};
```

### onToggleComplete Callback

```tsx
const handleToggleComplete = (id: string) => {
  const task = tasks.find(t => t.id === id);
  if (task) {
    handleEdit(id, { completed: !task.completed });
  }
};
```

### Edit State Management Callbacks

```tsx
const handleEditStart = (taskId: string) => {
  setEditingTaskId(taskId);
};

const handleEditCancel = () => {
  setEditingTaskId(null);
};
```

## Priority Enum Usage

### Display Priority

```tsx
const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const styles = {
    [Priority.LOW]: 'bg-gray-100 text-gray-800',
    [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [Priority.HIGH]: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[priority]}`}>
      {priority.toUpperCase()}
    </span>
  );
};
```

### Priority Selection

```tsx
const PrioritySelect: React.FC<{
  value: Priority;
  onChange: (priority: Priority) => void;
}> = ({ value, onChange }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value as Priority)}
    className="border rounded px-2 py-1"
  >
    <option value={Priority.LOW}>Low Priority</option>
    <option value={Priority.MEDIUM}>Medium Priority</option>
    <option value={Priority.HIGH}>High Priority</option>
  </select>
);
```

## Integration Examples

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';

interface TaskFormData extends Partial<TaskInput> {}

function TaskForm({ task, onSubmit }: { task: Task; onSubmit: (data: Partial<TaskInput>) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      completed: task.completed,
      tags: task.tags
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('title', { 
          required: 'Title is required',
          minLength: { value: 3, message: 'Title must be at least 3 characters' },
          maxLength: { value: 200, message: 'Title must be no more than 200 characters' }
        })}
        placeholder="Task title"
      />
      {errors.title && <span className="error">{errors.title.message}</span>}
      
      <select {...register('priority')}>
        {Object.values(Priority).map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      
      <button type="submit">Save</button>
    </form>
  );
}
```

### With Custom Hook

```tsx
function useTaskItem(task: Task) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValues, setEditingValues] = useState<Partial<TaskInput>>({});

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setEditingValues({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      completed: task.completed,
      tags: [...task.tags]
    });
  }, [task]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditingValues({});
  }, []);

  const updateField = useCallback(<K extends keyof TaskInput>(
    field: K,
    value: TaskInput[K]
  ) => {
    setEditingValues(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    isEditing,
    editingValues,
    startEdit,
    cancelEdit,
    updateField
  };
}
```

## Troubleshooting

### Common Issues

1. **Component Not Re-rendering on State Changes**
   - Ensure parent component state is updated properly in callbacks
   - Check that `isEditing` prop changes trigger re-renders
   - Verify task object reference changes when data updates

2. **Validation Errors Not Displaying**
   - Check that validation runs before API calls
   - Ensure validation errors are properly passed to child components
   - Verify error state is cleared when fields are corrected

3. **Edit Mode Not Exiting After Save**
   - Ensure `onEdit` callback calls API and updates state
   - Check that `isEditing` state is reset after successful saves
   - Verify error handling doesn't prevent state cleanup

4. **Priority Enum Not Displaying Correctly**
   - Ensure Priority enum is imported correctly
   - Check that enum values match API expectations
   - Verify select component value matches enum format

### Debug Tips

- Use React DevTools to inspect component props and state
- Add console logs to callback functions to trace execution
- Check network tab for API request/response details
- Validate that enum values are exactly as defined in the spec
- Test edge cases like empty strings, null values, and invalid data

### Performance Considerations

- Use `useCallback` for event handlers to prevent unnecessary re-renders
- Memoize expensive validation calculations
- Consider debouncing input changes for better UX
- Use `React.memo` for TaskItem if parent renders frequently