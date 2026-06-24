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
  isVideoLocked,
} from '../../store/slices/videosSlice';
import { selectIsPremium } from '../../store/slices/premiumSlice';
import { isYouTube, isPlayable } from '../../utils/videoSource';
import VideoPlayer from '../../components/features/players/VideoPlayer';
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
  const isPremium = useAppSelector(selectIsPremium);

  const video = currentVideo || routeVideo;
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(progress[videoId] || 0);
  const [duration, setDuration] = useState(routeVideo?.durationSeconds || 0);
  const [ready, setReady] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const startSeconds = useRef(progress[videoId] || 0).current;
  const lastSavedRef = useRef(0);

  const locked = isVideoLocked(video, isPremium);

  useEffect(() => {
    if (videoId) dispatch(fetchVideoById(videoId));
    return () => {
      dispatch(clearCurrentVideo());
    };
  }, [videoId]);

  const handleSaveProgress = useCallback(
    (time) => {
      if (!user?.uid || !videoId) return;
      dispatch(updateLocalProgress({ videoId, progressSeconds: Math.floor(time) }));
      dispatch(
        saveWatchProgress({
          uid: user.uid,
          videoId,
          progressSeconds: Math.floor(time),
          durationSeconds: duration || video?.durationSeconds,
        })
      );
    },
    [user?.uid, videoId, duration, video?.durationSeconds]
  );

  // Persist the last known position when leaving the screen.
  useEffect(
    () => () => {
      if (currentTime > 0) handleSaveProgress(currentTime);
    },
    [currentTime, handleSaveProgress]
  );

  const handleProgress = useCallback(
    (time) => {
      setCurrentTime(time);
      // Throttle Firestore writes to roughly every 10s of playback.
      if (Math.floor(time) - lastSavedRef.current >= 10) {
        lastSavedRef.current = Math.floor(time);
        handleSaveProgress(time);
      }
    },
    [handleSaveProgress]
  );

  const seekBy = useCallback(
    (delta) => {
      const next = Math.max(0, Math.min(duration || currentTime + delta, currentTime + delta));
      setCurrentTime(next);
      playerRef.current?.seekTo(next);
    },
    [currentTime, duration]
  );

  const relatedVideos = allVideos
    .filter((v) => v.videoId !== videoId && v.category === video?.category)
    .slice(0, 4);

  const totalDuration = duration || video?.durationSeconds || 0;

  const renderPlayerArea = () => {
    if (!video) return <ActivityIndicator color={colors.cyan} size="large" />;

    if (locked) {
      return (
        <View style={styles.playerPlaceholder}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockTitle}>Pro içerik</Text>
          <Text style={styles.playerNote}>Bu videoyu izlemek için BreakFree Pro gerekli.</Text>
          <TouchableOpacity
            style={styles.upgradeBtn}
            onPress={() => navigation.navigate('Premium')}
          >
            <Text style={styles.upgradeText}>{"Pro'ya geç"}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!isPlayable(video)) {
      return (
        <View style={styles.playerPlaceholder}>
          <Text style={styles.playerIcon}>🎬</Text>
          <Text style={styles.playerNote}>Video henüz yüklenmedi</Text>
        </View>
      );
    }

    return (
      <>
        <VideoPlayer
          ref={playerRef}
          video={video}
          paused={!playing}
          rate={SPEEDS[speedIndex]}
          startSeconds={startSeconds}
          onProgress={handleProgress}
          onDuration={setDuration}
          onReady={() => setReady(true)}
          onEnd={() => {
            setPlaying(false);
            handleSaveProgress(totalDuration);
          }}
        />
        {!ready && (
          <View style={styles.playerLoading} pointerEvents="none">
            <ActivityIndicator color={colors.cyan} size="large" />
          </View>
        )}
      </>
    );
  };

  // YouTube renders its own controls inside the iframe; show our custom bar only
  // for the native player to avoid conflicting/duplicate transport controls.
  const showCustomControls = video && !locked && isPlayable(video) && !isYouTube(video);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Player area */}
        <View style={styles.playerArea}>{renderPlayerArea()}</View>

        {/* Controls bar */}
        {showCustomControls && (
          <View style={styles.controls}>
            {/* Seek bar */}
            <View style={styles.seekBar}>
              <View
                style={[
                  styles.seekFill,
                  {
                    width: totalDuration
                      ? `${Math.min(100, (currentTime / totalDuration) * 100)}%`
                      : '0%',
                  },
                ]}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
            </View>

            {/* Playback buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.skipBtn} onPress={() => seekBy(-10)}>
                <Text style={styles.skipText}>−10s</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.playBtn} onPress={() => setPlaying((p) => !p)}>
                <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipBtn} onPress={() => seekBy(10)}>
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
        )}

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
                  locked={isVideoLocked(v, isPremium)}
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
  playerLoading: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  playerPlaceholder: { alignItems: 'center', gap: 8, paddingHorizontal: 20 },
  playerIcon: { fontSize: 48, color: colors.cyan, opacity: 0.6 },
  lockIcon: { fontSize: 40 },
  lockTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  playerNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  upgradeBtn: {
    marginTop: 8,
    backgroundColor: colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  upgradeText: { color: colors.navy, fontWeight: '700', fontSize: 13 },
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
