import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

const MOCK_POSTS = [
  {
    postId: 'p1',
    userId: 'u1',
    userName: 'Burak Yılmaz',
    avatar: 'B',
    text: "Sabah 06:30'da 10K koşuyu bitirdim! Haftaya yarışmaya hazırım 💪🏃",
    stats: { distance: '10.2 km', duration: '48:32', avgHeartRate: 142 },
    likes: 47,
    comments: 12,
    liked: false,
    time: '2 saat önce',
  },
  {
    postId: 'p2',
    userId: 'u2',
    userName: 'Elif Kaya',
    avatar: 'E',
    text: "Dr. Ayşe'nin anksiyete talk'ı muhteşemdi. Günlük farkındalık egzersizlerini hayatıma katmaya başladım 🧘‍♀️",
    stats: null,
    likes: 32,
    comments: 8,
    liked: true,
    time: '4 saat önce',
  },
  {
    postId: 'p3',
    userId: 'u3',
    userName: 'Mert Arslan',
    avatar: 'M',
    text: '30 günlük beslenme meydan okuması tamamlandı! -4 kg ve çok daha enerjik hissediyorum 🎯',
    stats: null,
    likes: 89,
    comments: 24,
    liked: false,
    time: '1 gün önce',
  },
];

const MOCK_EVENT = {
  title: 'Belgrad Ormanı Şafak Yürüyüşü',
  date: '25 Mayıs, Cumartesi 06:30',
  location: 'Belgrad Ormanı, İstanbul',
  rsvpCount: 24,
};

function PostCard({ post, onLike }) {
  return (
    <Card style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{post.avatar}</Text>
        </View>
        <View style={styles.postMeta}>
          <Text style={styles.postAuthor}>{post.userName}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
      </View>

      <Text style={styles.postText}>{post.text}</Text>

      {post.stats && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{post.stats.distance}</Text>
            <Text style={styles.statLabel}>Mesafe</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{post.stats.duration}</Text>
            <Text style={styles.statLabel}>Süre</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{post.stats.avgHeartRate}</Text>
            <Text style={styles.statLabel}>Ort. BPM</Text>
          </View>
        </View>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
          <Text style={styles.actionIcon}>{post.liked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionCount}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>📤</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default function CommunityScreen() {
  const [posts, setPosts] = useState(MOCK_POSTS);

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.postId === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Topluluk</Text>
        <TouchableOpacity style={styles.createBtn}>
          <Text style={styles.createBtnText}>+ Paylaş</Text>
        </TouchableOpacity>
      </View>

      {/* Event Banner */}
      <Card style={styles.eventBanner} variant="elevated">
        <View style={styles.eventBannerRow}>
          <Text style={styles.eventEmoji}>🌅</Text>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle}>{MOCK_EVENT.title}</Text>
            <Text style={styles.eventDate}>{MOCK_EVENT.date}</Text>
            <Text style={styles.eventLocation}>📍 {MOCK_EVENT.location}</Text>
          </View>
        </View>
        <View style={styles.eventFooter}>
          <Text style={styles.rsvpCount}>👥 {MOCK_EVENT.rsvpCount} kişi katılıyor</Text>
          <TouchableOpacity style={styles.rsvpBtn}>
            <Text style={styles.rsvpBtnText}>Katıl</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Weekly Challenge */}
      <Card style={styles.challengeCard}>
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeTitle}>🏆 Haftalık Meydan Okuma</Text>
          <Text style={styles.challengeDays}>3 gün kaldı</Text>
        </View>
        <Text style={styles.challengeDesc}>7 gün boyunca günde 8.000 adım at</Text>
        <View style={styles.challengeBar}>
          <View style={[styles.challengeFill, { width: '57%' }]} />
        </View>
        <Text style={styles.challengeProgress}>4/7 gün tamamlandı</Text>
      </Card>

      <Text style={styles.feedTitle}>Son Paylaşımlar</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeader />}
        renderItem={({ item }) => <PostCard post={item} onLike={() => handleLike(item.postId)} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  createBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: colors.cyan,
    borderRadius: 999,
  },
  createBtnText: { color: colors.navy, fontSize: 13, fontWeight: '600' },
  eventBanner: { marginHorizontal: 20, marginBottom: 12, gap: 12 },
  eventBannerRow: { flexDirection: 'row', gap: 12 },
  eventEmoji: { fontSize: 40 },
  eventInfo: { flex: 1, gap: 2 },
  eventTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  eventDate: { fontSize: 13, color: colors.gold },
  eventLocation: { fontSize: 12, color: colors.textTertiary },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rsvpCount: { fontSize: 13, color: colors.textSecondary },
  rsvpBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.gold,
    borderRadius: 999,
  },
  rsvpBtnText: { color: colors.navy, fontSize: 13, fontWeight: '600' },
  challengeCard: { marginHorizontal: 20, marginBottom: 12, gap: 8 },
  challengeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  challengeTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  challengeDays: { fontSize: 12, color: colors.gold },
  challengeDesc: { fontSize: 13, color: colors.textSecondary },
  challengeBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  challengeFill: { height: '100%', backgroundColor: colors.gold, borderRadius: 3 },
  challengeProgress: { fontSize: 11, color: colors.textTertiary },
  feedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },
  postCard: { marginHorizontal: 20, marginBottom: 12, gap: 12 },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.royal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: colors.white },
  postMeta: { gap: 2 },
  postAuthor: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  postTime: { fontSize: 11, color: colors.textTertiary },
  postText: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 12,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textTertiary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  postActions: { flexDirection: 'row', gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionIcon: { fontSize: 18 },
  actionCount: { fontSize: 13, color: colors.textSecondary },
});
