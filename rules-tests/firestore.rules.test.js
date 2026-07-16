const { readFileSync } = require('fs');
const path = require('path');
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, updateDoc, deleteDoc, increment } = require('firebase/firestore');

const ALICE = 'alice-uid';
const BOB = 'bob-uid';

let testEnv;

// db(ALICE) → Firestore as alice; db() → unauthenticated.
function db(uid, claims) {
  return uid
    ? testEnv.authenticatedContext(uid, claims).firestore()
    : testEnv.unauthenticatedContext().firestore();
}

// Write fixture docs with rules disabled.
async function seed(docPath, data) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), docPath), data);
  });
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'breakfree-rules-test',
    firestore: {
      rules: readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8'),
    },
  });
});

afterAll(() => testEnv.cleanup());
beforeEach(() => testEnv.clearFirestore());

describe('posts', () => {
  const valid = { authorUid: ALICE, text: 'Merhaba topluluk!', likes: 0, createdAt: 1 };

  it('signed-in author can create a valid post', async () => {
    await assertSucceeds(setDoc(doc(db(ALICE), 'posts/p1'), valid));
  });

  it('rejects posts forged under another authorUid', async () => {
    await assertFails(setDoc(doc(db(BOB), 'posts/p1'), valid));
  });

  it('rejects empty text', async () => {
    await assertFails(setDoc(doc(db(ALICE), 'posts/p1'), { ...valid, text: '' }));
  });

  it('rejects text over 2000 chars', async () => {
    await assertFails(setDoc(doc(db(ALICE), 'posts/p1'), { ...valid, text: 'x'.repeat(2001) }));
  });

  it('rejects posts born with nonzero likes', async () => {
    await assertFails(setDoc(doc(db(ALICE), 'posts/p1'), { ...valid, likes: 500 }));
  });

  it('unauthenticated users cannot read posts', async () => {
    await seed('posts/p1', valid);
    await assertFails(getDoc(doc(db(), 'posts/p1')));
  });

  it('any signed-in user can bump likes by exactly one', async () => {
    await seed('posts/p1', valid);
    await assertSucceeds(updateDoc(doc(db(BOB), 'posts/p1'), { likes: increment(1) }));
  });

  it('rejects like bumps larger than one', async () => {
    await seed('posts/p1', valid);
    await assertFails(updateDoc(doc(db(BOB), 'posts/p1'), { likes: increment(50) }));
  });

  it('non-authors cannot edit post text', async () => {
    await seed('posts/p1', valid);
    await assertFails(updateDoc(doc(db(BOB), 'posts/p1'), { text: 'hacked' }));
  });

  it('author can edit their own text within bounds', async () => {
    await seed('posts/p1', valid);
    await assertSucceeds(updateDoc(doc(db(ALICE), 'posts/p1'), { text: 'düzenlendi' }));
  });

  it('only the author can delete a post', async () => {
    await seed('posts/p1', valid);
    await assertFails(deleteDoc(doc(db(BOB), 'posts/p1')));
    await assertSucceeds(deleteDoc(doc(db(ALICE), 'posts/p1')));
  });
});

describe('post comments', () => {
  const post = { authorUid: BOB, text: 'post', likes: 0 };

  it('signed-in user can comment under their own uid', async () => {
    await seed('posts/p1', post);
    await assertSucceeds(
      setDoc(doc(db(ALICE), 'posts/p1/comments/c1'), {
        authorUid: ALICE,
        text: 'Harika!',
        createdAt: 1,
      })
    );
  });

  it('rejects comments over 1000 chars', async () => {
    await seed('posts/p1', post);
    await assertFails(
      setDoc(doc(db(ALICE), 'posts/p1/comments/c1'), {
        authorUid: ALICE,
        text: 'x'.repeat(1001),
      })
    );
  });
});

describe('talks', () => {
  it('signed-in user can create a talk with a valid status', async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), 'talks/t1'), { title: 'Uyku 101', status: 'scheduled', listeners: 0 })
    );
  });

  it('rejects unknown status values', async () => {
    await assertFails(
      setDoc(doc(db(ALICE), 'talks/t1'), { title: 'Uyku 101', status: 'banana', listeners: 0 })
    );
  });

  it('rejects titles over 200 chars', async () => {
    await assertFails(setDoc(doc(db(ALICE), 'talks/t1'), { title: 'x'.repeat(201) }));
  });

  it('listeners can be bumped by one, not more', async () => {
    await seed('talks/t1', { title: 'Canlı', status: 'live', listeners: 3 });
    await assertSucceeds(updateDoc(doc(db(BOB), 'talks/t1'), { listeners: increment(1) }));
    await assertFails(updateDoc(doc(db(BOB), 'talks/t1'), { listeners: increment(10) }));
  });

  it('non-admins cannot edit other talk fields or delete', async () => {
    await seed('talks/t1', { title: 'Canlı', status: 'live', listeners: 3 });
    await assertFails(updateDoc(doc(db(BOB), 'talks/t1'), { title: 'defaced' }));
    await assertFails(deleteDoc(doc(db(BOB), 'talks/t1')));
  });

  it('admins can edit and delete talks', async () => {
    await seed('talks/t1', { title: 'Canlı', status: 'live', listeners: 3 });
    const admin = db('admin-uid', { isAdmin: true });
    await assertSucceeds(updateDoc(doc(admin, 'talks/t1'), { title: 'güncellendi' }));
    await assertSucceeds(deleteDoc(doc(admin, 'talks/t1')));
  });
});

describe('liked_posts', () => {
  it('user can record and remove their own like', async () => {
    const ref = doc(db(ALICE), `liked_posts/${ALICE}_p1`);
    await assertSucceeds(setDoc(ref, { uid: ALICE, postId: 'p1', createdAt: 1 }));
    await assertSucceeds(deleteDoc(ref));
  });

  it('cannot record a like under someone else’s uid', async () => {
    await assertFails(
      setDoc(doc(db(BOB), `liked_posts/${ALICE}_p1`), { uid: ALICE, postId: 'p1' })
    );
  });
});

describe('videos (read-only catalog)', () => {
  it('signed-in users read, nobody but admin writes', async () => {
    await seed('videos/v1', { title: 'Nefes', publishedAt: 1 });
    await assertSucceeds(getDoc(doc(db(ALICE), 'videos/v1')));
    await assertFails(getDoc(doc(db(), 'videos/v1')));
    await assertFails(setDoc(doc(db(ALICE), 'videos/v2'), { title: 'spam' }));
    await assertSucceeds(
      setDoc(doc(db('admin-uid', { isAdmin: true }), 'videos/v2'), { title: 'yeni' })
    );
  });
});

describe('users/watched_videos (watch progress)', () => {
  const progress = { progressSeconds: 120, durationSeconds: 1842, watchedAt: 1 };

  it('owner can save and read their own progress', async () => {
    await assertSucceeds(setDoc(doc(db(ALICE), `users/${ALICE}/watched_videos/v1`), progress));
    await assertSucceeds(getDoc(doc(db(ALICE), `users/${ALICE}/watched_videos/v1`)));
  });

  it('other users cannot read or write someone else’s progress', async () => {
    await seed(`users/${ALICE}/watched_videos/v1`, progress);
    await assertFails(getDoc(doc(db(BOB), `users/${ALICE}/watched_videos/v1`)));
    await assertFails(setDoc(doc(db(BOB), `users/${ALICE}/watched_videos/v1`), progress));
  });

  it('rejects negative or non-numeric progress', async () => {
    await assertFails(
      setDoc(doc(db(ALICE), `users/${ALICE}/watched_videos/v1`), {
        ...progress,
        progressSeconds: -5,
      })
    );
    await assertFails(
      setDoc(doc(db(ALICE), `users/${ALICE}/watched_videos/v1`), {
        ...progress,
        progressSeconds: 'çok',
      })
    );
  });
});

describe('mentors and session bookings', () => {
  it('mentor docs are read-only for clients', async () => {
    await seed('mentors/m1', { name: 'Dr. Ayşe' });
    await assertSucceeds(getDoc(doc(db(ALICE), 'mentors/m1')));
    await assertFails(setDoc(doc(db(ALICE), 'mentors/m2'), { name: 'sahte mentor' }));
  });

  it('user can book a pending session for themselves', async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), 'mentors/m1/sessions/s1'), {
        uid: ALICE,
        mentorId: 'm1',
        scheduledFor: '2026-07-14T19:00:00+03:00',
        duration: 30,
        status: 'pending',
      })
    );
  });

  it('cannot book for another user or skip pending', async () => {
    const booking = { uid: BOB, mentorId: 'm1', duration: 30, status: 'pending' };
    await assertFails(setDoc(doc(db(ALICE), 'mentors/m1/sessions/s1'), booking));
    await assertFails(
      setDoc(doc(db(ALICE), 'mentors/m1/sessions/s2'), {
        ...booking,
        uid: ALICE,
        status: 'confirmed',
      })
    );
  });
});

describe('mentor_assignments', () => {
  it('owner reads/writes their assignment; others cannot', async () => {
    const data = { uid: ALICE, focusTitle: 'Uyku', createdAt: 1 };
    await assertSucceeds(setDoc(doc(db(ALICE), `mentor_assignments/${ALICE}`), data));
    await assertFails(setDoc(doc(db(BOB), `mentor_assignments/${ALICE}`), data));
    await assertFails(getDoc(doc(db(BOB), `mentor_assignments/${ALICE}`)));
  });
});

describe('daily_plans', () => {
  it('plans are scoped by uid prefix in the doc id', async () => {
    await assertSucceeds(setDoc(doc(db(ALICE), `daily_plans/${ALICE}_2026-07-11`), { tasks: [] }));
    await assertFails(setDoc(doc(db(BOB), `daily_plans/${ALICE}_2026-07-11`), { tasks: [] }));
    await assertFails(getDoc(doc(db(BOB), `daily_plans/${ALICE}_2026-07-11`)));
  });
});

describe('challenges', () => {
  it('participantCount bumps by one only; content is admin-only', async () => {
    await seed('challenges/c1', { title: '10k adım', participantCount: 5, endDate: 9 });
    await assertSucceeds(
      updateDoc(doc(db(ALICE), 'challenges/c1'), { participantCount: increment(1) })
    );
    await assertFails(
      updateDoc(doc(db(ALICE), 'challenges/c1'), { participantCount: increment(100) })
    );
    await assertFails(updateDoc(doc(db(ALICE), 'challenges/c1'), { title: 'defaced' }));
    await assertFails(setDoc(doc(db(ALICE), 'challenges/c2'), { title: 'sahte' }));
  });
});

describe('challenge_participants', () => {
  it('user joins for themselves starting at zero progress', async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), `challenge_participants/c1_${ALICE}`), {
        uid: ALICE,
        challengeId: 'c1',
        joinedAt: 1,
        currentProgress: 0,
      })
    );
  });

  it('rejects forged uid or pre-filled progress', async () => {
    await assertFails(
      setDoc(doc(db(BOB), `challenge_participants/c1_${ALICE}`), {
        uid: ALICE,
        challengeId: 'c1',
        currentProgress: 0,
      })
    );
    await assertFails(
      setDoc(doc(db(ALICE), `challenge_participants/c2_${ALICE}`), {
        uid: ALICE,
        challengeId: 'c2',
        currentProgress: 9999,
      })
    );
  });
});

describe('leaderboards', () => {
  it('readable when signed in, never client-writable', async () => {
    await seed('leaderboards/c1', { entries: [] });
    await assertSucceeds(getDoc(doc(db(ALICE), 'leaderboards/c1')));
    await assertFails(setDoc(doc(db(ALICE), 'leaderboards/c1'), { entries: ['x'] }));
  });
});

describe('user_status', () => {
  it('anyone signed-in reads, only the owner writes', async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), `user_status/${ALICE}`), { uid: ALICE, wellnessScore: 80 })
    );
    await assertSucceeds(getDoc(doc(db(BOB), `user_status/${ALICE}`)));
    await assertFails(
      setDoc(doc(db(BOB), `user_status/${ALICE}`), { uid: ALICE, wellnessScore: 0 })
    );
  });
});

describe('write-only drop boxes', () => {
  it('feedback: signed-in create within bounds, no reads', async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), 'feedback/f1'), { uid: ALICE, type: 'idea', message: 'Harika app' })
    );
    await assertFails(setDoc(doc(db(ALICE), 'feedback/f2'), { message: 'x'.repeat(2001) }));
    await assertFails(getDoc(doc(db(ALICE), 'feedback/f1')));
  });

  it('error_logs: signed-in create, no reads', async () => {
    await assertSucceeds(
      setDoc(doc(db(ALICE), 'error_logs/e1'), { message: 'TypeError: boom', name: 'TypeError' })
    );
    await assertFails(getDoc(doc(db(ALICE), 'error_logs/e1')));
  });
});

describe('users/subscription', () => {
  it('subscription is readable but never client-writable (no self-granted Pro)', async () => {
    await seed(`users/${ALICE}/subscription/current`, { plan: 'pro', status: 'active' });
    await assertSucceeds(getDoc(doc(db(ALICE), `users/${ALICE}/subscription/current`)));
    await assertFails(
      setDoc(doc(db(ALICE), `users/${ALICE}/subscription/current`), {
        plan: 'pro',
        status: 'active',
      })
    );
  });

  it('daily_metrics are owner-scoped by uid field', async () => {
    await seed('daily_metrics/d1', { uid: ALICE, date: '2026-07-11', steps: 1000 });
    await assertSucceeds(getDoc(doc(db(ALICE), 'daily_metrics/d1')));
    await assertFails(getDoc(doc(db(BOB), 'daily_metrics/d1')));
    await assertFails(setDoc(doc(db(BOB), 'daily_metrics/d2'), { uid: ALICE, date: '2026-07-11' }));
  });
});
