/**
 * One-shot seed script to populate the `talks` Firestore collection.
 * Run once after setting up your Firebase project:
 *
 *   node src/scripts/seedTalks.js
 *
 * Requires .env.local to be configured with EXPO_PUBLIC_FIREBASE_* vars.
 * Uses dotenv to load them. Install if needed: npm install dotenv
 */

require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const now = Date.now();

const TALKS = [
  {
    talkId: 'talk1',
    title: 'Anksiyeteyi Anlamak',
    description: 'Dr. Ayşe Demir, günlük hayatta anksiyeteyle başa çıkma yollarını anlatıyor.',
    host: { uid: 'host1', name: 'Dr. Ayşe Demir', avatar: null },
    category: 'Zihin',
    status: 'scheduled',
    scheduledAt: now + 3600000,
    duration: 30,
    imageUrl: null,
    listeners: 0,
  },
  {
    talkId: 'talk2',
    title: 'Sabah Rutininin Gücü',
    description: 'Sağlıklı bir sabah rutini nasıl oluşturulur? Uzmanımız tüm sırları paylaşıyor.',
    host: { uid: 'host2', name: 'Burak Yılmaz', avatar: null },
    category: 'Sağlık',
    status: 'live',
    scheduledAt: now - 600000,
    duration: 45,
    imageUrl: null,
    listeners: 24,
  },
  {
    talkId: 'talk3',
    title: 'Koşu ile Meditasyon',
    description: "Hareket ve zihin sağlığını birleştiren bu talk'ta koşuyu meditasyona dönüştürün.",
    host: { uid: 'host3', name: 'Selin Arslan', avatar: null },
    category: 'Hareket',
    status: 'ended',
    scheduledAt: now - 7200000,
    duration: 60,
    imageUrl: null,
    listeners: 112,
  },
  {
    talkId: 'talk4',
    title: 'Beslenme ve Enerji',
    description: 'Doğru beslenme ile gün boyu enerjik kalmanın bilimsel yolu.',
    host: { uid: 'host4', name: 'Prof. Mert Kaya', avatar: null },
    category: 'Beslenme',
    status: 'scheduled',
    scheduledAt: now + 86400000,
    duration: 50,
    imageUrl: null,
    listeners: 0,
  },
];

async function seed() {
  console.log('Seeding talks collection...');
  for (const talk of TALKS) {
    await setDoc(doc(collection(db, 'talks'), talk.talkId), talk);
    console.log(`  ✓ ${talk.title}`);
  }
  console.log('Done! 4 talks written to Firestore.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
