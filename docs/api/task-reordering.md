# Task Reordering API

## Overview
The task reordering API allows users to change the order of tasks within a project or list. This endpoint handles drag-and-drop operations and maintains task sequence integrity.

## Endpoint

### POST /api/tasks/reorder

Reorders tasks by updating their position values.

#### Request Headers
```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

#### Request Body Schema
```json
{
  "taskId": "string (required)",
  "newPosition": "number (required)", 
  "listId": "string (optional)",
  "beforeTaskId": "string (optional)",
  "afterTaskId": "string (optional)"
}
```

#### Request Parameters
- `taskId`: The ID of the task being moved
- `newPosition`: The new position index (0-based)
- `listId`: Target list ID (if moving between lists)
- `beforeTaskId`: ID of task that should come after the moved task
- `afterTaskId`: ID of task that should come before the moved task

#### Example Request
```bash
curl -X POST "https://api.example.com/api/tasks/reorder" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "taskId": "task_123",
    "newPosition": 2,
    "listId": "list_456",
    "beforeTaskId": "task_789"
  }'
```

#### Response Schema
```json
{
  "success": "boolean",
  "data": {
    "updatedTasks": [
      {
        "id": "string",
        "title": "string",
        "position": "number",
        "listId": "string",
        "updatedAt": "string (ISO 8601)"
      }
    ],
    "affectedTaskCount": "number"
  },
  "message": "string"
}
```

#### Success Response Example
```json
{
  "success": true,
  "data": {
    "updatedTasks": [
      {
        "id": "task_123",
        "title": "Implement user authentication",
        "position": 2,
        "listId": "list_456",
        "updatedAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": "task_789",
        "title": "Design login page",
        "position": 3,
        "listId": "list_456", 
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "affectedTaskCount": 3
  },
  "message": "Task reordered successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": {
      "taskId": "Task ID is required",
      "newPosition": "Position must be a non-negative integer"
    }
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions to reorder tasks in this list"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Task with ID 'task_123' not found"
  }
}
```

### 422 Unprocessable Entity
```json
{
  "success": false,
  "error": {
    "code": "INVALID_POSITION",
    "message": "Cannot move task to the specified position",
    "details": {
      "maxPosition": 10,
      "requestedPosition": 15
    }
  }
}
```

## Validation Rules

### Request Validation
- `taskId`: Must be a valid UUID or string identifier
- `newPosition`: Must be >= 0 and <= maximum list size
- `listId`: Must exist and be accessible by the user
- `beforeTaskId`/`afterTaskId`: Must exist in the target list (if provided)

### Business Rules
1. Tasks can only be reordered within lists the user has write access to
2. Position values are automatically recalculated for affected tasks
3. Moving a task to the same position is a no-op but returns success
4. When moving between lists, the task's `listId` is updated
5. Concurrent reorder operations are handled with optimistic locking

## Rate Limiting
- 100 requests per minute per user
- Burst limit: 10 requests per 10 seconds

## Example Usage Scenarios

### Reordering within the same list
```bash
curl -X POST "/api/tasks/reorder" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task_123",
    "newPosition": 0
  }'
```

### Moving task to different list
```bash
curl -X POST "/api/tasks/reorder" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task_123",
    "newPosition": 2,
    "listId": "list_789"
  }'
```

### Positioning relative to other tasks
```bash
curl -X POST "/api/tasks/reorder" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task_123",
    "afterTaskId": "task_456",
    "beforeTaskId": "task_789"
  }'
```