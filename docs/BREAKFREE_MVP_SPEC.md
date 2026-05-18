# BreakFree Türkiye — MVP Technical Specification

## 1. Tech Stack Decision

### Frontend
- **Framework**: React Native with Expo
  - Why: Rapid iteration, live updates (EAS), no native code initially
  - Alternative: Flutter (if Swift/Kotlin team preference)
  
- **State Management**: Redux Toolkit + Redux Persist
  - Global state: user, auth, talks, metrics
  - Local storage: offline cache
  
- **Navigation**: React Navigation (Stack + Tab + Drawer)
  - Tab-based primary (5 tabs)
  - Modal for detailed views
  - Stack for deep linking
  
- **UI Framework**: Custom components + React Native Paper (optional)
  - Design tokens in constants
  - Custom theme provider
  
- **Forms**: React Hook Form + Yup validation
- **HTTP**: Axios + interceptors for auth/errors
- **Charts**: Victory Native or React Native Chart Kit (mock data for MVP)
- **Audio**: React Native Sound + RNWebRTC (for talks, later)

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Firebase Firestore (MVP) → PostgreSQL (Phase 2)
- **Auth**: Firebase Authentication
- **Real-time**: Firebase Realtime Database (talks) → Socket.io (Phase 2)
- **Storage**: Firebase Storage (user avatars, talk recordings)
- **Hosting**: Firebase Hosting (frontend) or Vercel

### Development Tools
- **Package Manager**: npm or pnpm
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions → EAS Build → TestFlight/Play Store
- **Monitoring**: Firebase Analytics + Crashlytics
- **Testing**: Jest + React Native Testing Library
- **Code Quality**: ESLint + Prettier + Husky
- **API Testing**: Postman/Insomnia

---

## 2. Project Structure

```
breakfree-app/
├── app/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── SignupScreen.js
│   │   │   └── OnboardingScreen.js
│   │   ├── Home/
│   │   │   └── DashboardScreen.js
│   │   ├── Talks/
│   │   │   ├── TalksListScreen.js
│   │   │   └── TalkDetailScreen.js
│   │   ├── Health/
│   │   │   └── HealthMetricsScreen.js
│   │   ├── Community/
│   │   │   └── CommunityScreen.js
│   │   └── Profile/
│   │       └── ProfileScreen.js
│   ├── navigation/
│   │   ├── RootNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── AppNavigator.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── Input.js
│   │   │   └── ...
│   │   ├── features/
│   │   │   ├── WellnessRing.js
│   │   │   ├── TalkCard.js
│   │   │   ├── MetricBar.js
│   │   │   └── ...
│   │   └── layout/
│   │       ├── Header.js
│   │       ├── TabBar.js
│   │       └── ...
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── userSlice.js
│   │   │   ├── talksSlice.js
│   │   │   └── metricsSlice.js
│   │   ├── index.js (store config)
│   │   └── hooks.js
│   ├── services/
│   │   ├── api.js (Axios instance)
│   │   ├── auth.js
│   │   ├── talks.js
│   │   ├── health.js
│   │   ├── community.js
│   │   └── firebase.js (initialization)
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUser.js
│   │   ├── useTalks.js
│   │   └── ...
│   ├── utils/
│   │   ├── constants.js
│   │   ├── colors.js (design tokens)
│   │   ├── typography.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── assets/
│   │   ├── fonts/
│   │   ├── images/
│   │   └── icons/
│   ├── i18n/ (translations)
│   │   ├── en.json
│   │   ├── tr.json
│   │   └── index.js
│   ├── App.js (root component)
│   └── app.json (Expo config)
├── backend/
│   ├── functions/ (Firebase Cloud Functions)
│   │   ├── auth/
│   │   │   ├── onCreate.js
│   │   │   └── onDelete.js
│   │   ├── talks/
│   │   │   ├── onCreate.js
│   │   │   └── onUpdate.js
│   │   └── index.js
│   ├── firestore.rules
│   ├── storage.rules
│   └── firebase.json
├── tests/
│   ├── unit/
│   │   ├── slices/
│   │   └── utils/
│   ├── components/
│   └── e2e/
├── .github/
│   └── workflows/
│       ├── test.yml
│       ├── build-ios.yml
│       └── build-android.yml
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   └── CONTRIBUTION.md
├── package.json
├── tsconfig.json (if using TypeScript)
├── .env.example
└── README.md
```

---

## 3. Database Schema (Firestore)

### Collections

#### `users/{uid}`
```json
{
  "uid": "user123",
  "email": "elif@breakfree.com",
  "displayName": "Elif Kaya",
  "avatar": "https://storage.../avatar.jpg",
  "bio": "Fitness enthusiast",
  "goals": ["sleep", "fitness"],
  "createdAt": 1718640000000,
  "updatedAt": 1718640000000,
  "preferences": {
    "language": "tr",
    "units": "metric",
    "notifications": true
  }
}
```

#### `talks/{talkId}`
```json
{
  "talkId": "talk123",
  "title": "Anksiyeteyi Anlamak",
  "description": "Dr. Ayşe explains...",
  "host": {
    "uid": "host1",
    "name": "Dr. Ayşe Demir",
    "avatar": "..."
  },
  "category": "Zihin",
  "status": "scheduled", // or "live", "ended"
  "scheduledAt": 1718721600000,
  "duration": 30,
  "imageUrl": "...",
  "listeners": 0,
  "createdAt": 1718640000000,
  "updatedAt": 1718640000000
}
```

#### `talks/{talkId}/listeners/{uid}`
```json
{
  "uid": "user123",
  "joinedAt": 1718721600000,
  "active": true
}
```

#### `talks/{talkId}/messages/{messageId}`
```json
{
  "messageId": "msg123",
  "userId": "user123",
  "userName": "Elif",
  "text": "Great talk!",
  "timestamp": 1718721650000
}
```

#### `community/{postId}`
```json
{
  "postId": "post123",
  "userId": "user123",
  "userName": "Burak Yılmaz",
  "avatar": "...",
  "text": "Just completed 10K run!",
  "images": ["..."],
  "stats": {
    "distance": "10.2 km",
    "duration": "48:32",
    "avgHeartRate": 142
  },
  "likes": 47,
  "comments": 12,
  "createdAt": 1718640000000,
  "updatedAt": 1718640000000
}
```

#### `events/{eventId}`
```json
{
  "eventId": "event123",
  "title": "Belgrad Ormanı Şafak Yürüyüşü",
  "description": "...",
  "location": "Belgrad Ormanı, İstanbul",
  "image": "...",
  "scheduledAt": 1718800000000,
  "rsvpCount": 24,
  "createdAt": 1718640000000,
  "updatedAt": 1718640000000
}
```

#### `mentors/{mentorId}`
```json
{
  "mentorId": "mentor1",
  "userId": "user1",
  "name": "Dr. Ayşe Demir",
  "specialty": "wellness",
  "experience": 8,
  "rating": 4.8,
  "reviews": 42,
  "avatar": "...",
  "bio": "Wellness coach with 8 years experience",
  "availability": {
    "Monday": ["09:00", "17:00"],
    "Tuesday": ["09:00", "17:00"]
  },
  "createdAt": 1718640000000
}
```

---

## 4. API Endpoints (Backend)

### Authentication
```
POST /auth/signup
POST /auth/login
POST /auth/logout
POST /auth/refresh
```

### Users
```
GET /users/:uid
PATCH /users/:uid
GET /users/:uid/metrics
```

### Talks
```
GET /talks (list + filters)
GET /talks/:talkId
POST /talks (host only)
PATCH /talks/:talkId (host only)
POST /talks/:talkId/join
POST /talks/:talkId/messages
GET /talks/:talkId/messages
```

### Community
```
GET /community/posts
POST /community/posts
GET /community/posts/:postId
POST /community/posts/:postId/like
POST /community/posts/:postId/comments
```

### Events
```
GET /events
GET /events/:eventId
POST /events/:eventId/rsvp
```

### Mentors
```
GET /mentors
GET /mentors/:mentorId
POST /mentors/:mentorId/book
```

---

## 5. Authentication Flow

### Sign Up
1. User enters email, password, name
2. Validate locally (React Hook Form + Yup)
3. POST /auth/signup → Firebase createUserWithEmailAndPassword
4. Auto-create Firestore document
5. Navigate to Onboarding (select goals, avatar)
6. Store auth token in Redux + AsyncStorage
7. Navigate to Home

### Login
1. Enter email + password
2. POST /auth/login → Firebase signInWithEmailAndPassword
3. Fetch user profile from Firestore
4. Store in Redux
5. Navigate to Home (or prompt onboarding if new)

### Protected Routes
- All API calls include `Authorization: Bearer {token}` header
- Interceptor refreshes token if expired
- Redirect to Login on 401

---

## 6. State Management (Redux)

### authSlice
```javascript
{
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: null,
  token: null
}
```

### userSlice
```javascript
{
  uid: "user123",
  profile: { name, email, avatar, ... },
  preferences: { language, units, ... },
  loading: false
}
```

### talksSlice
```javascript
{
  allTalks: [],
  currentTalk: null,
  listeners: [],
  messages: [],
  loading: false,
  error: null
}
```

### metricsSlice
```javascript
{
  dailyMetrics: {
    date: "2026-05-17",
    sleep: { hours: 7.4, quality: "good" },
    heartRate: 64,
    steps: 8200,
    calories: 1847
  },
  weeklyData: [...],
  wellnessScore: 76
}
```

---

## 7. MVP Screens Checklist

### Auth Stack
- [ ] Splash Screen (logo + loading)
- [ ] Login Screen
  - [ ] Email input + validation
  - [ ] Password input
  - [ ] "Forgot password" link
  - [ ] Apple/Google sign-in buttons
  - [ ] "Sign up" link
  
- [ ] Signup Screen
  - [ ] Email input
  - [ ] Password + confirm password
  - [ ] Terms acceptance checkbox
  - [ ] Sign up button
  - [ ] "Back to login" link
  
- [ ] Onboarding Screen 1 (Welcome)
  - [ ] Logo + tagline
  - [ ] "Next" button
  
- [ ] Onboarding Screen 2 (Goals)
  - [ ] Multi-select goals (Sağlık, Hareket, Zihin, etc.)
  - [ ] "Next" button
  
- [ ] Onboarding Screen 3 (Profile)
  - [ ] Avatar picker
  - [ ] Name input
  - [ ] Bio textarea
  - [ ] "Complete" button

### App Stack
- [ ] Home/Dashboard Screen
  - [ ] Header (greeting + notification bell)
  - [ ] Wellness ring + score
  - [ ] 4 metric cards
  - [ ] Today's plan section
  - [ ] Bottom tab bar
  
- [ ] Talks/Palestralar Screen
  - [ ] Search bar + filters
  - [ ] Live/Featured banner
  - [ ] Talks list (infinite scroll)
  - [ ] Each talk card (image, title, host, listeners)
  
- [ ] Talk Detail Screen
  - [ ] Talk hero (image, title, host)
  - [ ] Join button (disabled during MVP)
  - [ ] Description
  - [ ] Host info
  - [ ] Share/bookmark buttons
  
- [ ] Health Metrics Screen
  - [ ] Period selector (Day/Week/Month)
  - [ ] Wellness score card
  - [ ] Line chart
  - [ ] 4 metric bars
  - [ ] AI insight card
  
- [ ] Community Screen
  - [ ] Featured event banner
  - [ ] Community posts list
  - [ ] Each post card (avatar, name, text, stats, likes)
  - [ ] Weekly challenge progress bar
  
- [ ] Profile Screen
  - [ ] Avatar + name + stats
  - [ ] Edit profile link
  - [ ] Settings section
  - [ ] Language selector
  - [ ] Logout button

---

## 8. Sprint Plan (Week by Week)

### Sprint 1: Foundation (Week 1–2)
- [ ] Project setup (Expo, Redux, navigation)
- [ ] Design system (colors, typography, components)
- [ ] Firebase setup + authentication rules
- [ ] Auth screens (login, signup, onboarding)
- [ ] Navigation stack structure
- **Deliverable**: Auth flow end-to-end working

### Sprint 2: Home & Core Components (Week 3–4)
- [ ] Dashboard screen layout
- [ ] Wellness ring component (hardcoded data)
- [ ] Metric cards
- [ ] Tab navigation
- [ ] API service setup (Axios + Firebase client SDK)
- [ ] User profile sync from Firestore
- **Deliverable**: Home screen + profile fetching works

### Sprint 3: Talks Feature (Week 5–6)
- [ ] Talks list screen
- [ ] Talk card components
- [ ] Talk detail screen
- [ ] Firestore queries (list talks + pagination)
- [ ] Category filters
- [ ] Search functionality (local filter for MVP)
- **Deliverable**: Browse talks fully functional

### Sprint 4: Health & Community (Week 7–8)
- [ ] Health metrics screen
- [ ] Mock health data (Redux)
- [ ] Weekly view toggle
- [ ] Chart component integration
- [ ] Community screen + posts
- [ ] Event cards + banner
- [ ] Challenge progress bar
- **Deliverable**: All screens navigable with mock data

### Sprint 5: Profile & Settings (Week 9)
- [ ] Profile screen
- [ ] Edit profile modal
- [ ] Settings (language, units, theme)
- [ ] User preferences storage
- [ ] Logout flow
- **Deliverable**: Full settings management

### Sprint 6: Polish & Testing (Week 10–11)
- [ ] E2E testing (critical flows)
- [ ] Component tests
- [ ] Bug fixes
- [ ] Performance audit
- [ ] Offline caching (Redux Persist)
- [ ] Error handling
- [ ] Loading states
- **Deliverable**: TestFlight/Play Store ready

### Sprint 7: Beta Launch Prep (Week 12)
- [ ] App Store metadata (screenshots, description)
- [ ] Privacy policy + terms
- [ ] Marketing assets
- [ ] Beta tester invites (50–100 users)
- [ ] Crash reporting setup
- [ ] Analytics dashboard
- **Deliverable**: Closed beta live

---

## 9. Key Components to Build

### WellnessRing.js
```javascript
// SVG-based animated ring chart
// Props: score (0–100), size, color
// Animation on mount
```

### TalkCard.js
```javascript
// Displays: image, title, category, host avatar, listener count
// Props: talk object
// onPress handler
```

### MetricCard.js
```javascript
// Icon + label + value + unit
// Props: icon, label, value, unit, color
```

### MetricBar.js
```javascript
// Horizontal bar with percentage
// Props: label, value, color
```

### LineChart.js
```javascript
// Weekly line chart (Victory Native or RN Chart Kit)
// Props: data array, yAxis label, color
```

### TalksList.js
```javascript
// FlatList of TalkCard with pagination
// Props: talks array, onPress, filters
```

### CommunityPost.js
```javascript
// User info, content, stats (if any), like/comment buttons
// Props: post object, onLike, onComment
```

---

## 10. Testing Strategy

### Unit Tests (Jest)
- Redux slices (actions, reducers)
- Utility functions (validators, helpers)
- **Target**: 40% coverage

### Component Tests (React Native Testing Library)
- Common components (Button, Card, Input)
- Feature components (WellnessRing, TalkCard)
- **Target**: Snapshot tests

### E2E Tests (Detox or Appium)
1. Sign up + onboarding
2. Navigate to each tab
3. Browse talks
4. View community posts
5. Access settings + logout
6. Log back in

### Manual Testing
- Device testing: iPhone 14, iPhone 15, Samsung S23
- Network conditions: 3G, offline
- Orientation changes
- Cold/warm app launches

---

## 11. Deployment Pipeline

### Development
- Main branch protected (PR reviews)
- Feature branches (feature/auth, feature/talks, etc.)
- Automated tests on PR
- Manual QA on staging build

### Staging
- EAS Build → Staging build → TestFlight/Play Store Internal Testing
- Daily automated builds from `develop` branch
- Beta testers (internal team + early access users)

### Production
- Tag releases (v1.0.0, v1.0.1, etc.)
- EAS Build → Submission to stores
- Staged rollout: 10% → 50% → 100%
- Monitoring & crash reporting

### Rollback Plan
- Keep previous version in stores for 2 weeks
- Hot patch procedure (fast-track review)
- In-app messaging to downgrade if critical issue

---

## 12. Firebase Security Rules (MVP)

### Firestore Rules
```
match /users/{uid} {
  allow read, write: if request.auth.uid == uid;
  allow read: if isPublic(resource.data);
}

match /talks/{talkId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == resource.data.host.uid;
  match /listeners/{uid} {
    allow read, write: if request.auth.uid == uid;
  }
  match /messages/{messageId} {
    allow read, write: if request.auth != null;
  }
}

match /community/{postId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update, delete: if request.auth.uid == resource.data.userId;
}

match /events/{eventId} {
  allow read: if request.auth != null;
  allow write: if isAdmin(request.auth.token);
}
```

### Storage Rules
```
match /avatars/{uid}/{file=**} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == uid && request.resource.size < 5 * 1024 * 1024;
}
```

---

## 13. Error Handling & Logging

### Global Error Boundary
```javascript
// Catches React errors
// Displays user-friendly message
// Logs to Crashlytics
// Offers retry/home action
```

### API Error Handling
```javascript
// Interceptor catches all HTTP errors
// Log to Firebase Analytics
// User-facing toast messages
// Retry logic for network errors
```

### Logging Strategy
- Firebase Analytics: User events (login, talk_joined, post_viewed)
- Crashlytics: Unhandled errors + breadcrumbs
- Console logs: Development only (stripped in production)

---

## 14. Performance Targets

| Metric | Target |
|--------|--------|
| App startup | < 2 seconds |
| Screen transition | < 300ms |
| Bundle size | < 150MB |
| First contentful paint | < 1.5s |
| List scroll FPS | 60 FPS |
| API latency (p95) | < 500ms |
| Memory usage | < 150MB |

---

## 15. Success Criteria (MVP)

- ✅ All 8 screens working & navigable
- ✅ Auth (signup/login) functional end-to-end
- ✅ User profile persists
- ✅ Talks list populated from Firestore
- ✅ Community posts display (mock or seed data)
- ✅ Health metrics show (mock data)
- ✅ Settings save & persist
- ✅ App passes App Store review guidelines
- ✅ >4.5 star rating from 50+ testers
- ✅ <1% crash rate in beta
- ✅ >100 beta signups acquired
- ✅ Ready for soft launch in Turkey

---

**Document Status**: Ready for Development  
**Last Updated**: May 17, 2026  
**Next Phase**: Week 1 Sprint Planning  
**Approval**: Pending PM Sign-off
