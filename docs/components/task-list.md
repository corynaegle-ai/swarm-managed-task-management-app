# TaskList Components Documentation

## Overview

The TaskList component system provides a comprehensive solution for displaying and managing task collections with visual status indicators, customizable styling, and interactive capabilities.

## Components

### TaskList

The main container component that renders a collection of tasks with consistent styling and layout.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tasks` | `Task[]` | Yes | - | Array of task objects to display |
| `className` | `string` | No | `""` | Additional CSS classes for the container |
| `showStatus` | `boolean` | No | `true` | Whether to display status indicators |
| `compact` | `boolean` | No | `false` | Enable compact layout mode |
| `onTaskClick` | `(task: Task) => void` | No | - | Callback when a task is clicked |
| `onStatusChange` | `(taskId: string, status: TaskStatus) => void` | No | - | Callback when task status changes |
| `maxHeight` | `string \| number` | No | - | Maximum height with scrolling |
| `sortBy` | `'priority' \| 'dueDate' \| 'status' \| 'title'` | No | `'priority'` | Sort order for tasks |
| `filterBy` | `TaskStatus \| 'all'` | No | `'all'` | Filter tasks by status |

#### Task Interface

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  assignee?: string;
  tags?: string[];
  progress?: number; // 0-100 for progress bar
  subtasks?: Task[];
}

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked' | 'cancelled';
```

### TaskItem

Individual task component with rich visual indicators and interactive elements.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `task` | `Task` | Yes | - | Task object to display |
| `className` | `string` | No | `""` | Additional CSS classes |
| `showStatus` | `boolean` | No | `true` | Show status indicator |
| `showPriority` | `boolean` | No | `true` | Show priority indicator |
| `showProgress` | `boolean` | No | `true` | Show progress bar if available |
| `compact` | `boolean` | No | `false` | Enable compact display mode |
| `interactive` | `boolean` | No | `true` | Enable click and hover interactions |
| `onClick` | `(task: Task) => void` | No | - | Click handler |
| `onStatusChange` | `(status: TaskStatus) => void` | No | - | Status change handler |
| `showSubtasks` | `boolean` | No | `false` | Display subtasks inline |

## Usage Examples

### Basic Usage

```jsx
import { TaskList, TaskItem } from '../components/TaskList';

const tasks = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date('2024-01-15'),
    assignee: 'john.doe',
    progress: 60
  },
  {
    id: '2',
    title: 'Write API documentation',
    status: 'pending',
    priority: 'medium',
    tags: ['documentation', 'api']
  }
];

function MyTaskBoard() {
  const handleTaskClick = (task) => {
    console.log('Task clicked:', task.title);
  };

  const handleStatusChange = (taskId, newStatus) => {
    // Update task status in your state management
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <TaskList
      tasks={tasks}
      onTaskClick={handleTaskClick}
      onStatusChange={handleStatusChange}
      showStatus={true}
      sortBy="priority"
    />
  );
}
```

### Compact Mode

```jsx
<TaskList
  tasks={tasks}
  compact={true}
  maxHeight="400px"
  className="dashboard-tasks"
/>
```

### Individual Task Item

```jsx
<TaskItem
  task={singleTask}
  showSubtasks={true}
  onClick={(task) => openTaskDetails(task)}
  onStatusChange={(status) => updateStatus(task.id, status)}
/>
```

### Filtered and Sorted View

```jsx
<TaskList
  tasks={allTasks}
  filterBy="in-progress"
  sortBy="dueDate"
  maxHeight={500}
  onTaskClick={openTaskModal}
/>
```

## Styling and Customization

### CSS Classes

The components use a BEM-style naming convention for CSS classes:

#### TaskList Container Classes

- `.task-list` - Main container
- `.task-list--compact` - Compact mode modifier
- `.task-list__header` - Optional header area
- `.task-list__content` - Scrollable content area
- `.task-list__empty` - Empty state message

#### TaskItem Classes

- `.task-item` - Main task container
- `.task-item--compact` - Compact mode
- `.task-item--interactive` - Interactive (clickable) tasks
- `.task-item--priority-{level}` - Priority-based styling (`low`, `medium`, `high`, `critical`)
- `.task-item--status-{status}` - Status-based styling

#### Visual Indicator Classes

- `.task-item__status` - Status indicator container
- `.task-item__priority` - Priority indicator
- `.task-item__progress` - Progress bar container
- `.task-item__progress-bar` - Progress bar fill
- `.task-item__meta` - Metadata section (date, assignee, etc.)

### Customization Examples

#### Custom Color Scheme

```css
.task-list {
  --task-pending-color: #f59e0b;
  --task-progress-color: #3b82f6;
  --task-completed-color: #10b981;
  --task-blocked-color: #ef4444;
  --task-cancelled-color: #6b7280;
}

.task-item--priority-critical {
  border-left: 4px solid #dc2626;
  background: rgba(220, 38, 38, 0.05);
}

.task-item--priority-high {
  border-left: 4px solid #ea580c;
}

.task-item--priority-medium {
  border-left: 4px solid #ca8a04;
}

.task-item--priority-low {
  border-left: 4px solid #65a30d;
}
```

#### Compact Mode Adjustments

```css
.task-list--compact .task-item {
  padding: 8px 12px;
  min-height: 48px;
}

.task-list--compact .task-item__title {
  font-size: 0.875rem;
  line-height: 1.25;
}

.task-list--compact .task-item__description {
  display: none;
}
```

#### Dark Theme Support

```css
.dark .task-list {
  background-color: #1f2937;
  color: #f9fafb;
}

.dark .task-item {
  background-color: #374151;
  border-color: #4b5563;
}

.dark .task-item:hover {
  background-color: #4b5563;
}
```

## Visual Indicator System

### Status Indicators

Each task displays a colored status indicator using both color and icons:

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| `pending` | Orange (`#f59e0b`) | ⏳ | Task is waiting to be started |
| `in-progress` | Blue (`#3b82f6`) | 🔄 | Task is actively being worked on |
| `completed` | Green (`#10b981`) | ✅ | Task has been finished |
| `blocked` | Red (`#ef4444`) | 🚫 | Task is blocked by dependencies |
| `cancelled` | Gray (`#6b7280`) | ❌ | Task has been cancelled |

### Priority Indicators

Priority is shown through left border colors and optional badges:

- **Critical**: Red border (`#dc2626`) with "⚡ Critical" badge
- **High**: Orange border (`#ea580c`) with "🔥 High" badge  
- **Medium**: Yellow border (`#ca8a04`) with "📊 Medium" badge
- **Low**: Green border (`#65a30d`) with "📋 Low" badge

### Progress Indicators

For tasks with progress data, a progress bar is displayed:

```css
.task-item__progress-bar {
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}
```

### Interactive States

```css
.task-item--interactive:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.task-item--interactive:active {
  transform: translateY(0);
}

.task-item__status:hover {
  cursor: pointer;
  transform: scale(1.1);
}
```

## Accessibility

The components include comprehensive accessibility features:

- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Full keyboard support with tab order
- **Screen Reader Support**: Status and priority announced to screen readers
- **Focus Management**: Visible focus indicators and logical tab sequence
- **Color Contrast**: All color combinations meet WCAG 2.1 AA standards

```jsx
// Example with accessibility attributes
<TaskItem
  task={task}
  aria-label={`Task: ${task.title}, Status: ${task.status}, Priority: ${task.priority}`}
  role="button"
  tabIndex={0}
/>
```

## Performance Considerations

- **Virtualization**: Use with react-window for large lists (1000+ tasks)
- **Memoization**: TaskItem components are memoized to prevent unnecessary re-renders
- **Lazy Loading**: Subtasks are loaded on-demand
- **Debounced Updates**: Status changes are debounced to prevent excessive API calls

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import { Task, TaskStatus, TaskListProps, TaskItemProps } from './types';

// Type-safe usage
const typedTasks: Task[] = [
  // ...tasks
];

const handleStatusChange = (taskId: string, status: TaskStatus) => {
  // Type-safe status handling
};
```