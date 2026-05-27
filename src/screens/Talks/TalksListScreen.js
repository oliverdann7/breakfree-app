import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchTalks,
  seedTalks,
  joinTalk,
  realtimeTalksUpdate,
} from '../../store/slices/talksSlice';

const categoryEmoji = (cat) =>
  cat === 'Zihin'
    ? '🧘'
    : cat === 'Sağlık'
      ? '💚'
      : cat === 'Hareket'
        ? '🏃'
        : cat === 'Beslenme'
          ? '🥗'
          : '🎧';

export default function TalksListScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const { allTalks, loading } = useAppSelector((state) => state.talks);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (!db) {
      dispatch(fetchTalks());
      return;
    }
    const q = query(collection(db, 'talks'), orderBy('scheduledAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const talks = snap.docs.map((d) => ({ talkId: d.id, ...d.data() }));
      dispatch(realtimeTalksUpdate(talks));
    });
    unsubRef.current = unsub;
    return () => unsub();
  }, [dispatch]);

  const liveTalk = allTalks.find((t) => t.status === 'live');
  const upcoming = allTalks.filter((t) => t.status === 'scheduled');
  const ended = allTalks.filter((t) => t.status === 'ended');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              Palestralar <Text style={styles.headerAccent}>&</Text> sesler
            </Text>
            <Text style={styles.headerSub}>Türkiye&apos;nin en güçlü zihinleri</Text>
          </View>
          {allTalks.length === 0 && !loading && (
            <TouchableOpacity
              onPress={() => dispatch(seedTalks()).then(() => dispatch(fetchTalks()))}
              style={styles.seedBtn}
            >
              <Text style={styles.seedBtnText}>Yükle</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.textTertiary }}>Yükleniyor...</Text>
          </View>
        )}

        {!loading && allTalks.length === 0 && (
          <View style={{ padding: 60, alignItems: 'center' }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🎧</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: 6,
              }}
            >
              Henüz palestra yok
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.textTertiary,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              İlk palestrayı ekleyerek topluluğa öncülük et!
            </Text>
            <TouchableOpacity
              onPress={() => dispatch(seedTalks()).then(() => dispatch(fetchTalks()))}
              style={styles.seedActionBtn}
            >
              <Text style={styles.seedActionBtnText}>Örnek Palestraları Yükle</Text>
            </TouchableOpacity>
          </View>
        )}

        {liveTalk && (
          <Card style={styles.liveCard}>
            <View style={styles.liveHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>Canlı</Text>
              </View>
              <Text style={styles.liveCount}>{liveTalk.listeners} dinleyici</Text>
            </View>
            <Text style={styles.liveTitle}>{liveTalk.title}</Text>
            <View style={styles.liveHosts}>
              <Text style={styles.hostsText}>
                {liveTalk.host.name} · {liveTalk.duration}dk
              </Text>
            </View>
            <TouchableOpacity
              style={styles.liveButton}
              onPress={() => dispatch(joinTalk(liveTalk.talkId))}
            >
              <Text style={styles.liveButtonIcon}>🎧</Text>
              <Text style={styles.liveButtonText}>Şimdi dinle</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {['Tümü', 'Beslenme', 'Zihin', 'Hareket', 'Uyku', 'Bağlantı'].map((cat, i) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, i === 0 && styles.categoryBtnActive]}
            >
              <Text style={[styles.categoryText, i === 0 && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Upcoming Talks */}
        <View style={styles.listSectionWrapper}>
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>Yaklaşanlar</Text>
            </View>
            {upcoming.map((talk) => (
              <TouchableOpacity
                key={talk.talkId}
                style={[styles.talkItem, { borderLeftColor: colors.cyan }]}
                onPress={() => navigation.navigate('TalkDetail', { talkId: talk.talkId })}
              >
                <View style={[styles.talkThumb, { backgroundColor: colors.cyan }]}>
                  <Text style={{ fontSize: 20 }}>{categoryEmoji(talk.category)}</Text>
                </View>
                <View style={styles.talkContent}>
                  <Text style={styles.talkCategory}>{talk.category}</Text>
                  <Text style={styles.talkTitle}>{talk.title}</Text>
                  <Text style={styles.talkMeta}>
                    {talk.host.name} · {talk.duration}dk
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Past Talks */}
        {ended.length > 0 && (
          <View style={styles.listSectionWrapper}>
            <View style={styles.listSection}>
              <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Geçmiş Palestralar</Text>
              </View>
              {ended.map((talk) => (
                <TouchableOpacity
                  key={talk.talkId}
                  style={[styles.talkItem, { borderLeftColor: colors.textTertiary }]}
                  onPress={() => navigation.navigate('TalkDetail', { talkId: talk.talkId })}
                >
                  <View style={[styles.talkThumb, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
                    <Text style={{ fontSize: 20 }}>{categoryEmoji(talk.category)}</Text>
                  </View>
                  <View style={styles.talkContent}>
                    <Text style={styles.talkCategory}>{talk.category}</Text>
                    <Text style={styles.talkTitle}>{talk.title}</Text>
                    <Text style={styles.talkMeta}>
                      {talk.host.name} · {talk.listeners} dinleyici
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerAccent: {
    color: colors.gold,
    fontStyle: 'italic',
  },
  headerSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  searchIcon: {
    fontSize: 18,
  },
  liveCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(230,181,48,0.3)',
    backgroundColor: 'rgba(230,181,48,0.08)',
  },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gold,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bgPrimary,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.bgPrimary,
  },
  liveCount: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 12,
  },
  liveTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  liveAccent: {
    color: colors.gold,
    fontStyle: 'italic',
  },
  liveHosts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  hostAvatar1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.cyan,
    marginRight: -8,
  },
  hostAvatar2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold,
  },
  hostsText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  liveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingVertical: 10,
    gap: 6,
  },
  liveButtonIcon: {
    fontSize: 14,
  },
  liveButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.bgPrimary,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginRight: 8,
  },
  categoryBtnActive: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  categoryTextActive: {
    color: colors.bgPrimary,
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 12,
  },
  featuredCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  featuredThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0B72B9',
  },
  featuredDuration: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  featuredDurationText: {
    fontSize: 9,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 10,
    color: colors.textPrimary,
  },
  featuredContent: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  featuredCategory: {
    fontSize: 8,
    color: colors.cyan,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  featuredTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: 4,
  },
  featuredHost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  hostAvatar3: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gold,
  },
  hostName: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
  },
  listSectionWrapper: {
    backgroundColor: 'rgba(20, 184, 212, 0.03)',
    paddingTop: 20,
    paddingBottom: 8,
  },
  listSection: {
    paddingHorizontal: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  arrow: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  talkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 11,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'rgba(20, 184, 212, 0.06)',
  },
  talkThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  talkContent: {
    flex: 1,
  },
  talkCategory: {
    fontSize: 8,
    color: colors.gold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  talkTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: 2,
  },
  talkMeta: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  plusIcon: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.3)',
  },
});
