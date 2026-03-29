# TaskList Component

## Overview
The TaskList component provides a drag-and-drop interface for managing and reordering tasks. It integrates with the task reordering API to persist changes and provides visual feedback during drag operations.

## Import
```javascript
import { TaskList } from './components/TaskList';
```

## Props Interface
```typescript
interface TaskListProps {
  /** Array of tasks to display */
  tasks: Task[];
  
  /** Unique identifier for the list */
  listId: string;
  
  /** Called when a task is reordered */
  onTaskReorder?: (params: ReorderParams) => void;
  
  /** Called when a task is selected/clicked */
  onTaskSelect?: (taskId: string) => void;
  
  /** Called when a task is edited */
  onTaskEdit?: (taskId: string, updates: Partial<Task>) => void;
  
  /** Whether drag and drop is enabled */
  enableDragAndDrop?: boolean;
  
  /** Custom styling classes */
  className?: string;
  
  /** Loading state indicator */
  isLoading?: boolean;
  
  /** Whether the list is in read-only mode */
  readOnly?: boolean;
  
  /** Maximum number of tasks allowed */
  maxTasks?: number;
  
  /** Custom render function for task items */
  renderTask?: (task: Task, index: number) => React.ReactNode;
  
  /** Placeholder content when list is empty */
  emptyPlaceholder?: React.ReactNode;
}

interface ReorderParams {
  taskId: string;
  oldPosition: number;
  newPosition: number;
  oldListId?: string;
  newListId?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  position: number;
  listId: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Basic Usage

### Simple Task List
```javascript
import React, { useState } from 'react';
import { TaskList } from './components/TaskList';

function MyComponent() {
  const [tasks, setTasks] = useState([
    {
      id: 'task_1',
      title: 'Design homepage',
      position: 0,
      listId: 'list_1',
      status: 'todo',
      priority: 'high',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'task_2', 
      title: 'Implement authentication',
      position: 1,
      listId: 'list_1',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    }
  ]);

  const handleTaskReorder = (params) => {
    console.log('Task reordered:', params);
    // Handle the reorder operation
  };

  return (
    <TaskList
      tasks={tasks}
      listId="list_1"
      onTaskReorder={handleTaskReorder}
      enableDragAndDrop={true}
    />
  );
}
```

### Advanced Usage with Custom Rendering
```javascript
import React from 'react';
import { TaskList } from './components/TaskList';

function AdvancedTaskList() {
  const handleTaskReorder = async (params) => {
    try {
      // Call API to persist reorder
      const response = await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: params.taskId,
          newPosition: params.newPosition,
          listId: params.newListId
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reorder task');
      }
      
      // Update local state
      updateTaskOrder(params);
    } catch (error) {
      console.error('Reorder failed:', error);
      // Revert optimistic update
    }
  };

  const renderCustomTask = (task, index) => (
    <div className="custom-task-item">
      <span className="task-priority">{task.priority}</span>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <span className="task-status">{task.status}</span>
    </div>
  );

  return (
    <TaskList
      tasks={tasks}
      listId="project_tasks"
      onTaskReorder={handleTaskReorder}
      onTaskSelect={(id) => setSelectedTask(id)}
      enableDragAndDrop={!readOnlyMode}
      maxTasks={50}
      renderTask={renderCustomTask}
      emptyPlaceholder={<div>No tasks yet. Add one to get started!</div>}
      className="custom-task-list"
    />
  );
}
```

## Drag and Drop Behavior

### Drag Operations
The TaskList component supports the following drag and drop interactions:

#### Starting a Drag
- **Trigger**: Long press (mobile) or mouse down + drag (desktop)
- **Visual Feedback**: Task becomes semi-transparent, drag handle appears
- **Cursor**: Changes to grabbing cursor
- **Restrictions**: Disabled for read-only lists or when `enableDragAndDrop={false}`

#### During Drag
- **Ghost Element**: Semi-transparent copy of the task follows cursor
- **Drop Zones**: Valid drop positions are highlighted
- **Auto-scroll**: List scrolls when dragging near edges
- **Position Preview**: Shows where task will be placed

#### Drop Behavior
- **Valid Drop**: Task animates to new position, triggers `onTaskReorder`
- **Invalid Drop**: Task snaps back to original position
- **Cross-list Drop**: Supported when dragging between different TaskList instances

### Drag and Drop Events
```javascript
const handleTaskReorder = (params) => {
  const {
    taskId,        // ID of dragged task
    oldPosition,   // Original position (0-indexed)
    newPosition,   // New position (0-indexed)
    oldListId,     // Source list ID (for cross-list moves)
    newListId      // Target list ID (for cross-list moves)
  } = params;
  
  // Handle the reorder logic
  console.log(`Moved task ${taskId} from position ${oldPosition} to ${newPosition}`);
};
```

### Keyboard Accessibility
The component supports keyboard navigation for drag and drop:
- **Space/Enter**: Start drag mode for focused task
- **Arrow Keys**: Move task up/down while in drag mode
- **Space/Enter**: Confirm new position
- **Escape**: Cancel drag operation

### Touch Support
- **Touch Start**: Long press (500ms) to initiate drag
- **Touch Move**: Task follows finger movement
- **Touch End**: Drop at current position
- **Scroll Prevention**: Prevents page scroll during drag operations

## Styling

### CSS Classes
The component applies the following CSS classes:

```css
.task-list {
  /* Main container */
}

.task-list__item {
  /* Individual task wrapper */
}

.task-list__item--dragging {
  /* Applied to item being dragged */
}

.task-list__item--drop-target {
  /* Applied to valid drop zones */
}

.task-list__empty {
  /* Empty state container */
}

.task-list__loading {
  /* Loading state overlay */
}
```

### Custom Styling Example
```css
.task-list {
  min-height: 200px;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
}

.task-list__item {
  background: white;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.task-list__item--dragging {
  opacity: 0.5;
  transform: rotate(5deg);
  z-index: 1000;
}

.task-list__item--drop-target {
  border: 2px dashed #007bff;
  background: #e3f2fd;
}
```

## Error Handling

### Common Error Scenarios
```javascript
const handleTaskReorder = async (params) => {
  try {
    await reorderTask(params);
  } catch (error) {
    if (error.code === 'FORBIDDEN') {
      showError('You don\'t have permission to reorder tasks');
    } else if (error.code === 'TASK_NOT_FOUND') {
      showError('Task no longer exists');
      // Remove from local state
      removeTaskFromList(params.taskId);
    } else if (error.code === 'INVALID_POSITION') {
      showError('Invalid position for task');
      // Revert to original position
      revertTaskPosition(params);
    } else {
      showError('Failed to reorder task. Please try again.');
    }
  }
};
```

## Performance Considerations

### Optimization Tips
1. **Virtualization**: For lists with >100 tasks, consider using react-window
2. **Debouncing**: Debounce rapid reorder operations
3. **Optimistic Updates**: Update UI immediately, sync with server asynchronously
4. **Memoization**: Use React.memo for task items to prevent unnecessary re-renders

### Large List Example
```javascript
import { FixedSizeList as List } from 'react-window';

function VirtualizedTaskList({ tasks, ...props }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TaskItem task={tasks[index]} />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={tasks.length}
      itemSize={60}
    >
      {Row}
    </List>
  );
}
```

## Integration Examples

### With State Management (Redux)
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { reorderTaskAsync } from './store/tasksSlice';

function ConnectedTaskList() {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.items);
  
  const handleReorder = (params) => {
    dispatch(reorderTaskAsync(params));
  };
  
  return (
    <TaskList
      tasks={tasks}
      listId="main"
      onTaskReorder={handleReorder}
      enableDragAndDrop={true}
    />
  );
}
```

### With React Query
```javascript
import { useMutation, useQueryClient } from 'react-query';

function TaskListWithQuery() {
  const queryClient = useQueryClient();
  
  const reorderMutation = useMutation(
    (params) => fetch('/api/tasks/reorder', {
      method: 'POST',
      body: JSON.stringify(params)
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      }
    }
  );
  
  return (
    <TaskList
      tasks={tasks}
      listId="query-list"
      onTaskReorder={reorderMutation.mutate}
      isLoading={reorderMutation.isLoading}
    />
  );
}
```