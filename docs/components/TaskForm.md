# TaskForm Component Documentation

## Overview

The `TaskForm` component provides a comprehensive form interface for creating and editing tasks. It includes validation, error handling, and support for all task properties including assignee selection, project assignment, and tag management.

## Import

```javascript
import { TaskForm } from '@/components/forms/TaskForm';
```

## Basic Usage

### Creating a New Task
```javascript
import React from 'react';
import { TaskForm } from '@/components/forms/TaskForm';

function CreateTaskPage() {
  const handleSubmit = (taskData) => {
    console.log('Creating task:', taskData);
    // API call to create task
  };

  const handleCancel = () => {
    // Navigate back or close modal
    console.log('Form cancelled');
  };

  return (
    <div>
      <h1>Create New Task</h1>
      <TaskForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitText="Create Task"
      />
    </div>
  );
}
```

### Editing an Existing Task
```javascript
import React, { useState, useEffect } from 'react';
import { TaskForm } from '@/components/forms/TaskForm';

function EditTaskPage({ taskId }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch task data
    fetchTask(taskId).then(taskData => {
      setTask(taskData);
      setLoading(false);
    });
  }, [taskId]);

  const handleSubmit = (taskData) => {
    console.log('Updating task:', taskData);
    // API call to update task
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Task</h1>
      <TaskForm
        initialValues={task}
        onSubmit={handleSubmit}
        onCancel={() => history.back()}
        submitText="Update Task"
        mode="edit"
      />
    </div>
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `function` | Callback function called when form is submitted successfully. Receives the form data as an argument. |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValues` | `object` | `{}` | Initial form values for editing mode |
| `onCancel` | `function` | `undefined` | Callback function called when cancel button is clicked |
| `submitText` | `string` | `"Save Task"` | Text displayed on the submit button |
| `cancelText` | `string` | `"Cancel"` | Text displayed on the cancel button |
| `mode` | `string` | `"create"` | Form mode, either `"create"` or `"edit"` |
| `loading` | `boolean` | `false` | Shows loading state on submit button |
| `disabled` | `boolean` | `false` | Disables all form inputs |
| `showCancel` | `boolean` | `true` | Whether to show the cancel button |
| `projects` | `array` | `[]` | Array of available projects for selection |
| `users` | `array` | `[]` | Array of available users for assignee selection |
| `validationSchema` | `object` | `undefined` | Custom validation schema (Yup schema) |
| `className` | `string` | `""` | Additional CSS classes for the form container |
| `onFieldChange` | `function` | `undefined` | Callback called when any field value changes |

### initialValues Object Structure

```javascript
{
  title: "string",
  description: "string",
  priority: "low" | "medium" | "high" | "urgent",
  status: "pending" | "in_progress" | "completed" | "cancelled",
  assignee_id: "string",
  due_date: "YYYY-MM-DDTHH:MM:SS" | Date object,
  tags: ["string", "string"],
  project_id: "string"
}
```

### projects Array Structure

```javascript
[
  {
    id: "proj_123",
    name: "Web Application",
    description: "Main web application project"
  },
  {
    id: "proj_456", 
    name: "Mobile App",
    description: "iOS and Android mobile application"
  }
]
```

### users Array Structure

```javascript
[
  {
    id: "user_789",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://example.com/avatar.jpg"
  },
  {
    id: "user_012",
    name: "Jane Smith", 
    email: "jane@example.com",
    avatar: "https://example.com/avatar2.jpg"
  }
]
```

## Advanced Usage Examples

### With Custom Validation
```javascript
import * as Yup from 'yup';

const customValidationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string()
    .max(500, 'Description cannot exceed 500 characters'),
  due_date: Yup.date()
    .min(new Date(), 'Due date must be in the future')
});

<TaskForm
  onSubmit={handleSubmit}
  validationSchema={customValidationSchema}
  submitText="Create Task"
/>
```

### With Dynamic Data Loading
```javascript
import React, { useState, useEffect } from 'react';

function TaskFormWithData() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load projects and users
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/users').then(r => r.json())
    ]).then(([projectsData, usersData]) => {
      setProjects(projectsData);
      setUsers(usersData);
    });
  }, []);

  const handleSubmit = async (taskData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      
      if (response.ok) {
        console.log('Task created successfully');
        // Handle success
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    console.log(`Field ${fieldName} changed to:`, value);
  };

  return (
    <TaskForm
      onSubmit={handleSubmit}
      projects={projects}
      users={users}
      loading={loading}
      onFieldChange={handleFieldChange}
      submitText="Create Task"
    />
  );
}
```

### Modal Usage
```javascript
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/forms/TaskForm';

function TaskModal({ isOpen, onClose, task }) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (taskData) => {
    setSubmitting(true);
    try {
      // Submit task data
      await submitTask(taskData);
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Task">
      <TaskForm
        initialValues={task}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={submitting}
        submitText={task ? "Update Task" : "Create Task"}
        mode={task ? "edit" : "create"}
      />
    </Modal>
  );
}
```

## Form Fields

The TaskForm component includes the following form fields:

- **Title**: Text input (required)
- **Description**: Textarea (optional) 
- **Priority**: Select dropdown (Low, Medium, High, Urgent)
- **Status**: Select dropdown (Pending, In Progress, Completed, Cancelled)
- **Assignee**: User search/select dropdown
- **Due Date**: Date and time picker
- **Tags**: Tag input with autocomplete
- **Project**: Project select dropdown

## Styling

The component uses CSS modules and can be customized through:

- `className` prop for container styling
- CSS custom properties for theme customization
- Individual field styling through CSS modules

```css
/* Custom styling example */
.task-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.task-form-container .form-field {
  margin-bottom: 16px;
}
```

## Accessibility

The TaskForm component follows accessibility best practices:

- Proper form labels and ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Error message announcements
- Focus management

## Error Handling

The component handles various error scenarios:

- Field validation errors
- Network request failures
- Server validation errors
- Required field notifications

Error messages are displayed inline with appropriate styling and ARIA attributes for screen readers.

## Events

### onSubmit
Called when the form is successfully submitted and validated.

**Parameters:**
- `formData` (object): The validated form data

### onCancel  
Called when the cancel button is clicked.

**Parameters:** None

### onFieldChange
Called whenever any form field value changes.

**Parameters:**
- `fieldName` (string): The name of the changed field
- `value` (any): The new field value
- `formData` (object): The complete current form data

## Browser Support

The TaskForm component supports:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

For older browsers, ensure appropriate polyfills are included for modern JavaScript features.