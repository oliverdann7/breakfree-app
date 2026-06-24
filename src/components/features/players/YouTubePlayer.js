import React, { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Dimensions } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { getSourceId } from '../../../utils/videoSource';

const { width } = Dimensions.get('window');
const HEIGHT = (width * 9) / 16;

// Plays exclusive content hosted as unlisted YouTube videos via the iframe
// player (webview-backed). YouTube exposes no push progress events, so we poll
// getCurrentTime() while playing. Playback rate isn't controllable through the
// iframe API, so `rate` is accepted but not applied here.
const YouTubePlayer = forwardRef(function YouTubePlayer(
  { video, paused, startSeconds = 0, onProgress, onDuration, onEnd, onReady },
  ref
) {
  const playerRef = useRef(null);
  const pollRef = useRef(null);
  const id = getSourceId(video);

  useImperativeHandle(ref, () => ({
    seekTo: (seconds) => playerRef.current?.seekTo(Math.max(0, seconds), true),
  }));

  // Poll position once a second while playing; clear when paused/unmounted.
  useEffect(() => {
    if (paused) {
      clearInterval(pollRef.current);
      return undefined;
    }
    pollRef.current = setInterval(async () => {
      const t = await playerRef.current?.getCurrentTime?.();
      if (typeof t === 'number') onProgress?.(t);
    }, 1000);
    return () => clearInterval(pollRef.current);
  }, [paused, onProgress]);

  const handleReady = useCallback(async () => {
    const d = await playerRef.current?.getDuration?.();
    if (d) onDuration?.(d);
    onReady?.();
  }, [onDuration, onReady]);

  const handleChangeState = useCallback(
    (state) => {
      if (state === 'ended') onEnd?.();
    },
    [onEnd]
  );

  if (!id) return null;

  return (
    <YoutubeIframe
      ref={playerRef}
      height={HEIGHT}
      width={width}
      play={!paused}
      videoId={id}
      initialPlayerParams={{ start: Math.floor(startSeconds), controls: false, modestbranding: true }}
      onReady={handleReady}
      onChangeState={handleChangeState}
    />
  );
});

export default YouTubePlayer;
