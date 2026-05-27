import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../../constants/designTokens';

function formatDuration(secs) {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function VideoCard({ video, progress, onPress }) {
  const thumbnailUrl = video.muxPlaybackId
    ? `https://image.mux.com/${video.muxPlaybackId}/thumbnail.jpg?time=5&width=400`
    : null;

  const progressPct =
    progress && video.durationSeconds ? Math.min(1, progress / video.durationSeconds) : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Thumbnail */}
      <View style={styles.thumbnail}>
        {thumbnailUrl ? (
          <Image source={{ uri: thumbnailUrl }} style={styles.thumbnailImg} resizeMode="cover" />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.thumbnailIcon}>▶</Text>
          </View>
        )}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(video.durationSeconds)}</Text>
        </View>
        {progressPct > 0 && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{video.category}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.host} numberOfLines={1}>
          {video.hostName}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  thumbnail: {
    height: 130,
    backgroundColor: 'rgba(0,114,176,0.2)',
    position: 'relative',
  },
  thumbnailImg: { width: '100%', height: '100%' },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20,184,212,0.1)',
  },
  thumbnailIcon: { fontSize: 28, color: colors.cyan, opacity: 0.7 },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressFill: { height: '100%', backgroundColor: colors.cyan },
  info: { padding: 10, gap: 4 },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(20,184,212,0.12)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 2,
  },
  categoryText: { fontSize: 9, color: colors.cyan, fontWeight: '600', textTransform: 'uppercase' },
  title: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, lineHeight: 18 },
  host: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
});
