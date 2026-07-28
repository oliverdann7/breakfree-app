import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { getStreamUrl } from '../../../utils/videoSource';

// Plays Mux / Vimeo / direct-URL videos through expo-video. The parent owns
// play/pause (`paused`) and `rate`; we surface position/duration/end via the
// uniform callbacks and expose `seekTo` imperatively.
const NativePlayer = forwardRef(function NativePlayer(
  { video, paused, rate, startSeconds = 0, onProgress, onDuration, onEnd, onReady },
  ref
) {
  const url = getStreamUrl(video);

  const player = useVideoPlayer(url ? { uri: url } : null, (p) => {
    p.timeUpdateEventInterval = 1;
    if (startSeconds > 0) p.currentTime = startSeconds;
    if (typeof rate === 'number') p.playbackRate = rate;
    if (!paused) p.play();
  });

  useImperativeHandle(
    ref,
    () => ({
      seekTo: (seconds) => {
        player.currentTime = Math.max(0, seconds);
      },
    }),
    [player]
  );

  useEffect(() => {
    if (paused) player.pause();
    else player.play();
  }, [player, paused]);

  useEffect(() => {
    if (typeof rate === 'number') player.playbackRate = rate;
  }, [player, rate]);

  useEventListener(player, 'timeUpdate', ({ currentTime }) => {
    if (typeof currentTime === 'number') onProgress?.(currentTime);
  });

  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'readyToPlay') {
      if (player.duration) onDuration?.(player.duration);
      onReady?.();
    }
  });

  useEventListener(player, 'playToEnd', () => onEnd?.());

  if (!url) return null;

  return (
    <VideoView
      player={player}
      style={styles.video}
      contentFit="contain"
      nativeControls={false}
      allowsFullscreen={false}
    />
  );
});

const styles = StyleSheet.create({
  video: { width: '100%', height: '100%', backgroundColor: '#000' },
});

export default NativePlayer;
