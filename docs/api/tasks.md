# Tasks API Documentation

## POST /api/tasks

Creates a new task in the system.

### Endpoint
```
POST /api/tasks
```

### Request Headers
```
Content-Type: application/json
Authorization: Bearer <token>
```

### Request Schema

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "string (optional, enum: low|medium|high|urgent)",
  "status": "string (optional, enum: pending|in_progress|completed|cancelled)",
  "assignee_id": "string (optional)",
  "due_date": "string (optional, ISO 8601 format)",
  "tags": "array of strings (optional)",
  "project_id": "string (optional)"
}
```

### Validation Rules

- **title**: Required, minimum 1 character, maximum 255 characters
- **description**: Optional, maximum 2000 characters
- **priority**: Must be one of: `low`, `medium`, `high`, `urgent` (defaults to `medium`)
- **status**: Must be one of: `pending`, `in_progress`, `completed`, `cancelled` (defaults to `pending`)
- **assignee_id**: Must be a valid user ID if provided
- **due_date**: Must be a valid ISO 8601 date string (YYYY-MM-DDTHH:MM:SSZ)
- **tags**: Each tag must be 1-50 characters, maximum 10 tags per task
- **project_id**: Must be a valid project ID if provided

### Response Schema

#### Success Response (201 Created)
```json
{
  "id": "task_12345",
  "title": "Task title",
  "description": "Task description",
  "priority": "high",
  "status": "pending",
  "assignee_id": "user_67890",
  "assignee_name": "John Doe",
  "due_date": "2024-01-15T10:30:00Z",
  "tags": ["frontend", "bug-fix"],
  "project_id": "proj_abc123",
  "project_name": "Web Application",
  "created_at": "2024-01-10T09:15:30Z",
  "updated_at": "2024-01-10T09:15:30Z",
  "created_by": "user_11111"
}
```

### Error Response Codes

| Code | Description | Response Body |
|------|-------------|---------------|
| 400 | Bad Request - Invalid input data | `{"error": "Validation failed", "details": {"field": "error message"}}` |
| 401 | Unauthorized - Missing or invalid token | `{"error": "Authentication required"}` |
| 403 | Forbidden - Insufficient permissions | `{"error": "Permission denied"}` |
| 404 | Not Found - Referenced resource doesn't exist | `{"error": "Resource not found", "resource": "user/project"}` |
| 422 | Unprocessable Entity - Invalid data format | `{"error": "Invalid data format", "details": {"field": "specific error"}}` |
| 429 | Too Many Requests - Rate limit exceeded | `{"error": "Rate limit exceeded", "retry_after": 60}` |
| 500 | Internal Server Error | `{"error": "Internal server error"}` |

### Example Requests

#### Basic Task Creation
```bash
curl -X POST https://api.example.com/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{
    "title": "Fix login bug",
    "description": "Users are unable to login with social media accounts",
    "priority": "high",
    "assignee_id": "user_67890",
    "due_date": "2024-01-15T17:00:00Z",
    "tags": ["bug", "authentication"]
  }'
```

#### Minimal Task Creation
```bash
curl -X POST https://api.example.com/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{
    "title": "Update documentation"
  }'
```

#### Task with Project Assignment
```bash
curl -X POST https://api.example.com/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_access_token" \
  -d '{
    "title": "Implement user dashboard",
    "description": "Create a new dashboard for user analytics",
    "priority": "medium",
    "status": "pending",
    "assignee_id": "user_12345",
    "project_id": "proj_web_app",
    "due_date": "2024-02-01T12:00:00Z",
    "tags": ["frontend", "dashboard", "analytics"]
  }'
```

### Example Error Responses

#### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": {
    "title": "Title is required",
    "priority": "Priority must be one of: low, medium, high, urgent",
    "due_date": "Invalid date format"
  }
}
```

#### Resource Not Found (404)
```json
{
  "error": "Resource not found",
  "resource": "user",
  "message": "Assignee with ID 'user_invalid' does not exist"
}
```

#### Rate Limit Exceeded (429)
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retry_after": 60,
  "limit": 100,
  "remaining": 0
}
```

### Rate Limits

- **Authenticated users**: 100 requests per minute
- **Premium users**: 500 requests per minute
- Rate limits are enforced per user account

### Notes

- All timestamps are returned in UTC format
- The `assignee_name` and `project_name` fields are populated automatically when IDs are provided
- Tasks are automatically assigned to the authenticated user if no `assignee_id` is specified
- The `created_by` field is automatically set to the authenticated user's ID