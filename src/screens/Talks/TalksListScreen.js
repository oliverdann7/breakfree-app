import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTalks } from '../../store/slices/talksSlice';
import TalkCard from '../../components/features/TalkCard';
import { colors } from '../../constants/designTokens';

const CATEGORIES = ['Tümü', 'Zihin', 'Sağlık', 'Hareket', 'Beslenme'];

export default function TalksListScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { allTalks, loading } = useAppSelector((state) => state.talks);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  useEffect(() => {
    dispatch(fetchTalks());
  }, []);

  const filtered = allTalks.filter((t) => {
    const matchesCategory = activeCategory === 'Tümü' || t.category === activeCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.host.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const liveTalk = allTalks.find((t) => t.status === 'live');

  const ListHeader = () => (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Palestralar</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Talk veya konuşmacı ara..."
          placeholderTextColor={colors.textTertiary}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Live Banner */}
      {liveTalk && (
        <TouchableOpacity
          style={styles.liveBanner}
          onPress={() => navigation.navigate('TalkDetail', { talkId: liveTalk.talkId })}
          activeOpacity={0.85}
        >
          <View style={styles.livePulse}>
            <View style={styles.liveDot} />
          </View>
          <View style={styles.liveBannerInfo}>
            <Text style={styles.liveBannerLabel}>ŞU AN CANLI</Text>
            <Text style={styles.liveBannerTitle} numberOfLines={1}>{liveTalk.title}</Text>
            <Text style={styles.liveBannerHost}>{liveTalk.host.name}</Text>
          </View>
          <View style={styles.joinPill}>
            <Text style={styles.joinPillText}>Katıl</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Categories */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={(item) => item}
        style={styles.categories}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chip, activeCategory === item && styles.chipActive]}
            onPress={() => setActiveCategory(item)}
          >
            <Text style={[styles.chipText, activeCategory === item && styles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.talkId}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 10 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }) => (
          <TalkCard
            talk={item}
            onPress={() => navigation.navigate('TalkDetail', { talkId: item.talkId })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sonuç bulunamadı.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  headerRow: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  screenTitle: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: 14 },
  clearBtn: { color: colors.textTertiary, fontSize: 14, paddingHorizontal: 4 },
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    marginBottom: 12,
    gap: 12,
  },
  livePulse: { alignItems: 'center', justifyContent: 'center' },
  liveDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
  },
  liveBannerInfo: { flex: 1 },
  liveBannerLabel: { fontSize: 10, color: colors.error, fontWeight: '700', letterSpacing: 1 },
  liveBannerTitle: { fontSize: 14, color: colors.textPrimary, fontWeight: '600', marginVertical: 1 },
  liveBannerHost: { fontSize: 12, color: colors.textTertiary },
  joinPill: {
    backgroundColor: colors.error,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  joinPillText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  categories: { maxHeight: 44, marginBottom: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.cyan, borderColor: colors.cyan },
  chipText: { fontSize: 13, color: colors.textSecondary },
  chipTextActive: { color: colors.navy, fontWeight: '600' },
  emptyText: { textAlign: 'center', color: colors.textTertiary, marginTop: 40 },
});
