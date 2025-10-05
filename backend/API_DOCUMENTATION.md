# Atomize API Documentation

Complete REST API documentation for the Atomize habit tracking application.

## Base URL
```
http://localhost:3000/api
```
fix 
## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "johndoe",
  "full_name": "John Doe",
  "timezone": "America/New_York",
  "locale": "en"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "johndoe",
      "full_name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
**POST** `/api/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
**GET** `/api/auth/me`

Get authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

### Change Password
**PUT** `/api/auth/password`

Change user's password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## Identity Endpoints

### Get All Identities
**GET** `/api/identities`

Get all identities for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "identity_name": "Athlete",
      "description": "My fitness journey",
      "vision_statement": "To become the strongest version of myself",
      "core_values": ["discipline", "perseverance"],
      "is_primary": true,
      "color_theme": "#FF6B6B",
      "icon": "dumbbell",
      "habits_count": 5
    }
  ]
}
```

### Get Identity by ID
**GET** `/api/identities/:id`

**Headers:** `Authorization: Bearer <token>`

### Create Identity
**POST** `/api/identities`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "identity_name": "Professional",
  "description": "My career identity",
  "vision_statement": "To excel in my field",
  "core_values": ["excellence", "innovation"],
  "is_primary": false,
  "color_theme": "#4ECDC4",
  "icon": "briefcase"
}
```

**Response:** `201 Created`

### Update Identity
**PUT** `/api/identities/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as create (partial updates allowed)

### Delete Identity
**DELETE** `/api/identities/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

---

## Habit Endpoints

### Get All Habits
**GET** `/api/habits`

Get all habits for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `active` (boolean) - Filter only active habits

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "identity_id": 1,
      "user_id": 1,
      "habit_name": "Morning Run",
      "description": "Run 5km every morning",
      "frequency_type": "daily",
      "target_count": 1,
      "streak_count": 7,
      "best_streak": 15,
      "is_active": true,
      "identity_name": "Athlete"
    }
  ]
}
```

### Get Habits by User ID
**GET** `/api/habits/user/:userId`

Get habits for a specific user (only public habits if not owner).

**Headers:** `Authorization: Bearer <token>`

### Get Habits by Identity
**GET** `/api/habits/identity/:identityId`

Get all habits for a specific identity.

**Headers:** `Authorization: Bearer <token>`

### Get Habit by ID
**GET** `/api/habits/:id`

**Headers:** `Authorization: Bearer <token>`

### Create Habit
**POST** `/api/habits`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "identity_id": 1,
  "habit_name": "Morning Meditation",
  "description": "10 minutes of mindfulness",
  "frequency_type": "daily",
  "frequency_value": 1,
  "target_count": 1,
  "unit": "session",
  "reminder_enabled": true,
  "reminder_time": "07:00:00",
  "difficulty_level": "easy",
  "category": "wellness",
  "color": "#95E1D3",
  "icon": "meditation",
  "is_public": false,
  "start_date": "2024-01-01"
}
```

**Response:** `201 Created`

### Update Habit
**PUT** `/api/habits/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as create (partial updates allowed)

### Delete Habit
**DELETE** `/api/habits/:id`

**Headers:** `Authorization: Bearer <token>`

---

## Completion Endpoints

### Get All Completions
**GET** `/api/completions`

Get completions for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (number) - Limit results (default: 100)
- `startDate` (date) - Filter by start date
- `endDate` (date) - Filter by end date

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "habit_id": 1,
      "user_id": 1,
      "completion_date": "2024-01-15",
      "completion_value": 1,
      "mood": "great",
      "energy_level": 5,
      "notes": "Felt amazing!",
      "habit_name": "Morning Run"
    }
  ]
}
```

### Get Today's Completions
**GET** `/api/completions/today`

**Headers:** `Authorization: Bearer <token>`

### Get Completions by Habit
**GET** `/api/completions/habit/:habitId`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (number) - Limit results

### Get Completion by ID
**GET** `/api/completions/:id`

**Headers:** `Authorization: Bearer <token>`

### Create Completion
**POST** `/api/completions`

Mark a habit as complete.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "habit_id": 1,
  "completion_date": "2024-01-15",
  "completion_value": 1,
  "mood": "great",
  "energy_level": 5,
  "notes": "Great session!",
  "duration_minutes": 30
}
```

**Response:** `201 Created`

### Update Completion
**PUT** `/api/completions/:id`

**Headers:** `Authorization: Bearer <token>`

### Delete Completion
**DELETE** `/api/completions/:id`

**Headers:** `Authorization: Bearer <token>`

### Get Habit Statistics
**GET** `/api/completions/habit/:habitId/stats`

Get statistics for a specific habit.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total_completions": 45,
    "avg_value": 1.0,
    "first_completion": "2024-01-01",
    "last_completion": "2024-01-15",
    "avg_energy": 4.2,
    "great_mood_count": 30
  }
}
```

### Get User Statistics
**GET** `/api/completions/stats`

Get overall completion statistics for user.

**Headers:** `Authorization: Bearer <token>`

---

## Squad Endpoints

### Get All Squads
**GET** `/api/squads`

Get all squads user is a member of.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "squad_name": "Fitness Warriors",
      "description": "A group dedicated to fitness",
      "squad_type": "public",
      "current_member_count": 25,
      "max_members": 100,
      "role": "member",
      "joined_at": "2024-01-01"
    }
  ]
}
```

### Search Public Squads
**GET** `/api/squads/search?q=fitness&limit=20`

Search for public squads.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `q` (string, required) - Search term
- `limit` (number) - Results limit

### Get Squad by ID
**GET** `/api/squads/:id`

**Headers:** `Authorization: Bearer <token>`

### Create Squad
**POST** `/api/squads`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "squad_name": "Morning Risers",
  "description": "Early birds who conquer the day",
  "squad_type": "public",
  "max_members": 50
}
```

**Response:** `201 Created`

### Update Squad
**PUT** `/api/squads/:id`

**Headers:** `Authorization: Bearer <token>`

### Delete Squad
**DELETE** `/api/squads/:id`

**Headers:** `Authorization: Bearer <token>`

### Get Squad Members
**GET** `/api/squads/:id/members`

**Headers:** `Authorization: Bearer <token>`

### Join Squad
**POST** `/api/squads/:id/join`

**Headers:** `Authorization: Bearer <token>`

### Join by Invite Code
**POST** `/api/squads/join-by-code`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "inviteCode": "FIT2024"
}
```

### Leave Squad
**POST** `/api/squads/:id/leave`

**Headers:** `Authorization: Bearer <token>`

### Invite User
**POST** `/api/squads/:id/invite`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": 5
}
```

### Remove Member
**DELETE** `/api/squads/:id/members/:userId`

**Headers:** `Authorization: Bearer <token>`

### Update Member Role
**PUT** `/api/squads/:id/members/:userId/role`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "role": "admin"
}
```

**Valid Roles:** `admin`, `moderator`, `member`

### Get Squad Statistics
**GET** `/api/squads/:id/stats`

**Headers:** `Authorization: Bearer <token>`

---

## User Endpoints

### Get User by ID
**GET** `/api/users/:id`

**Headers:** `Authorization: Bearer <token>`

### Update User Profile
**PUT** `/api/users/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "newusername",
  "full_name": "New Name",
  "avatar_url": "https://example.com/avatar.jpg",
  "timezone": "America/Los_Angeles"
}
```

### Delete User Account
**DELETE** `/api/users/:id`

**Headers:** `Authorization: Bearer <token>`

### Get User Statistics
**GET** `/api/users/:id/stats`

**Headers:** `Authorization: Bearer <token>`

---

## Error Responses

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.
