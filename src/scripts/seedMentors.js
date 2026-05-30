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

// Weekly availability template (UTC+3 / Europe/Istanbul). Hours that mentor offers.
const weeklyAvail = (slots) => ({
  Mon: slots,
  Tue: slots,
  Wed: slots,
  Thu: slots,
  Fri: slots,
  Sat: [],
  Sun: [],
});

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
    rating: 4.9,
    reviewCount: 127,
    priceTryPerSession: 450,
    availability: weeklyAvail(['18:00', '19:00', '20:00']),
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
    rating: 4.8,
    reviewCount: 89,
    priceTryPerSession: 350,
    availability: weeklyAvail(['07:00', '08:00', '17:00', '18:00']),
    createdAt: Date.now(),
  },
  {
    mentorId: 'elif-kara',
    name: 'Elif Kara',
    title: 'Beslenme Uzmanı',
    role: 'Beslenme · 5 yıl deneyim',
    bio: 'Elif, kanıta dayalı beslenme yaklaşımıyla danışanlarının sürdürülebilir alışkanlıklar kurmasına yardımcı oluyor.',
    experience: '5 yıl',
    avatarEmoji: '🥗',
    avatarBg: '#10B981',
    specialties: ['Sürdürülebilir Beslenme', 'Bitki Bazlı', 'Spor Beslenmesi', 'Sezgisel Yeme'],
    rating: 4.7,
    reviewCount: 64,
    priceTryPerSession: 400,
    availability: weeklyAvail(['12:00', '13:00', '19:00']),
    createdAt: Date.now(),
  },
  {
    mentorId: 'mert-arslan',
    name: 'Mert Arslan',
    title: 'Meditasyon Eğitmeni',
    role: 'Zihin · 7 yıl deneyim',
    bio: 'Mert, mindfulness tabanlı stres azaltma (MBSR) sertifikalı bir eğitmendir. 1500+ rehberli seans tamamlamıştır.',
    experience: '7 yıl',
    avatarEmoji: '🧘',
    avatarBg: '#8B5CF6',
    specialties: ['Mindfulness', 'MBSR', 'Nefes Çalışması', 'Yoga Nidra'],
    rating: 4.9,
    reviewCount: 203,
    priceTryPerSession: 300,
    availability: weeklyAvail(['06:30', '07:30', '21:00', '22:00']),
    createdAt: Date.now(),
  },
  {
    mentorId: 'dr-ceren-akin',
    name: 'Dr. Ceren Akın',
    title: 'Uyku Doktoru',
    role: 'Uyku Tıbbı · 12 yıl deneyim',
    bio: 'Dr. Ceren, uyku apnesi, insomni ve sirkadiyen ritim bozuklukları konusunda uzmanlaşmış bir uyku tıbbı doktorudur.',
    experience: '12 yıl',
    avatarEmoji: '🌙',
    avatarBg: '#3B82F6',
    specialties: ['İnsomni', 'Uyku Hijyeni', 'CBT-I', 'Sirkadiyen Ritim'],
    rating: 5.0,
    reviewCount: 156,
    priceTryPerSession: 650,
    availability: weeklyAvail(['09:00', '10:00', '11:00']),
    createdAt: Date.now(),
  },
  {
    mentorId: 'deniz-tan',
    name: 'Deniz Tan',
    title: 'Performans Koçu',
    role: 'Performans · 9 yıl deneyim',
    bio: 'Deniz, yüksek performans için zaman yönetimi, odak ve dayanıklılık çalışan profesyonellere koçluk yapıyor.',
    experience: '9 yıl',
    avatarEmoji: '🎯',
    avatarBg: '#EF4444',
    specialties: ['Odak', 'Habit Stacking', 'Burnout Önleme', 'Liderlik'],
    rating: 4.8,
    reviewCount: 91,
    priceTryPerSession: 500,
    availability: weeklyAvail(['07:00', '12:00', '20:00']),
    createdAt: Date.now(),
  },
  {
    mentorId: 'kemal-oz',
    name: 'Kemal Öz',
    title: 'Yoga Eğitmeni',
    role: 'Hareket · 10 yıl deneyim',
    bio: 'Kemal, Vinyasa ve Yin yoga konusunda 500h sertifikasyona sahip uluslararası deneyimli bir yoga eğitmenidir.',
    experience: '10 yıl',
    avatarEmoji: '🕉',
    avatarBg: '#F59E0B',
    specialties: ['Vinyasa', 'Yin Yoga', 'Pranayama', 'Esneklik'],
    rating: 4.9,
    reviewCount: 178,
    priceTryPerSession: 280,
    availability: weeklyAvail(['06:00', '18:00', '19:00']),
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
