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

const MENTORS = [
  {
    mentorId: 'dr-ayse-demir',
    name: 'Dr. Ayşe Demir',
    title: 'Klinik Psikolog',
    role: 'Wellness · 8 yıl deneyim',
    bio: 'Dr. Ayşe Demir, bütüncül sağlık yaklaşımı ile danışanlarına zihinsel ve fiziksel iyilik halinde rehberlik eden deneyimli bir klinik psikologdur.',
    experience: '8 yıl',
    avatarEmoji: '🌿',
    avatarBg: '#C9961A',
    specialties: ['Anksiyete Yönetimi', 'Uyku Terapisi', 'Farkındalık', 'Stres Azaltma'],
    createdAt: Date.now(),
  },
  {
    mentorId: 'burak-yilmaz',
    name: 'Burak Yılmaz',
    title: 'Wellness Koçu',
    role: 'Hareket · 6 yıl deneyim',
    bio: 'Burak Yılmaz, fonksiyonel antrenman ve hareket bilimi konusunda uzmanlaşmış sertifikalı bir wellness koçudur.',
    experience: '6 yıl',
    avatarEmoji: '🏃',
    avatarBg: '#14B8D6',
    specialties: ['Fonksiyonel Antrenman', 'Koşu', 'Esneklik', 'Postür Düzeltme'],
    createdAt: Date.now(),
  },
];

async function seed() {
  console.log('Seeding mentors collection...');
  for (const mentor of MENTORS) {
    const { mentorId, ...data } = mentor;
    await setDoc(doc(collection(db, 'mentors'), mentorId), data);
    console.log(`  ✓ ${mentor.name}`);
  }
  console.log('Done! Mentors written to Firestore.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
