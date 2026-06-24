import React, { forwardRef } from 'react';
import { isYouTube } from '../../../utils/videoSource';
import YouTubePlayer from './YouTubePlayer';
import NativePlayer from './NativePlayer';

// Provider dispatcher: YouTube videos play through the iframe, everything else
// (Mux / Vimeo / direct URL) through expo-av. Both children share one prop +
// imperative API so VideoPlayerScreen never branches on the source itself.
//
// Props: { video, paused, rate, startSeconds, onProgress, onDuration, onEnd, onReady }
// Ref:   { seekTo(seconds) }
const VideoPlayer = forwardRef(function VideoPlayer(props, ref) {
  const Player = isYouTube(props.video) ? YouTubePlayer : NativePlayer;
  return <Player ref={ref} {...props} />;
});

export default VideoPlayer;
