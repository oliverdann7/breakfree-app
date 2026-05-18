import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../common/Card';
import { colors } from '../../constants/designTokens';

const CATEGORY_EMOJI = {
  Zihin: '🧘',
  Sağlık: '💚',
  Hareket: '🏃',
  Beslenme: '🥗',
};

const STATUS_CONFIG = {
  live: { label: 'CANLI', color: colors.error },
  scheduled: { label: 'YAKINDA', color: colors.gold },
  ended: { label: 'BİTTİ', color: colors.textTertiary },
};

export default function TalkCard({ talk, onPress, style }) {
  const status = STATUS_CONFIG[talk.status] || STATUS_CONFIG.ended;
  const emoji = CATEGORY_EMOJI[talk.category] || '🎙';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Card style={[styles.card, style]}>
        <View style={styles.thumbnail}>
          <Text style={styles.thumbnailEmoji}>{emoji}</Text>
          {talk.status === 'live' && <View style={styles.liveDot} />}
        </View>

        <View style={styles.info}>
          <View style={styles.metaRow}>
            <View style={[styles.badge, { backgroundColor: status.color + '20' }]}>
              <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
            </View>
            <Text style={styles.category}>{talk.category}</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>{talk.title}</Text>
          <Text style={styles.host}>{talk.host.name}</Text>

          <View style={styles.footer}>
            <Text style={styles.footerItem}>⏱ {talk.duration} dk</Text>
            {talk.listeners > 0 && (
              <Text style={styles.footerItem}>👥 {talk.listeners}</Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailEmoji: { fontSize: 32 },
  liveDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  info: { flex: 1, gap: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  category: { fontSize: 11, color: colors.textTertiary },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, lineHeight: 20 },
  host: { fontSize: 12, color: colors.cyan },
  footer: { flexDirection: 'row', gap: 12, marginTop: 2 },
  footerItem: { fontSize: 11, color: colors.textTertiary },
});
