import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchVideos, setActiveCategory } from '../../store/slices/videosSlice';
import VideoCard from '../../components/features/VideoCard';
import { colors } from '../../constants/designTokens';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

const CATEGORIES = ['Tümü', 'Zihin', 'Sağlık', 'Beslenme', 'Hareket', 'Uyku'];

export default function VideoFeedScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { allVideos, loading, activeCategory, progress } = useAppSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchVideos());
  }, []);

  const filtered =
    activeCategory === 'Tümü' ? allVideos : allVideos.filter((v) => v.category === activeCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>İzle & Öğren</Text>
          <Text style={styles.headerTitle}>
            Video <Text style={styles.headerAccent}>kütüphanesi</Text>
          </Text>
        </View>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
              onPress={() => dispatch(setActiveCategory(cat))}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Grid */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.cyan} size="large" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>🎬</Text>
            <Text style={styles.emptyText}>Bu kategoride henüz video yok.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((video) => (
              <View key={video.videoId} style={{ width: CARD_WIDTH }}>
                <VideoCard
                  video={video}
                  progress={progress[video.videoId]}
                  onPress={() =>
                    navigation.navigate('VideoPlayer', { videoId: video.videoId, video })
                  }
                />
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  headerAccent: { color: colors.gold, fontStyle: 'italic' },
  categories: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  catChipActive: {
    backgroundColor: colors.cyan,
    borderColor: colors.cyan,
  },
  catText: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  catTextActive: { color: colors.navy, fontWeight: '700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyBox: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 14, color: 'rgba(255,255,255,0.35)' },
});
