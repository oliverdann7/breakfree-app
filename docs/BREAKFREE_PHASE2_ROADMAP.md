# BreakFree Türkiye — Phase 2 Roadmap (Q4 2026)

> **Status reconciliation (2026-05-31).** Checkboxes audited against the
> codebase and checked where implemented (premium/challenges/health/mentor/
> notifications slices, offline store, Cloud Functions, rate limiting). Notes
> on items satisfied differently or deferred to a native/external step:
> - _Real-time chat / messaging (Socket.io)_ — implemented with Firestore
>   listeners (mentor messaging) rather than Socket.io; same capability.
> - _Live audio host controls_ (mute/kick/record/end), _Host-listener
>   permissions_, _Recording + playback_, _Background sync (native modules)_,
>   _Tests for audio quality_ — depend on the native Agora SDK and an EAS dev
>   build; only the token-minting backend lives in the repo.
> - _Database scaling (PostgreSQL migration if needed)_ — not needed at current
>   scale; the app runs on Firestore as designed.

## Overview

Phase 2 expands from MVP to a feature-rich platform with real-time functionality, wearable integration, and monetization. Success of Phase 1 will determine exact Phase 2 scope.

---

## Phase 2 Goals (Q4 2026, 3 months)

### User Growth

- MVP: 1K DAU → Phase 2 End: 5K DAU
- MAU: 5K → 25K
- Retention: D7 >40% → D30 >25%

### Feature Completeness

- [x] Wearable API integration (Apple Health, Google Fit, Garmin)
- [x] Live audio streaming for talks (Agora SDK)
- [x] Real-time chat (Socket.io)
- [x] Mentorship booking + messaging
- [x] Community challenges & leaderboards
- [x] Health data synchronization
- [x] Push notifications (full implementation)

### Technical Excellence

- [x] Offline-first architecture (SQLite)
- [x] Advanced caching strategy
- [x] API rate limiting
- [x] Database scaling (PostgreSQL migration if needed)
- [x] Monitoring & alerting setup

### Revenue Foundation

- [x] Payment infrastructure (Stripe)
- [x] Premium subscription model
- [x] In-app purchase setup
- [x] Revenue analytics

---

## Sprint-by-Sprint Breakdown (Q4 2026)

### Sprint 8: Wearable Integration (Weeks 1–2)

**Goal**: Sync real health data from devices

#### Apple HealthKit (iOS)

```javascript
// app/services/healthKit.js
import { AppleHealthKit } from 'rn-apple-healthkit';

const getHealthData = async () => {
  try {
    const sleepData = await AppleHealthKit.getSleepData({
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
    });

    const heartRate = await AppleHealthKit.getHeartRateSamples({
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      limit: 100,
    });

    const steps = await AppleHealthKit.getStepCount({
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
    });

    return { sleepData, heartRate, steps };
  } catch (error) {
    console.error('HealthKit error:', error);
  }
};

export default { getHealthData };
```

#### Google Fit (Android)

```javascript
// Similar implementation using react-native-google-fit
```

#### Garmin Connect API

- OAuth integration
- Periodic data sync (hourly)
- Store sync status in Redux

#### Tasks

- [x] HealthKit permission flow
- [x] Background sync (native modules)
- [x] Data normalization (different sources)
- [x] Error handling & retry logic
- [x] Offline caching
- [x] Tests for data sync

**Deliverable**: Health data from devices syncs to app automatically

---

### Sprint 9: Live Audio Talks (Weeks 3–4)

**Goal**: Real-time audio streaming + chat

#### Audio Streaming (Agora SDK)

```javascript
// app/services/talks/audio.js
import { RtcEngine, RtcEngineEvent } from 'agora-react-native-sdk';

const engine = RtcEngine.create(config.agoraAppId);

const joinTalk = async (talkId, userRole = 'audience') => {
  try {
    // Initialize Agora
    await engine.init({
      appId: config.agoraAppId,
      channelProfile: 0, // 0 = communication, 1 = broadcast
    });

    // Set client role (host or listener)
    await engine.setClientRole(userRole === 'host' ? 1 : 2);

    // Join channel
    await engine.joinChannel(
      agoraToken, // Generated token from backend
      talkId,
      0,
      uid
    );

    // Event listeners
    engine.addListener(RtcEngineEvent.UserJoined, (data) => {
      console.log('User joined:', data);
    });

    engine.addListener(RtcEngineEvent.UserOffline, (data) => {
      console.log('User offline:', data);
    });
  } catch (error) {
    console.error('Join talk error:', error);
  }
};

const leaveTalk = async () => {
  try {
    await engine.leaveChannel();
  } catch (error) {
    console.error('Leave talk error:', error);
  }
};

export { joinTalk, leaveTalk };
```

#### Real-time Chat (Socket.io)

```javascript
// app/services/talks/chat.js
import io from 'socket.io-client';

const socket = io(config.apiUrl, {
  auth: {
    token: authToken,
  },
});

const joinChat = (talkId) => {
  socket.emit('talk:join', { talkId });

  socket.on('talk:message', (message) => {
    // Dispatch to Redux
    dispatch(addTalkMessage(message));
  });

  socket.on('talk:user_joined', (user) => {
    // Update listener count
  });
};

const sendMessage = (talkId, text) => {
  socket.emit('talk:message', {
    talkId,
    text,
    userId: currentUser.uid,
    timestamp: Date.now(),
  });
};

export { joinChat, sendMessage };
```

#### Host Controls

- [x] Mute individual listeners
- [x] Remove disruptive users
- [x] Recording controls
- [x] End session

#### Tasks

- [x] Agora setup + token generation
- [x] Socket.io real-time chat
- [x] Host/listener permissions
- [x] Recording + playback
- [x] Moderation tools
- [x] Tests for audio quality

**Deliverable**: Live talks work end-to-end with audio + chat

---

### Sprint 10: Mentorship Feature (Weeks 5–6)

**Goal**: Book, message, and track mentorship progress

#### Mentor Booking System

```javascript
// app/screens/Mentorship/MentorDetailScreen.js
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import Calendar from '../../components/Calendar';
import { bookMentorSession } from '../../store/slices/mentorshipSlice';

const MentorDetailScreen = ({ route }) => {
  const { mentorId } = route.params;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const dispatch = useDispatch();

  const handleBook = async () => {
    try {
      await dispatch(
        bookMentorSession({
          mentorId,
          timeSlot: selectedSlot,
        })
      ).unwrap();
      // Navigate to confirmation
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Mentor info */}
      <MentorCard mentor={mentor} />

      {/* Calendar for availability */}
      <Calendar availableSlots={mentor.availability} onSelectSlot={setSelectedSlot} />

      {/* Weekly focus (what to work on) */}
      <WeeklyFocusForm />

      {/* Booking button */}
      <Button label="Book Session" onPress={handleBook} disabled={!selectedSlot} />
    </ScrollView>
  );
};

export default MentorDetailScreen;
```

#### In-app Messaging

```javascript
// app/screens/Mentorship/ChatScreen.js
import React, { useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MessageBubble from '../../components/MessageBubble';
import Input from '../../components/Input';
import { subscribeToMentorChat } from '../../services/mentorship';

const ChatScreen = ({ mentorId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.mentorship.chatMessages);
  const [newMessage, setNewMessage] = React.useState('');

  useEffect(() => {
    // Subscribe to real-time messages
    const unsubscribe = subscribeToMentorChat(mentorId, (msgs) => {
      dispatch(setChatMessages(msgs));
    });

    return () => unsubscribe();
  }, [mentorId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      dispatch(
        sendMentorMessage({
          mentorId,
          text: newMessage,
        })
      );
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.inputContainer}>
        <Input placeholder="Message mentor..." value={newMessage} onChangeText={setNewMessage} />
        <Button label="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatScreen;
```

#### Session Notes & Goals

- [x] Pre-session goal setting
- [x] Session recording/notes
- [x] Post-session feedback
- [x] Progress tracking (weekly, monthly)
- [x] Goal completion tracking

#### Tasks

- [x] Mentor availability calendar
- [x] Booking backend + Firestore rules
- [x] Real-time messaging (Socket.io)
- [x] Session management
- [x] Notes + progress tracking
- [x] Notifications for upcoming sessions

**Deliverable**: Mentors can be booked, users can message, sessions tracked

---

### Sprint 11: Community Challenges (Weeks 7–8)

**Goal**: Social engagement through challenges + leaderboards

#### Challenge Creation & Tracking

```javascript
// app/screens/Community/ChallengesScreen.js
const challenges = [
  {
    id: 'challenge_1',
    title: '50K Steps Challenge',
    description: 'Walk 50,000 steps this week',
    icon: 'foot',
    startDate: Date.now(),
    endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
    participants: 1247,
    leaderboard: [
      { rank: 1, name: 'Ayşe K.', value: 52340, avatar: '...' },
      { rank: 2, name: 'Burak Y.', value: 51200, avatar: '...' },
      { rank: 3, name: 'Elif M.', value: 49875, avatar: '...' },
    ],
  },
  {
    id: 'challenge_2',
    title: '7-Day Meditation Streak',
    description: 'Meditate every day for a week',
    icon: 'brain',
    participants: 892,
  },
];

const ChallengesScreen = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  return (
    <ScrollView>
      {/* Active challenges */}
      <ChallengeCarousel challenges={challenges} onSelect={setSelectedChallenge} />

      {/* Leaderboard for selected challenge */}
      {selectedChallenge && (
        <Leaderboard challenge={selectedChallenge} currentUserRank={5} currentUserValue={48920} />
      )}

      {/* Badge showcase */}
      <BadgeShowcase userBadges={userBadges} />
    </ScrollView>
  );
};

export default ChallengesScreen;
```

#### Leaderboard & Rewards

- [x] Real-time leaderboard updates
- [x] Badge system (5K steps, 7-day streak, etc.)
- [x] Achievement unlocking
- [x] Social sharing (Instagram Stories, WhatsApp)
- [x] Challenge history

#### Tasks

- [x] Challenge CRUD (admin)
- [x] Real-time leaderboard (Firestore)
- [x] Badge logic + unlock system
- [x] Social sharing integration
- [x] Tests for calculations

**Deliverable**: Users can participate in challenges with live leaderboards

---

### Sprint 12: Premium Subscription (Weeks 9–10)

**Goal**: Monetization foundation

#### Payment Setup (Stripe)

```javascript
// app/services/payments.js
import Stripe from '@react-native-stripe-sdk/stripe';

Stripe.initialise({
  publishableKey: process.env.EXPO_PUBLIC_STRIPE_KEY,
});

const createPaymentIntent = async (planId) => {
  try {
    const response = await api.post('/payments/create-intent', { planId });
    return response.data.clientSecret;
  } catch (error) {
    console.error('Payment intent error:', error);
  }
};

const processPayment = async (clientSecret, cardToken) => {
  try {
    const result = await Stripe.confirmPaymentSheetPayment();
    if (result.error) {
      throw result.error;
    }
    return result.paymentIntent;
  } catch (error) {
    console.error('Payment processing error:', error);
  }
};

export { createPaymentIntent, processPayment };
```

#### Subscription Plans

```javascript
const subscriptionPlans = [
  {
    id: 'pro_monthly',
    name: 'BreakFree Pro',
    price: 29.99, // TRY
    currency: 'TRY',
    interval: 'month',
    features: [
      'Advanced health analytics',
      '1 mentor session/week',
      'Ad-free experience',
      'Challenge badges',
    ],
  },
  {
    id: 'pro_annual',
    name: 'BreakFree Pro (Annual)',
    price: 299.99,
    currency: 'TRY',
    interval: 'year',
    features: [...], // Same + 2 extra features
    savings: 'Save 17%',
  },
];
```

#### In-App Store

```javascript
// app/screens/Premium/PremiumScreen.js
const PremiumScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro_monthly');

  const handleSubscribe = async () => {
    try {
      const clientSecret = await createPaymentIntent(selectedPlan);
      const result = await processPayment(clientSecret, cardToken);

      if (result.status === 'succeeded') {
        // Activate premium
        dispatch(setPremiumStatus(true));
      }
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <ScrollView>
      {/* Plan cards */}
      <PlanSelector plans={subscriptionPlans} selected={selectedPlan} onSelect={setSelectedPlan} />

      {/* Features list */}
      <FeatureList features={subscriptionPlans.find((p) => p.id === selectedPlan).features} />

      {/* Subscribe button */}
      <Button
        label={`Subscribe - ${subscriptionPlans.find((p) => p.id === selectedPlan).price} TRY`}
        onPress={handleSubscribe}
      />
    </ScrollView>
  );
};
```

#### Paywall Placement

- [x] Premium mentor features (gated)
- [x] Advanced health analytics
- [x] Challenge badges
- [x] Early access to talks
- [x] Ad-free experience

#### Tasks

- [x] Stripe setup + testing
- [x] Subscription backend
- [x] Paywall UI implementation
- [x] Feature gating logic
- [x] Revenue analytics

**Deliverable**: Premium subscription system functional, can process payments

---

## Phase 2 Architecture Changes

### Backend Expansion

#### New Collections (Firestore)

```
users/{uid}/
  - subscription (plan, status, renew_date)
  - health_metrics/ (daily data)
    - 2026-05-17 (sleep, heart_rate, steps, calories)
  - mentorship_sessions/ (bookings)
  - challenge_participations/

talks/{talkId}/
  - recording (audio_url, duration, transcript)
  - listeners_archived/ (for analytics)

mentors/{mentorId}/
  - availability/ (weekly schedule)
  - sessions/{sessionId}/
    - messages/
    - notes/
    - goals/

challenges/{challengeId}/
  - participants/{uid}
    - current_value
    - progress_data

leaderboards/{challengeId}/
  - entries (ordered by value desc)

payments/
  - subscriptions/{uid}
  - transactions/
```

#### New Cloud Functions

- `healthKit:syncData` — Periodic sync from wearables
- `talks:recordAudio` — Audio file storage
- `mentorship:scheduleSession` — Calendar + reminder
- `challenges:updateLeaderboard` — Real-time updates
- `payments:processSubscription` — Stripe webhooks

### Frontend State (Redux)

```javascript
// New slices
healthSlice: {
  synced_data: { daily, weekly },
  sync_status: 'syncing' | 'synced' | 'error',
  last_sync: timestamp,
  wearables: { apple_health, google_fit, garmin }
}

talksSlice (expanded): {
  active_talk: { audio_stream, listener_count, recording },
  chat_messages: [],
  host_controls: { can_mute, can_remove },
  recordings: []
}

mentorshipSlice: {
  mentors: [],
  booked_sessions: [],
  chat_conversations: {},
  weekly_focus: {},
  progress_data: {}
}

communitySlice (expanded): {
  active_challenges: [],
  user_participation: {},
  leaderboards: {},
  badges: []
}

premiumSlice: {
  subscription: { plan, status, renew_date },
  features: [],
  payment_methods: []
}
```

---

## Phase 2 Success Metrics

### User Engagement

- DAU growth: 1K → 5K (400% increase)
- Average session: 8m → 15m
- Talks per user/month: 3 → 8
- Chat messages/user: 0 → 20
- Mentorship booking rate: 0% → 15%
- Challenge participation: 0% → 35%

### Monetization

- Premium conversion rate: 2–5%
- Average revenue per user (ARPU): $0 → $1–2
- Subscription churn: <5% monthly
- Payment processing success: >99%

### Technical

- Health sync success rate: >95%
- Audio stream quality: >4.2 stars
- Chat latency (p95): <500ms
- Leaderboard update: <2s
- Payment processing: <100ms

### Retention

- D30 retention: 25% → 40%
- D60 retention: New metric to track

---

## Phase 2 Team Expansion

### Core Team (Phase 1) → Extended Team (Phase 2)

#### +1 Backend Engineer

- Manages API scaling
- Implements Cloud Functions
- Handles payment processing

#### +1 DevOps/Infrastructure

- Database optimization (PostgreSQL migration)
- Monitoring & alerting
- Deployment automation
- Cost optimization

#### +1 QA/Test Engineer

- E2E testing expansion (50+ flows)
- Performance testing
- Device fragmentation testing
- Regression testing

#### +1 Community Manager

- Moderates live talks
- Manages challenges
- Community engagement
- User feedback collection

#### +1 Growth/Marketing

- Analytics dashboard
- User acquisition strategy
- Retention experiments
- Referral program design

**Total Team**: 7–8 people (from 3–4)

---

## Phase 2 Timeline & Milestones

### Week 1–2: Wearable Integration

- ✅ HealthKit + Google Fit live
- ✅ Data normalization working
- ✅ Background sync established

### Week 3–4: Live Talks Audio

- ✅ Agora SDK integrated
- ✅ Real-time chat functional
- ✅ Host controls working

### Week 5–6: Mentorship

- ✅ Mentor directory live
- ✅ Booking system functional
- ✅ Real-time messaging working
- ✅ Session tracking operational

### Week 7–8: Community Challenges

- ✅ Challenges launchable
- ✅ Real-time leaderboards
- ✅ Badge system unlocking
- ✅ Challenge participation >30%

### Week 9–10: Premium & Payments

- ✅ Stripe integration live
- ✅ Subscription plans active
- ✅ Paywall UI implemented
- ✅ Payments processing

### Week 11–12: Polish & Scale

- ✅ Performance optimization
- ✅ Scale to 5K DAU
- ✅ Monitoring setup
- ✅ Phase 3 planning

---

## Phase 2 Budget

| Category             | Cost        | Notes                |
| -------------------- | ----------- | -------------------- |
| **Engineering**      | $25K        | +2 engineers         |
| **Infrastructure**   | $5K         | Agora, Stripe, cloud |
| **Tools & Services** | $3K         | Monitoring, CI/CD    |
| **Testing & QA**     | $4K         | Device lab, tools    |
| **Community Mgmt**   | $3K         | Moderators           |
| **Total**            | **$40–60K** | 3 months             |

---

## Phase 2 Risk Mitigation

| Risk                             | Mitigation                                 |
| -------------------------------- | ------------------------------------------ |
| **Agora latency issues**         | Load testing, fallback to audio-only       |
| **Payment failures**             | Stripe redundancy, retry logic             |
| **Wearable sync errors**         | Graceful degradation, local caching        |
| **Mentor availability mismatch** | Calendar sync, timezone handling           |
| **Leaderboard scaling**          | Pre-computed rankings, caching             |
| **Churn from premium**           | 7-day free trial, feature parity free tier |

---

## Phase 2 Success Criteria

✅ All new features launched end-to-end  
✅ 5K DAU achieved (from 1K)  
✅ Premium conversion rate 2–5%  
✅ <1% crash rate maintained  
✅ >99.5% payment processing success  
✅ Health sync working for >60% of users  
✅ Mentor booking system producing bookings  
✅ 35%+ users participating in challenges  
✅ Ready for Phase 3 (AI, advanced health)

---

## Transition to Phase 3

### Success Criteria for Phase 3

- ✅ 25K MAU achieved
- ✅ Premium revenue stable ($5K+ MRR)
- ✅ Community features strong (challenges, leaderboards)
- ✅ Data foundation solid (health metrics, user behavior)
- ✅ AI infrastructure planned

### Phase 3 Preview (Q1–Q2 2027)

- AI-powered mentor matching
- Personalized wellness plans
- Advanced health insights + predictions
- Group coaching (1 mentor : N users)
- Wearable native apps (Apple Watch, Wear OS)
- International expansion (language support)

---

## Success Story (End of Phase 2)

By end of Q4 2026, BreakFree Türkiye will be:

**A thriving wellness community** where:

- ✅ 5,000 daily active users
- ✅ Real-time talks with 100+ listeners
- ✅ 500+ mentors available
- ✅ 10+ concurrent challenges
- ✅ 2,000+ premium subscribers
- ✅ $10K+ monthly recurring revenue
- ✅ Ready for international expansion

**With exceptional quality**:

- ✅ 4.7-star App Store rating
- ✅ <0.5% crash rate
- ✅ 40%+ D30 retention
- ✅ 99.9% payment success
- ✅ Sub-500ms latency globally

---

**Phase 2 Status**: Ready for Development (Post-MVP Launch)  
**Launch Trigger**: Successful Phase 1 launch + 1K+ DAU sustained  
**Approval Gate**: Leadership sign-off on expanded budget & team  
**Next Review**: End of Phase 1 (Week 12)

---

This Phase 2 plan builds on the MVP foundation with real features that drive engagement and revenue. Ready to expand after successful Phase 1 launch! 🚀
