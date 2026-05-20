import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchVideoById,
  saveWatchProgress,
  updateLocalProgress,
  clearCurrentVideo,
} from '../../store/slices/videosSlice';
import VideoCard from '../../components/features/VideoCard';
import { colors } from '../../constants/designTokens';

const { width } = Dimensions.get('window');
const SPEEDS = [0.75, 1, 1.25, 1.5];

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function VideoPlayerScreen({ route, navigation }) {
  const { videoId, video: routeVideo } = route.params || {};
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentVideo, allVideos, progress } = useAppSelector((state) => state.videos);

  const video = currentVideo || routeVideo;
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(progress[videoId] || 0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (videoId) dispatch(fetchVideoById(videoId));
    return () => {
      dispatch(clearCurrentVideo());
      clearInterval(saveTimer.current);
    };
  }, [videoId]);

  const handleSaveProgress = useCallback(
    (time) => {
      if (!user?.uid || !videoId) return;
      dispatch(updateLocalProgress({ videoId, progressSeconds: time }));
      dispatch(
        saveWatchProgress({
          uid: user.uid,
          videoId,
          progressSeconds: time,
          durationSeconds: video?.durationSeconds,
        })
      );
    },
    [user?.uid, videoId, video?.durationSeconds]
  );

  const relatedVideos = allVideos
    .filter((v) => v.videoId !== videoId && v.category === video?.category)
    .slice(0, 4);

  const streamUrl = video?.muxPlaybackId
    ? `https://stream.mux.com/${video.muxPlaybackId}.m3u8`
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Player area */}
        <View style={styles.playerArea}>
          {!video ? (
            <ActivityIndicator color={colors.cyan} size="large" />
          ) : streamUrl ? (
            <View style={styles.playerPlaceholder}>
              {/* expo-video VideoView would go here in the native app */}
              <Text style={styles.playerIcon}>▶</Text>
              <Text style={styles.playerNote}>{`stream.mux.com/${video.muxPlaybackId}`}</Text>
            </View>
          ) : (
            <View style={styles.playerPlaceholder}>
              <Text style={styles.playerIcon}>🎬</Text>
              <Text style={styles.playerNote}>Video henüz yüklenmedi</Text>
            </View>
          )}
        </View>

        {/* Controls bar */}
        <View style={styles.controls}>
          {/* Seek bar */}
          <View style={styles.seekBar}>
            <View
              style={[
                styles.seekFill,
                {
                  width: video?.durationSeconds
                    ? `${Math.min(100, (currentTime / video.durationSeconds) * 100)}%`
                    : '0%',
                },
              ]}
            />
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(video?.durationSeconds)}</Text>
          </View>

          {/* Playback buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => setCurrentTime((t) => Math.max(0, t - 10))}
            >
              <Text style={styles.skipText}>−10s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => {
                setPlaying((p) => !p);
                if (!playing) {
                  saveTimer.current = setInterval(() => {
                    setCurrentTime((t) => {
                      const next = t + 1;
                      if (next % 10 === 0) handleSaveProgress(next);
                      return next;
                    });
                  }, 1000 / SPEEDS[speedIndex]);
                } else {
                  clearInterval(saveTimer.current);
                  handleSaveProgress(currentTime);
                }
              }}
            >
              <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => setCurrentTime((t) => Math.min(video?.durationSeconds || t, t + 10))}
            >
              <Text style={styles.skipText}>+10s</Text>
            </TouchableOpacity>
          </View>

          {/* Speed */}
          <TouchableOpacity style={styles.speedBtn} onPress={() => setShowSpeedMenu((v) => !v)}>
            <Text style={styles.speedText}>{SPEEDS[speedIndex]}×</Text>
          </TouchableOpacity>
          {showSpeedMenu && (
            <View style={styles.speedMenu}>
              {SPEEDS.map((s, i) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.speedOption, i === speedIndex && styles.speedOptionActive]}
                  onPress={() => {
                    setSpeedIndex(i);
                    setShowSpeedMenu(false);
                  }}
                >
                  <Text
                    style={[styles.speedOptionText, i === speedIndex && { color: colors.cyan }]}
                  >
                    {s}×
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Video info */}
        <View style={styles.infoSection}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Geri</Text>
          </TouchableOpacity>
          {video && (
            <>
              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>{video.category}</Text>
              </View>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoHost}>{video.hostName}</Text>
              {video.description && <Text style={styles.videoDesc}>{video.description}</Text>}
            </>
          )}
        </View>

        {/* Related */}
        {relatedVideos.length > 0 && (
          <View style={styles.related}>
            <Text style={styles.relatedTitle}>İlgili videolar</Text>
            {relatedVideos.map((v) => (
              <View key={v.videoId} style={styles.relatedItem}>
                <VideoCard
                  video={v}
                  progress={progress[v.videoId]}
                  onPress={() =>
                    navigation.replace('VideoPlayer', { videoId: v.videoId, video: v })
                  }
                />
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  playerArea: {
    width,
    height: (width * 9) / 16,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerPlaceholder: { alignItems: 'center', gap: 8 },
  playerIcon: { fontSize: 48, color: colors.cyan, opacity: 0.6 },
  playerNote: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  controls: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  seekBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  seekFill: { height: '100%', backgroundColor: colors.cyan, borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontSize: 10, color: 'rgba(255,255,255,0.45)' },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 4,
  },
  skipBtn: { padding: 8 },
  skipText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 20, color: colors.navy },
  speedBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  speedText: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  speedMenu: {
    position: 'absolute',
    right: 20,
    bottom: 52,
    backgroundColor: colors.bgSecondary || '#0F1E2E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  speedOption: { paddingHorizontal: 20, paddingVertical: 10 },
  speedOptionActive: { backgroundColor: 'rgba(20,184,212,0.1)' },
  speedOptionText: { fontSize: 13, color: colors.textPrimary, fontWeight: '500' },
  infoSection: { paddingHorizontal: 20, paddingTop: 16, gap: 8 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 4 },
  backText: { color: colors.cyan, fontSize: 14 },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(20,184,212,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: { fontSize: 10, color: colors.cyan, fontWeight: '600', textTransform: 'uppercase' },
  videoTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, lineHeight: 26 },
  videoHost: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  videoDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 20, marginTop: 4 },
  related: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  relatedTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  relatedItem: {},
});
