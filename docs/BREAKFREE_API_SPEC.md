# BreakFree Backend API Specification

## Base URL
- **Development**: `http://localhost:3000/api/v1`
- **Staging**: `https://staging-api.breakfree.dev/api/v1`
- **Production**: `https://api.breakfree.dev/api/v1`

## Authentication
All requests (except auth endpoints) require:
```
Authorization: Bearer {idToken}
```

Token obtained from Firebase Authentication. Refresh token automatically via interceptor.

---

## 1. Authentication Endpoints

### POST /auth/signup
**Public** - Create new user account

**Request**:
```json
{
  "email": "elif@breakfree.com",
  "password": "SecurePass123!",
  "displayName": "Elif Kaya"
}
```

**Response** (201):
```json
{
  "uid": "user123",
  "email": "elif@breakfree.com",
  "displayName": "Elif Kaya",
  "idToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh_token_123"
}
```

**Errors**:
- `400` - Email already exists, weak password
- `500` - Server error

---

### POST /auth/login
**Public** - Authenticate existing user

**Request**:
```json
{
  "email": "elif@breakfree.com",
  "password": "SecurePass123!"
}
```

**Response** (200): Same as signup

---

### POST /auth/logout
**Protected** - Sign out user

**Response** (200): `{ "message": "Logged out" }`

---

### POST /auth/refresh
**Protected** - Refresh authentication token

**Response** (200):
```json
{
  "idToken": "new_token_123",
  "expiresIn": 3600
}
```

---

### POST /auth/reset-password
**Public** - Send password reset email

**Request**:
```json
{
  "email": "elif@breakfree.com"
}
```

**Response** (200): `{ "message": "Reset email sent" }`

---

## 2. User Endpoints

### GET /users/:uid
**Protected** - Get user profile

**Response** (200):
```json
{
  "uid": "user123",
  "email": "elif@breakfree.com",
  "displayName": "Elif Kaya",
  "avatar": "https://storage.../avatar.jpg",
  "bio": "Fitness enthusiast",
  "goals": ["sleep", "fitness"],
  "preferences": {
    "language": "tr",
    "units": "metric",
    "notifications": true
  },
  "createdAt": "2026-05-17T10:30:00Z",
  "stats": {
    "talksJoined": 12,
    "friendsCount": 45,
    "challengesCompleted": 3
  }
}
```

---

### PATCH /users/:uid
**Protected** - Update user profile

**Request**:
```json
{
  "displayName": "Elif K.",
  "bio": "Wellness & fitness",
  "preferences": {
    "language": "tr",
    "notifications": true
  }
}
```

**Response** (200): Updated user object

---

### GET /users/:uid/metrics
**Protected** - Get user health metrics

**Query Params**:
- `period`: `daily` | `weekly` | `monthly` (default: `daily`)
- `days`: Number of days to retrieve (default: 7)

**Response** (200):
```json
{
  "metrics": [
    {
      "date": "2026-05-17",
      "sleep": { "hours": 7.4, "quality": "good" },
      "heartRate": { "avg": 64, "min": 55, "max": 92 },
      "steps": 8200,
      "calories": 1847,
      "wellnessScore": 76
    },
    ...
  ],
  "period": "daily",
  "dataSource": "apple_health" // or google_fit, manual
}
```

---

### GET /users/:uid/badges
**Protected** - Get user achievements

**Response** (200):
```json
{
  "badges": [
    {
      "id": "badge_7day_streak",
      "title": "7-Day Streak",
      "description": "Meditate 7 days in a row",
      "icon": "🏆",
      "unlockedAt": "2026-05-10T15:30:00Z"
    }
  ],
  "totalUnlocked": 5
}
```

---

## 3. Talks Endpoints

### GET /talks
**Protected** - List talks (browse)

**Query Params**:
- `category`: `Sağlık`, `Hareket`, `Zihin`, `Topluluk` (filter)
- `status`: `scheduled`, `live`, `ended` (default: all)
- `limit`: 10–50 (default: 20)
- `offset`: For pagination
- `search`: Search by title

**Response** (200):
```json
{
  "talks": [
    {
      "talkId": "talk123",
      "title": "Anksiyeteyi Anlamak",
      "description": "Understanding anxiety management...",
      "category": "Zihin",
      "host": {
        "uid": "host1",
        "displayName": "Dr. Ayşe Demir",
        "avatar": "..."
      },
      "status": "live",
      "scheduledAt": "2026-05-17T15:00:00Z",
      "duration": 30,
      "listeners": 347,
      "imageUrl": "https://..."
    }
  ],
  "total": 150,
  "hasMore": true
}
```

---

### GET /talks/:talkId
**Protected** - Get talk details

**Response** (200):
```json
{
  "talkId": "talk123",
  "title": "Anksiyeteyi Anlamak",
  "description": "...",
  "category": "Zihin",
  "host": { ... },
  "status": "live",
  "scheduledAt": "2026-05-17T15:00:00Z",
  "duration": 30,
  "listeners": 347,
  "imageUrl": "...",
  "agoraToken": "token_123" // If user can join
}
```

---

### POST /talks/:talkId/join
**Protected** - Join a talk (audience)

**Request**:
```json
{
  "userRole": "audience" // or "host" (only if you're the host)
}
```

**Response** (200):
```json
{
  "talkId": "talk123",
  "agoraToken": "token_123",
  "channelId": "talk123",
  "uid": "user123"
}
```

---

### POST /talks/:talkId/messages
**Protected** - Send chat message during talk

**Request**:
```json
{
  "text": "Great talk!"
}
```

**Response** (201):
```json
{
  "messageId": "msg123",
  "userId": "user123",
  "userName": "Elif",
  "text": "Great talk!",
  "timestamp": "2026-05-17T15:30:00Z"
}
```

---

### GET /talks/:talkId/messages
**Protected** - Get talk chat messages

**Query Params**:
- `limit`: Max messages (default: 50)
- `before`: Message ID for pagination

**Response** (200):
```json
{
  "messages": [
    {
      "messageId": "msg123",
      "userId": "user123",
      "userName": "Elif",
      "avatar": "...",
      "text": "Great talk!",
      "timestamp": "2026-05-17T15:30:00Z"
    }
  ]
}
```

---

### POST /talks/:talkId/end
**Protected** - End a talk (host only)

**Request**: (empty)

**Response** (200):
```json
{
  "talkId": "talk123",
  "status": "ended",
  "endedAt": "2026-05-17T15:45:00Z",
  "recordingUrl": "https://...", // If recorded
  "listenerCount": 347
}
```

---

## 4. Community Endpoints

### GET /community/posts
**Protected** - Get community feed

**Query Params**:
- `limit`: 10–50 (default: 20)
- `offset`: Pagination
- `userId`: Filter by user

**Response** (200):
```json
{
  "posts": [
    {
      "postId": "post123",
      "userId": "user123",
      "userName": "Burak Yılmaz",
      "avatar": "...",
      "text": "Just completed 10K run!",
      "images": ["url1", "url2"],
      "stats": {
        "distance": "10.2 km",
        "duration": "48:32",
        "avgHeartRate": 142
      },
      "likes": 47,
      "comments": 12,
      "createdAt": "2026-05-17T10:00:00Z"
    }
  ],
  "total": 500,
  "hasMore": true
}
```

---

### POST /community/posts
**Protected** - Create a post

**Request** (multipart/form-data):
```
{
  "text": "Just completed 10K run!",
  "images": [file1, file2],
  "stats": {
    "distance": "10.2 km",
    "duration": "48:32"
  }
}
```

**Response** (201): Created post object

---

### POST /community/posts/:postId/like
**Protected** - Like a post

**Response** (200):
```json
{
  "postId": "post123",
  "likes": 48,
  "userLiked": true
}
```

---

### POST /community/posts/:postId/comments
**Protected** - Add comment to post

**Request**:
```json
{
  "text": "Amazing effort!"
}
```

**Response** (201):
```json
{
  "commentId": "comment123",
  "postId": "post123",
  "userId": "user123",
  "text": "Amazing effort!",
  "createdAt": "2026-05-17T10:30:00Z"
}
```

---

## 5. Events Endpoints

### GET /events
**Protected** - List events

**Query Params**:
- `status`: `upcoming`, `past` (default: `upcoming`)
- `limit`: 10–50 (default: 20)
- `location`: Filter by location

**Response** (200):
```json
{
  "events": [
    {
      "eventId": "event123",
      "title": "Belgrad Ormanı Şafak Yürüyüşü",
      "description": "...",
      "image": "...",
      "location": "Belgrad Ormanı, İstanbul",
      "coordinates": { "lat": 41.0534, "lng": 29.0136 },
      "scheduledAt": "2026-05-18T06:00:00Z",
      "rsvpCount": 24,
      "userRsvp": false
    }
  ]
}
```

---

### POST /events/:eventId/rsvp
**Protected** - RSVP to event

**Request**:
```json
{
  "status": "yes" // or "no", "maybe"
}
```

**Response** (200):
```json
{
  "eventId": "event123",
  "userStatus": "yes",
  "rsvpCount": 25
}
```

---

## 6. Mentorship Endpoints

### GET /mentors
**Protected** - Browse mentors

**Query Params**:
- `specialty`: Filter by specialty
- `minRating`: Min rating (default: 0)
- `limit`: 10–50 (default: 20)

**Response** (200):
```json
{
  "mentors": [
    {
      "mentorId": "mentor1",
      "displayName": "Dr. Ayşe Demir",
      "specialty": "wellness",
      "experience": 8,
      "rating": 4.8,
      "reviews": 42,
      "avatar": "...",
      "bio": "Wellness coach with 8 years experience",
      "nextAvailableSlot": "2026-05-20T10:00:00Z"
    }
  ]
}
```

---

### GET /mentors/:mentorId
**Protected** - Get mentor details

**Response** (200):
```json
{
  "mentorId": "mentor1",
  "displayName": "Dr. Ayşe Demir",
  "specialty": "wellness",
  "experience": 8,
  "rating": 4.8,
  "reviews": 42,
  "avatar": "...",
  "bio": "...",
  "availability": {
    "Monday": ["09:00", "10:00", "14:00", "15:00"],
    "Tuesday": ["10:00", "11:00"]
  },
  "pricing": {
    "sessionDuration": 60,
    "pricePerSession": 500 // in TRY
  }
}
```

---

### POST /mentors/:mentorId/book
**Protected** - Book mentorship session

**Request**:
```json
{
  "date": "2026-05-20",
  "time": "10:00",
  "weeklyFocus": "Improve sleep quality"
}
```

**Response** (201):
```json
{
  "sessionId": "session123",
  "mentorId": "mentor1",
  "mentorName": "Dr. Ayşe Demir",
  "scheduledAt": "2026-05-20T10:00:00Z",
  "duration": 60,
  "price": 500,
  "status": "confirmed",
  "zoomLink": "https://zoom.us/..." // For video call
}
```

---

### GET /mentors/:mentorId/sessions
**Protected** - Get user's sessions with mentor

**Response** (200):
```json
{
  "sessions": [
    {
      "sessionId": "session123",
      "mentorId": "mentor1",
      "scheduledAt": "2026-05-20T10:00:00Z",
      "status": "completed",
      "notes": "Discussed sleep schedule improvements",
      "feedback": 5,
      "nextSessionDate": "2026-05-27"
    }
  ]
}
```

---

## 7. Health Metrics Endpoints

### POST /health/sync
**Protected** - Manually sync health data from wearable

**Request**:
```json
{
  "source": "apple_health" // or "google_fit", "garmin"
}
```

**Response** (200):
```json
{
  "synced": true,
  "recordsCount": 45,
  "lastSync": "2026-05-17T10:30:00Z",
  "nextSync": "2026-05-18T10:30:00Z"
}
```

---

### GET /health/metrics
**Protected** - Get health metrics (same as /users/:uid/metrics)

---

### POST /health/metrics
**Protected** - Log manual metric (if not synced from device)

**Request**:
```json
{
  "date": "2026-05-17",
  "metrics": {
    "sleep": { "hours": 7.4 },
    "steps": 8200,
    "calories": 1847
  }
}
```

**Response** (201): Logged metrics

---

## 8. Challenges Endpoints

### GET /challenges
**Protected** - List active challenges

**Query Params**:
- `status`: `active`, `completed` (default: `active`)
- `limit`: 10–50

**Response** (200):
```json
{
  "challenges": [
    {
      "challengeId": "challenge_1",
      "title": "50K Steps Challenge",
      "description": "Walk 50,000 steps this week",
      "icon": "🚶",
      "startDate": "2026-05-17T00:00:00Z",
      "endDate": "2026-05-24T23:59:59Z",
      "participants": 1247,
      "userParticipating": true,
      "userCurrentValue": 34200
    }
  ]
}
```

---

### GET /challenges/:challengeId/leaderboard
**Protected** - Get challenge leaderboard

**Query Params**:
- `limit`: 10–100 (default: 100)
- `userRank`: Get user's rank

**Response** (200):
```json
{
  "challengeId": "challenge_1",
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user456",
      "displayName": "Ayşe K.",
      "avatar": "...",
      "value": 52340,
      "badge": "🥇"
    },
    { "rank": 2, "value": 51200, ... },
    { "rank": 3, "value": 49875, ... }
  ],
  "userRank": 45,
  "userValue": 34200
}
```

---

### POST /challenges/:challengeId/join
**Protected** - Join a challenge

**Response** (200):
```json
{
  "challengeId": "challenge_1",
  "status": "joined",
  "participants": 1248
}
```

---

## 9. Payments Endpoints

### POST /payments/create-intent
**Protected** - Create Stripe payment intent

**Request**:
```json
{
  "planId": "pro_monthly",
  "paymentMethodId": "pm_123"
}
```

**Response** (200):
```json
{
  "clientSecret": "pi_1234_secret_5678",
  "amount": 2999, // in cents
  "currency": "try",
  "planName": "BreakFree Pro"
}
```

---

### GET /payments/subscription
**Protected** - Get user's current subscription

**Response** (200):
```json
{
  "subscription": {
    "id": "sub_123",
    "planId": "pro_monthly",
    "status": "active",
    "currentPeriodStart": "2026-05-01T00:00:00Z",
    "currentPeriodEnd": "2026-06-01T00:00:00Z",
    "autoRenew": true,
    "price": 2999
  }
}
```

---

### POST /payments/cancel-subscription
**Protected** - Cancel subscription

**Response** (200):
```json
{
  "subscription": {
    "id": "sub_123",
    "status": "canceled",
    "canceledAt": "2026-05-17T10:30:00Z",
    "effectiveDate": "2026-06-01T00:00:00Z"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "invalid_input",
  "message": "Email already exists",
  "details": { "field": "email" }
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Talk not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "server_error",
  "message": "Something went wrong on our end"
}
```

---

## Rate Limiting

- **General**: 100 requests per minute per user
- **Auth endpoints**: 5 attempts per 15 minutes
- **Payment endpoints**: 10 requests per minute
- **Upload endpoints**: 5 files per minute

**Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1715770800
```

---

## Webhooks (Stripe)

### POST /webhooks/stripe
Handles payment events:
- `payment_intent.succeeded` — Mark subscription active
- `payment_intent.payment_failed` — Send retry notification
- `customer.subscription.deleted` — Deactivate premium

**Security**: Verify Stripe signature in header

---

## Testing

### Test Credentials

**Email**: `test@breakfree.dev`  
**Password**: `TestPass123!`

### Sandbox Payment Cards

- **Visa**: `4242 4242 4242 4242`
- **Amex**: `3782 822463 10005`
- **Declined**: `4000 0000 0000 0002`

---

## API Documentation

Complete interactive docs at: `https://docs.api.breakfree.dev` (Swagger/OpenAPI)

---

**API Version**: v1  
**Last Updated**: May 17, 2026  
**Status**: Ready for MVP Development
