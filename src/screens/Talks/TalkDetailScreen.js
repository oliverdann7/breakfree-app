import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTalkById, clearCurrentTalk, joinTalk } from '../../store/slices/talksSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors } from '../../constants/designTokens';

export default function TalkDetailScreen({ route, navigation }) {
  const { talkId } = route.params;
  const dispatch = useAppDispatch();
  const { currentTalk } = useAppSelector((state) => state.talks);

  useEffect(() => {
    dispatch(fetchTalkById(talkId));
    return () => {
      dispatch(clearCurrentTalk());
    };
  }, [talkId]);

  if (!currentTalk) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  const isLive = currentTalk.status === 'live';
  const categoryEmoji =
    currentTalk.category === 'Zihin'
      ? '🧘'
      : currentTalk.category === 'Sağlık'
        ? '💚'
        : currentTalk.category === 'Hareket'
          ? '🏃'
          : '🥗';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Geri</Text>
          </TouchableOpacity>
          <View style={styles.heroImage}>
            <Text style={styles.heroEmoji}>{categoryEmoji}</Text>
          </View>
          <View style={[styles.statusBadge, isLive && styles.liveBadge]}>
            <Text style={styles.statusText}>
              {isLive ? '🔴 CANLI' : currentTalk.status === 'scheduled' ? '📅 YAKINDA' : '✅ BİTTİ'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{currentTalk.category}</Text>
          <Text style={styles.title}>{currentTalk.title}</Text>

          {/* Host */}
          <View style={styles.hostRow}>
            <View style={styles.hostAvatar}>
              <Text style={styles.hostAvatarText}>{currentTalk.host.name[0]}</Text>
            </View>
            <View>
              <Text style={styles.hostName}>{currentTalk.host.name}</Text>
              <Text style={styles.hostLabel}>Konuşmacı</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentTalk.duration} dk</Text>
              <Text style={styles.statLabel}>Süre</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentTalk.listeners}</Text>
              <Text style={styles.statLabel}>Dinleyici</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentTalk.category}</Text>
              <Text style={styles.statLabel}>Kategori</Text>
            </View>
          </View>

          {/* Description */}
          <Card style={styles.descCard}>
            <Text style={styles.descTitle}>Açıklama</Text>
            <Text style={styles.descText}>{currentTalk.description}</Text>
          </Card>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              title={
                isLive
                  ? "🎙 Talk'a Katıl"
                  : currentTalk.status === 'scheduled'
                    ? '🔔 Hatırlatıcı Kur'
                    : '🎵 Kaydı Dinle'
              }
              onPress={() => {
                if (isLive) {
                  dispatch(joinTalk(talkId));
                  Alert.alert('Katıldın!', `${currentTalk.title} talk'ına başarıyla katıldın.`);
                } else if (currentTalk.status === 'scheduled') {
                  Alert.alert(
                    'Hatırlatıcı Kuruldu',
                    `${currentTalk.title} başladığında sana haber vereceğiz.`
                  );
                } else {
                  Alert.alert('Kayıt', 'Bu talk kaydı yakında eklenecek.');
                }
              }}
            />
            <View style={styles.secondaryActions}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => Alert.alert('Kaydedildi', 'Talk kaydedildi.')}
              >
                <Text style={styles.iconBtnText}>🔖 Kaydet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => Alert.alert('Paylaş', 'Paylaşma bağlantısı kopyalandı.')}
              >
                <Text style={styles.iconBtnText}>📤 Paylaş</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgPrimary,
  },
  loadingText: { color: colors.textSecondary },
  hero: { position: 'relative', height: 220 },
  heroImage: {
    flex: 1,
    backgroundColor: 'rgba(11,114,185,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: { fontSize: 80 },
  backBtn: { position: 'absolute', top: 16, left: 16, zIndex: 10, padding: 8 },
  backText: { color: colors.cyan, fontSize: 15 },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  liveBadge: { backgroundColor: 'rgba(239,68,68,0.8)' },
  statusText: { fontSize: 12, color: colors.white, fontWeight: '600' },
  content: { padding: 20 },
  category: {
    fontSize: 12,
    color: colors.cyan,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 30,
    marginBottom: 20,
  },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.royal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarText: { fontSize: 18, fontWeight: '700', color: colors.white },
  hostName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  hostLabel: { fontSize: 12, color: colors.textTertiary },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  descCard: { marginBottom: 24 },
  descTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  descText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  actions: { gap: 12 },
  secondaryActions: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  iconBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBtnText: { color: colors.textSecondary, fontSize: 13 },
});
