# Task Update API Documentation

## Overview

The Task Update API endpoint allows you to modify existing tasks by sending partial updates. This endpoint supports updating any combination of task properties while maintaining data integrity through validation.

## Endpoint

```
PUT /api/tasks/{id}
```

## Request Format

### TaskUpdateRequest

```typescript
interface TaskUpdateRequest {
  id: string;
  updates: Partial<TaskInput>;
}
```

### TaskInput Interface

```typescript
interface TaskInput {
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // ISO 8601 format
  completed: boolean;
  tags?: string[];
}

enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}
```

## Response Format

### ApiResponse

```typescript
interface ApiResponse {
  success: boolean;
  data?: Task;
  error?: string;
  code?: string;
}
```

### Task Interface (Response Data)

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  completed: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Request Examples

### Update Task Title

```bash
curl -X PUT "https://api.example.com/api/tasks/task-123" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id": "task-123",
    "updates": {
      "title": "Updated Task Title"
    }
  }'
```

### Update Multiple Fields

```bash
curl -X PUT "https://api.example.com/api/tasks/task-456" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id": "task-456",
    "updates": {
      "title": "Complete project documentation",
      "priority": "high",
      "dueDate": "2024-01-15T10:00:00Z",
      "tags": ["documentation", "urgent"]
    }
  }'
```

### Mark Task as Complete

```bash
curl -X PUT "https://api.example.com/api/tasks/task-789" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id": "task-789",
    "updates": {
      "completed": true
    }
  }'
```

## Response Examples

### Successful Update

```json
{
  "success": true,
  "data": {
    "id": "task-123",
    "title": "Updated Task Title",
    "description": "Task description here",
    "priority": "medium",
    "dueDate": "2024-01-10T15:30:00Z",
    "completed": false,
    "tags": ["work", "important"],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-05T14:20:00Z"
  }
}
```

### Validation Error Response

```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "validationErrors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters long",
      "code": "MIN_LENGTH"
    },
    {
      "field": "priority",
      "message": "Priority must be one of: low, medium, high",
      "code": "INVALID_ENUM"
    }
  ]
}
```

## Validation Rules

### Title
- **Required**: Yes (when provided)
- **Type**: String
- **Min Length**: 3 characters
- **Max Length**: 200 characters
- **Error Codes**: `REQUIRED`, `MIN_LENGTH`, `MAX_LENGTH`

### Description
- **Required**: No
- **Type**: String
- **Max Length**: 1000 characters
- **Error Codes**: `MAX_LENGTH`

### Priority
- **Required**: Yes (when provided)
- **Type**: Enum
- **Valid Values**: `"low"`, `"medium"`, `"high"`
- **Error Codes**: `REQUIRED`, `INVALID_ENUM`

### Due Date
- **Required**: No
- **Type**: String (ISO 8601 format)
- **Validation**: Must be valid ISO 8601 datetime
- **Error Codes**: `INVALID_DATE_FORMAT`, `DATE_IN_PAST`

### Completed
- **Required**: No
- **Type**: Boolean
- **Error Codes**: `INVALID_BOOLEAN`

### Tags
- **Required**: No
- **Type**: Array of strings
- **Max Items**: 10
- **Item Max Length**: 50 characters
- **Error Codes**: `MAX_ITEMS`, `ITEM_TOO_LONG`

## Error Handling

### ValidationError Interface

```typescript
interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `TASK_NOT_FOUND` | Task with specified ID doesn't exist | 404 |
| `VALIDATION_ERROR` | One or more fields failed validation | 400 |
| `UNAUTHORIZED` | Invalid or missing authentication | 401 |
| `FORBIDDEN` | User doesn't have permission to update task | 403 |
| `INTERNAL_ERROR` | Server error occurred | 500 |

### Error Response Examples

#### Task Not Found

```json
{
  "success": false,
  "error": "Task not found",
  "code": "TASK_NOT_FOUND"
}
```

#### Unauthorized Access

```json
{
  "success": false,
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

#### Internal Server Error

```json
{
  "success": false,
  "error": "An internal error occurred",
  "code": "INTERNAL_ERROR"
}
```

## Rate Limiting

- **Limit**: 100 requests per minute per API key
- **Headers**: 
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: Timestamp when window resets

## Troubleshooting

### Common Issues

1. **404 Task Not Found**
   - Verify the task ID exists
   - Check user permissions for the task
   - Ensure the task hasn't been deleted

2. **400 Validation Error**
   - Check field formats match the validation rules
   - Ensure required fields are provided when creating new data
   - Verify enum values are exactly as specified

3. **401 Unauthorized**
   - Check authentication token is valid and not expired
   - Ensure token is included in Authorization header
   - Verify API key has proper permissions

4. **Rate Limiting (429)**
   - Implement exponential backoff retry logic
   - Check rate limit headers to understand limits
   - Consider caching responses to reduce API calls

### Debug Tips

- Use the exact cURL examples provided above as a starting point
- Check the response headers for additional debugging information
- Enable request logging to see the exact request being sent
- Verify JSON formatting is valid before sending requests