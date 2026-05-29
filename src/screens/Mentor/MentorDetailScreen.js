import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMentorProfile } from '../../store/slices/mentorSlice';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

const DAY_LABELS = {
  Mon: 'Pzt',
  Tue: 'Sal',
  Wed: 'Çar',
  Thu: 'Per',
  Fri: 'Cum',
  Sat: 'Cmt',
  Sun: 'Paz',
};

function buildSlots(availability) {
  if (!availability) return [];
  const today = new Date();
  const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const next7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = dayKeys[d.getDay()];
    const hours = availability[key] || [];
    if (hours.length === 0) continue;
    next7.push({
      key,
      label: i === 0 ? 'Bugün' : i === 1 ? 'Yarın' : DAY_LABELS[key],
      date: d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
      iso: d.toISOString().slice(0, 10),
      hours,
    });
  }
  return next7;
}

export default function MentorDetailScreen({ navigation, route }) {
  const mentorId = route?.params?.mentorId;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { allMentors, mentorProfile } = useAppSelector((s) => s.mentor);

  const mentor =
    allMentors.find((m) => m.id === mentorId) ||
    (mentorProfile && mentorProfile.id === mentorId ? mentorProfile : null);

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (mentorId && !mentor) dispatch(fetchMentorProfile(mentorId));
  }, [mentorId, mentor, dispatch]);

  if (!mentor) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  const slots = buildSlots(mentor.availability);

  const handleBook = async () => {
    if (!user?.uid || !selectedDay || !selectedHour) return;
    setBooking(true);
    try {
      if (db) {
        await addDoc(collection(db, 'mentors', mentor.id, 'sessions'), {
          uid: user.uid,
          mentorId: mentor.id,
          mentorName: mentor.name,
          scheduledFor: `${selectedDay}T${selectedHour}:00+03:00`,
          duration: 30,
          status: 'pending',
          createdAt: Date.now(),
        });
      }
      Alert.alert('Seans rezerve edildi', `${selectedDay} ${selectedHour} için onay bekliyor.`);
      setSelectedDay(null);
      setSelectedHour(null);
    } catch (err) {
      Alert.alert('Hata', err.message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          {navigation && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.hero}>
          <View style={[styles.avatar, { backgroundColor: mentor.avatarBg }]}>
            <Text style={styles.avatarEmoji}>{mentor.avatarEmoji}</Text>
          </View>
          <Text style={styles.name}>{mentor.name}</Text>
          <Text style={styles.title}>{mentor.title}</Text>
          {mentor.rating != null && (
            <Text style={styles.rating}>
              ★ {mentor.rating.toFixed(1)} · {mentor.reviewCount} değerlendirme
            </Text>
          )}
        </View>

        <View style={{ paddingHorizontal: 16, gap: 14 }}>
          <Card>
            <Text style={styles.sectionTitle}>Hakkında</Text>
            <Text style={styles.bio}>{mentor.bio}</Text>
            {mentor.experience && <Text style={styles.meta}>{mentor.experience} deneyim</Text>}
          </Card>

          {mentor.specialties?.length > 0 && (
            <Card>
              <Text style={styles.sectionTitle}>Uzmanlık</Text>
              <View style={styles.specRow}>
                {mentor.specialties.map((s) => (
                  <View key={s} style={styles.specChip}>
                    <Text style={styles.specText}>{s}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          <Card>
            <Text style={styles.sectionTitle}>Müsait Zamanlar</Text>
            {slots.length === 0 ? (
              <Text style={styles.meta}>Şu anda müsait zaman yok.</Text>
            ) : (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingVertical: 6 }}
                >
                  {slots.map((s) => (
                    <TouchableOpacity
                      key={s.iso}
                      onPress={() => {
                        setSelectedDay(s.iso);
                        setSelectedHour(null);
                      }}
                      style={[styles.dayPill, selectedDay === s.iso && styles.dayPillActive]}
                    >
                      <Text style={styles.dayLabel}>{s.label}</Text>
                      <Text style={styles.dayDate}>{s.date}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {selectedDay && (
                  <View style={styles.hours}>
                    {slots
                      .find((s) => s.iso === selectedDay)
                      ?.hours.map((h) => (
                        <TouchableOpacity
                          key={h}
                          onPress={() => setSelectedHour(h)}
                          style={[styles.hourBtn, selectedHour === h && styles.hourBtnActive]}
                        >
                          <Text
                            style={[styles.hourText, selectedHour === h && styles.hourTextActive]}
                          >
                            {h}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </>
            )}
          </Card>

          <TouchableOpacity
            onPress={handleBook}
            disabled={!selectedDay || !selectedHour || booking}
            style={[styles.cta, (!selectedDay || !selectedHour || booking) && { opacity: 0.4 }]}
          >
            <Text style={styles.ctaText}>
              {booking
                ? 'Rezerve ediliyor...'
                : mentor.priceTryPerSession
                  ? `₺${mentor.priceTryPerSession} · Seans Rezerve Et`
                  : 'Seans Rezerve Et'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  loading: { color: colors.textSecondary, textAlign: 'center', marginTop: 60 },
  header: { padding: 16 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: colors.textPrimary, fontSize: 18 },
  hero: { alignItems: 'center', paddingVertical: 16, gap: 6 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.gold,
    marginBottom: 8,
  },
  avatarEmoji: { fontSize: 42 },
  name: { color: colors.textPrimary, fontWeight: '700', fontSize: 20 },
  title: { color: colors.textSecondary, fontSize: 13 },
  rating: { color: colors.gold, fontSize: 12, marginTop: 4 },

  sectionTitle: { color: colors.textPrimary, fontWeight: '700', fontSize: 14, marginBottom: 8 },
  bio: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
  meta: { color: colors.textTertiary, fontSize: 11, marginTop: 6 },

  specRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  specChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(20,184,212,0.1)',
  },
  specText: { color: colors.cyan, fontSize: 11, fontWeight: '600' },

  dayPill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    minWidth: 64,
  },
  dayPillActive: { backgroundColor: colors.cyan },
  dayLabel: { color: colors.textPrimary, fontSize: 12, fontWeight: '700' },
  dayDate: { color: colors.textTertiary, fontSize: 10, marginTop: 2 },

  hours: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  hourBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  hourBtnActive: { backgroundColor: colors.gold },
  hourText: { color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  hourTextActive: { color: colors.navy },

  cta: {
    backgroundColor: colors.cyan,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaText: { color: colors.navy, fontWeight: '800', fontSize: 14 },
});
