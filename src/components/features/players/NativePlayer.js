import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { getStreamUrl, getThumbnailUrl } from '../../../utils/videoSource';

// Plays Mux / Vimeo / direct-URL videos through expo-av. The parent owns
// play/pause (`paused`) and `rate`; we surface position/duration/end via the
// uniform callbacks and expose `seekTo` imperatively.
const NativePlayer = forwardRef(function NativePlayer(
  { video, paused, rate, startSeconds = 0, onProgress, onDuration, onEnd, onReady },
  ref
) {
  const videoRef = useRef(null);
  const url = getStreamUrl(video);
  const poster = getThumbnailUrl(video);

  useImperativeHandle(ref, () => ({
    seekTo: (seconds) => videoRef.current?.setPositionAsync(Math.max(0, seconds) * 1000),
  }));

  const handleStatus = useCallback(
    (status) => {
      if (!status.isLoaded) return;
      if (typeof status.positionMillis === 'number') onProgress?.(status.positionMillis / 1000);
      if (status.durationMillis) onDuration?.(status.durationMillis / 1000);
      if (status.didJustFinish) onEnd?.();
    },
    [onProgress, onDuration, onEnd]
  );

  if (!url) return null;

  return (
    <Video
      ref={videoRef}
      style={styles.video}
      source={{ uri: url }}
      posterSource={poster ? { uri: poster } : undefined}
      usePoster={Boolean(poster)}
      resizeMode={ResizeMode.CONTAIN}
      shouldPlay={!paused}
      rate={rate}
      progressUpdateIntervalMillis={1000}
      positionMillis={startSeconds * 1000}
      onReadyForDisplay={() => onReady?.()}
      onPlaybackStatusUpdate={handleStatus}
      useNativeControls={false}
    />
  );
});

const styles = StyleSheet.create({
  video: { width: '100%', height: '100%', backgroundColor: '#000' },
});

export default NativePlayer;
