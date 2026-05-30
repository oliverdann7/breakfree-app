import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchAllMentors } from '../../store/slices/mentorSlice';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

const CATEGORIES = ['Hepsi', 'Zihin', 'Hareket', 'Beslenme', 'Uyku', 'Performans'];

const categoryFor = (mentor) => {
  const text = `${mentor.title || ''} ${mentor.role || ''} ${(mentor.specialties || []).join(' ')}`;
  if (/uyku|insomni|sirkadiyen/i.test(text)) return 'Uyku';
  if (/beslenme|gıda|spor beslenmesi/i.test(text)) return 'Beslenme';
  if (/yoga|antrenman|hareket|koşu|esneklik/i.test(text)) return 'Hareket';
  if (/odak|performans|liderlik|burnout/i.test(text)) return 'Performans';
  return 'Zihin';
};

function MentorCard({ mentor, onOpen }) {
  return (
    <TouchableOpacity onPress={onOpen} activeOpacity={0.85} style={{ marginBottom: 12 }}>
      <Card style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: mentor.avatarBg || colors.royal }]}>
          <Text style={styles.avatarEmoji}>{mentor.avatarEmoji || '🧘'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.name}>{mentor.name}</Text>
            {mentor.rating != null && (
              <Text style={styles.rating}>
                ★ {mentor.rating.toFixed(1)}{' '}
                <Text style={styles.reviewCount}>({mentor.reviewCount || 0})</Text>
              </Text>
            )}
          </View>
          <Text style={styles.title}>{mentor.title}</Text>
          <View style={styles.specRow}>
            {(mentor.specialties || []).slice(0, 2).map((s) => (
              <View key={s} style={styles.specChip}>
                <Text style={styles.specText}>{s}</Text>
              </View>
            ))}
          </View>
          {mentor.priceTryPerSession && (
            <Text style={styles.price}>₺{mentor.priceTryPerSession} / seans</Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function MentorDirectoryScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { allMentors } = useAppSelector((s) => s.mentor);
  const [category, setCategory] = useState('Hepsi');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAllMentors());
  }, [dispatch]);

  const filtered = useMemo(() => {
    return (allMentors || []).filter((m) => {
      if (category !== 'Hepsi' && categoryFor(m) !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${m.name} ${m.title} ${(m.specialties || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allMentors, category, search]);

  const openMentor = (mentor) => {
    if (navigation?.navigate) navigation.navigate('MentorDetail', { mentorId: mentor.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={styles.header}>
          {navigation && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.heading}>Mentörler</Text>
            <Text style={styles.sub}>{filtered.length} mentör · 1-on-1 wellness rehberliği</Text>
          </View>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Mentör veya uzmanlık ara..."
          placeholderTextColor="rgba(255,255,255,0.3)"
          style={styles.search}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[styles.cat, category === c && styles.catActive]}
              >
                <Text style={[styles.catText, category === c && styles.catTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        renderItem={({ item }) => <MentorCard mentor={item} onOpen={() => openMentor(item)} />}
        ListEmptyComponent={<Text style={styles.empty}>Bu filtreyle mentör bulunamadı.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  back: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: colors.textPrimary, fontSize: 18 },
  heading: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  sub: { color: colors.textTertiary, fontSize: 11, marginTop: 2 },
  search: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 13,
  },
  cat: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  catActive: { backgroundColor: colors.cyan },
  catText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  catTextActive: { color: colors.navy },

  card: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  avatarEmoji: { fontSize: 26 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: colors.textPrimary, fontWeight: '700', fontSize: 14, flex: 1 },
  rating: { color: colors.gold, fontWeight: '700', fontSize: 12 },
  reviewCount: { color: colors.textTertiary, fontSize: 10, fontWeight: '500' },
  title: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  specRow: { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  specChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(20,184,212,0.1)',
  },
  specText: { color: colors.cyan, fontSize: 10, fontWeight: '600' },
  price: { color: colors.gold, fontWeight: '700', fontSize: 12, marginTop: 8 },
  empty: { color: colors.textTertiary, textAlign: 'center', marginTop: 40, fontSize: 13 },
});
