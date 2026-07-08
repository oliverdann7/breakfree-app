/**
 * One-shot seed script to populate the `videos` Firestore collection.
 * Run once after setting up your Firebase project:
 *
 *   node src/scripts/seedVideos.js
 *
 * Requires .env.local to be configured with EXPO_PUBLIC_FIREBASE_* vars.
 * Uses dotenv to load them. Install if needed: npm install dotenv
 *
 * Mirrors the MOCK_VIDEOS dev fallback in src/store/slices/videosSlice.js so
 * a real backend serves the same catalogue the dev feed shows. Each video
 * declares a provider-agnostic `source` + `sourceId` (see utils/videoSource.js);
 * `isPremium: false` marks a free taste, everything else is Pro-gated.
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
const DAY = 86400000;

const VIDEOS = [
  {
    videoId: 'v1',
    title: 'Anksiyeteyi Yenmek: Bilimsel Yaklaşım',
    description: 'Dr. Ayşe Demir ile günlük anksiyete yönetimi üzerine kapsamlı bir rehber.',
    hostName: 'Dr. Ayşe Demir',
    category: 'Zihin',
    source: 'youtube',
    sourceId: 'inpok4MKVLM',
    durationSeconds: 1842,
    publishedAt: now - DAY * 3,
    isPremium: false,
    tags: ['anksiyete', 'stres', 'zihin'],
  },
  {
    videoId: 'v2',
    title: 'Sabah Rutini: Enerjik Başlangıç',
    description: 'Güne mükemmel başlamanı sağlayacak 7 adımlı sabah rutini.',
    hostName: 'Burak Yılmaz',
    category: 'Sağlık',
    source: 'youtube',
    sourceId: 'ZToicYcHIOU',
    durationSeconds: 1260,
    publishedAt: now - DAY * 7,
    isPremium: true,
    tags: ['sabah', 'rutin', 'enerji'],
  },
  {
    videoId: 'v3',
    title: 'Meditasyon Temelleri',
    description: 'Yeni başlayanlar için adım adım meditasyon rehberi.',
    hostName: 'Selin Arslan',
    category: 'Zihin',
    source: 'mux',
    sourceId: null,
    durationSeconds: 2100,
    publishedAt: now - DAY * 14,
    isPremium: true,
    tags: ['meditasyon', 'mindfulness', 'nefes'],
  },
  {
    videoId: 'v4',
    title: 'Beslenme ve Enerji Yönetimi',
    description: 'Doğru beslenmeyle gün boyu enerjik kalmanın bilimsel sırları.',
    hostName: 'Prof. Mert Kaya',
    category: 'Beslenme',
    source: 'mux',
    sourceId: null,
    durationSeconds: 2760,
    publishedAt: now - DAY * 21,
    isPremium: true,
    tags: ['beslenme', 'enerji', 'sağlık'],
  },
];

async function seed() {
  console.log('Seeding videos collection...');
  for (const video of VIDEOS) {
    const { videoId, ...data } = video;
    await setDoc(doc(collection(db, 'videos'), videoId), data);
    console.log(`  ✓ ${video.title}`);
  }
  console.log(`Done! ${VIDEOS.length} videos written to Firestore.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
