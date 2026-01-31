# Teacher Portal - API Reference

Complete REST API documentation for the Animat teacher portal.

## Base URL
All endpoints are prefixed with `/api/teacher`

## Authentication
All endpoints require authentication via NextAuth session.

## Response Format
All responses are in JSON format.

### Success Response
```json
{
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## Topics

### List All Topics
```http
GET /api/teacher/topics
```

**Response**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "id": "algebra",
    "title": "Algebra",
    "description": "Introduction to algebraic concepts",
    "createdBy": "user_id",
    "published": false,
    "createdAt": "2024-01-31T10:00:00Z",
    "updatedAt": "2024-01-31T10:00:00Z"
  }
]
```

---

### Get Single Topic
```http
GET /api/teacher/topics/:topicId
```

**Parameters**
- `topicId` (string) - Topic ID

**Response**
```json
{
  "topic": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "id": "algebra",
    "title": "Algebra",
    "description": "Introduction to algebraic concepts",
    "createdBy": "user_id",
    "published": false
  },
  "subtopics": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
      "id": "algebra-linear-equations",
      "title": "Linear Equations",
      "description": "Solving linear equations",
      "topicId": "algebra",
      "published": false
    }
  ]
}
```

---

### Create Topic
```http
POST /api/teacher/topics
```

**Request Body**
```json
{
  "title": "Algebra",
  "description": "Introduction to algebraic concepts"
}
```

**Response**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "id": "algebra",
  "title": "Algebra",
  "description": "Introduction to algebraic concepts",
  "createdBy": "user_id",
  "published": false,
  "createdAt": "2024-01-31T10:00:00Z",
  "updatedAt": "2024-01-31T10:00:00Z"
}
```

**Validation**
- `title` - Required, string
- `description` - Required, string

---

### Update Topic
```http
PATCH /api/teacher/topics/:topicId
```

**Parameters**
- `topicId` (string) - Topic ID

**Request Body**
```json
{
  "title": "Advanced Algebra",
  "description": "Updated description",
  "published": true
}
```

**Response**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "id": "algebra",
  "title": "Advanced Algebra",
  "description": "Updated description",
  "createdBy": "user_id",
  "published": true,
  "updatedAt": "2024-01-31T11:00:00Z"
}
```

---

### Delete Topic
```http
DELETE /api/teacher/topics/:topicId
```

**Parameters**
- `topicId` (string) - Topic ID

**Response**
```json
{
  "success": true
}
```

**Note:** Cascades delete to all subtopics, tutorials, and tests.

---

## Subtopics

### List Subtopics
```http
GET /api/teacher/topics/:topicId/subtopics
```

**Parameters**
- `topicId` (string) - Parent topic ID

**Response**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "id": "algebra-linear-equations",
    "title": "Linear Equations",
    "description": "Solving linear equations",
    "topicId": "algebra",
    "createdBy": "user_id",
    "published": false,
    "createdAt": "2024-01-31T10:00:00Z"
  }
]
```

---

### Get Single Subtopic
```http
GET /api/teacher/topics/:topicId/subtopics/:subtopicId
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Subtopic ID

**Response**
```json
{
  "subtopic": {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "id": "algebra-linear-equations",
    "title": "Linear Equations",
    "description": "Solving linear equations",
    "topicId": "algebra",
    "published": false
  },
  "tutorials": [
    {
      "_id": "tutorial_id",
      "id": "tutorial-slug",
      "title": "Introduction to Linear Equations",
      "description": "Learn the basics",
      "duration": "15 min",
      "level": "Beginner",
      "hasScene": true
    }
  ],
  "tests": [
    {
      "_id": "test_id",
      "id": "test-slug",
      "title": "Linear Equations Quiz",
      "description": "Test your knowledge",
      "duration": "20 min",
      "questions": 10
    }
  ]
}
```

---

### Create Subtopic
```http
POST /api/teacher/topics/:topicId/subtopics
```

**Parameters**
- `topicId` (string) - Parent topic ID

**Request Body**
```json
{
  "title": "Linear Equations",
  "description": "Solving linear equations"
}
```

**Response**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
  "id": "algebra-linear-equations",
  "title": "Linear Equations",
  "description": "Solving linear equations",
  "topicId": "algebra",
  "createdBy": "user_id",
  "published": false,
  "createdAt": "2024-01-31T10:00:00Z"
}
```

---

### Update Subtopic
```http
PATCH /api/teacher/topics/:topicId/subtopics/:subtopicId
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Subtopic ID

**Request Body**
```json
{
  "title": "Advanced Linear Equations",
  "description": "Updated description",
  "published": true
}
```

**Response**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
  "id": "algebra-linear-equations",
  "title": "Advanced Linear Equations",
  "description": "Updated description",
  "topicId": "algebra",
  "published": true,
  "updatedAt": "2024-01-31T11:00:00Z"
}
```

---

### Delete Subtopic
```http
DELETE /api/teacher/topics/:topicId/subtopics/:subtopicId
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Subtopic ID

**Response**
```json
{
  "success": true
}
```

**Note:** Cascades delete to all tutorials and tests.

---

## Tutorials

### List Tutorials
```http
GET /api/teacher/topics/:topicId/subtopics/:subtopicId/tutorials
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID

**Response**
```json
[
  {
    "_id": "tutorial_id",
    "id": "intro-linear-equations",
    "title": "Introduction to Linear Equations",
    "description": "Learn the basics of linear equations",
    "duration": "15 min",
    "level": "Beginner",
    "steps": [
      "Understand variables",
      "Learn to isolate variables",
      "Practice solving equations"
    ],
    "hasScene": true,
    "sceneData": { /* scene configuration */ },
    "subtopicId": "algebra-linear-equations",
    "topicId": "algebra",
    "createdBy": "user_id",
    "published": false,
    "createdAt": "2024-01-31T10:00:00Z"
  }
]
```

---

### Get Single Tutorial
```http
GET /api/teacher/topics/:topicId/subtopics/:subtopicId/tutorials/:tutorialId
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID
- `tutorialId` (string) - Tutorial ID

**Response**
```json
{
  "_id": "tutorial_id",
  "id": "intro-linear-equations",
  "title": "Introduction to Linear Equations",
  "description": "Learn the basics of linear equations",
  "duration": "15 min",
  "level": "Beginner",
  "steps": ["Step 1", "Step 2"],
  "hasScene": true,
  "sceneData": { /* scene configuration */ },
  "subtopicId": "algebra-linear-equations",
  "topicId": "algebra",
  "published": false
}
```

---

### Create Tutorial
```http
POST /api/teacher/topics/:topicId/subtopics/:subtopicId/tutorials
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID

**Request Body**
```json
{
  "title": "Introduction to Linear Equations",
  "description": "Learn the basics of linear equations",
  "duration": "15 min",
  "level": "Beginner",
  "steps": [
    "Understand variables",
    "Learn to isolate variables",
    "Practice solving equations"
  ],
  "hasScene": true,
  "sceneData": { /* optional scene configuration */ }
}
```

**Validation**
- `title` - Required, string
- `description` - Required, string
- `duration` - Required, string
- `level` - Required, enum: "Beginner" | "Intermediate" | "Advanced"
- `steps` - Optional, array of strings
- `hasScene` - Optional, boolean (default: false)
- `sceneData` - Optional, object

**Response**
```json
{
  "_id": "tutorial_id",
  "id": "intro-linear-equations",
  "title": "Introduction to Linear Equations",
  "description": "Learn the basics of linear equations",
  "duration": "15 min",
  "level": "Beginner",
  "steps": ["Understand variables", "Learn to isolate variables"],
  "hasScene": true,
  "subtopicId": "algebra-linear-equations",
  "topicId": "algebra",
  "createdBy": "user_id",
  "published": false,
  "createdAt": "2024-01-31T10:00:00Z"
}
```

---

### Update Tutorial
```http
PATCH /api/teacher/topics/:topicId/subtopics/:subtopicId/tutorials/:tutorialId
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID
- `tutorialId` (string) - Tutorial ID

**Request Body** (all fields optional)
```json
{
  "title": "Advanced Linear Equations",
  "published": true,
  "sceneData": { /* updated scene configuration */ }
}
```

**Response**
```json
{
  "_id": "tutorial_id",
  "id": "intro-linear-equations",
  "title": "Advanced Linear Equations",
  "published": true,
  "updatedAt": "2024-01-31T11:00:00Z"
}
```

---

### Delete Tutorial
```http
DELETE /api/teacher/topics/:topicId/subtopics/:subtopicId/tutorials/:tutorialId
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID
- `tutorialId` (string) - Tutorial ID

**Response**
```json
{
  "success": true
}
```

---

## Tests

### List Tests
```http
GET /api/teacher/topics/:topicId/subtopics/:subtopicId/tests
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID

**Response**
```json
[
  {
    "_id": "test_id",
    "id": "linear-equations-quiz",
    "title": "Linear Equations Quiz",
    "description": "Test your understanding of linear equations",
    "duration": "20 min",
    "questions": 10,
    "questionsData": [
      {
        "question": "What is the value of x in 2x + 5 = 11?",
        "options": ["2", "3", "4", "5"],
        "correctAnswer": 1
      }
    ],
    "subtopicId": "algebra-linear-equations",
    "topicId": "algebra",
    "createdBy": "user_id",
    "published": false,
    "createdAt": "2024-01-31T10:00:00Z"
  }
]
```

---

### Get Single Test
```http
GET /api/teacher/topics/:topicId/subtopics/:subtopicId/tests/:testId
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID
- `testId` (string) - Test ID

**Response**
```json
{
  "_id": "test_id",
  "id": "linear-equations-quiz",
  "title": "Linear Equations Quiz",
  "description": "Test your understanding of linear equations",
  "duration": "20 min",
  "questions": 10,
  "questionsData": [ /* array of questions */ ],
  "subtopicId": "algebra-linear-equations",
  "topicId": "algebra",
  "published": false
}
```

---

### Create Test
```http
POST /api/teacher/topics/:topicId/subtopics/:subtopicId/tests
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID

**Request Body**
```json
{
  "title": "Linear Equations Quiz",
  "description": "Test your understanding of linear equations",
  "duration": "20 min",
  "questions": 10,
  "questionsData": [
    {
      "question": "What is the value of x in 2x + 5 = 11?",
      "options": ["2", "3", "4", "5"],
      "correctAnswer": 1
    }
  ]
}
```

**Validation**
- `title` - Required, string
- `description` - Required, string
- `duration` - Required, string
- `questions` - Required, number
- `questionsData` - Optional, array of question objects

**Response**
```json
{
  "_id": "test_id",
  "id": "linear-equations-quiz",
  "title": "Linear Equations Quiz",
  "description": "Test your understanding of linear equations",
  "duration": "20 min",
  "questions": 10,
  "questionsData": [],
  "subtopicId": "algebra-linear-equations",
  "topicId": "algebra",
  "createdBy": "user_id",
  "published": false,
  "createdAt": "2024-01-31T10:00:00Z"
}
```

---

### Update Test
```http
PATCH /api/teacher/topics/:topicId/subtopics/:subtopicId/tests/:testId
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID
- `testId` (string) - Test ID

**Request Body** (all fields optional)
```json
{
  "title": "Advanced Linear Equations Quiz",
  "questions": 15,
  "questionsData": [ /* updated questions */ ],
  "published": true
}
```

**Response**
```json
{
  "_id": "test_id",
  "id": "linear-equations-quiz",
  "title": "Advanced Linear Equations Quiz",
  "questions": 15,
  "published": true,
  "updatedAt": "2024-01-31T11:00:00Z"
}
```

---

### Delete Test
```http
DELETE /api/teacher/topics/:topicId/subtopics/:subtopicId/tests/:testId
```

**Parameters**
- `topicId` (string) - Parent topic ID
- `subtopicId` (string) - Parent subtopic ID
- `testId` (string) - Test ID

**Response**
```json
{
  "success": true
}
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no session) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Common Error Responses

### Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### Validation Error
```json
{
  "error": "Missing required fields"
}
```

### Not Found
```json
{
  "error": "Topic not found"
}
```

### Server Error
```json
{
  "error": "Failed to create topic"
}
```
