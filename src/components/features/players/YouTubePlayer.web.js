import React, { useImperativeHandle, forwardRef } from 'react';
import { View } from 'react-native';
import { getSourceId } from '../../../utils/videoSource';

// Web build of YouTubePlayer. react-native-youtube-iframe's web entry depends
// on react-native-web-webview, which breaks Metro's web bundle — and the web
// app (web.js entry) never mounts the native player screens anyway. This
// variant keeps the same props/ref surface but renders a plain YouTube embed
// with native controls, so anything that does mount it on web still plays.
const YouTubePlayer = forwardRef(function YouTubePlayer(
  { video, paused, startSeconds = 0, onReady },
  ref
) {
  const id = getSourceId(video);

  // The iframe embed exposes no seek API without the YouTube JS SDK; users
  // seek through the embed's own controls instead.
  useImperativeHandle(ref, () => ({ seekTo: () => {} }));

  if (!id) return null;

  const params = new URLSearchParams({
    start: String(Math.floor(startSeconds)),
    autoplay: paused ? '0' : '1',
    modestbranding: '1',
  });

  return (
    <View style={{ width: '100%', aspectRatio: 16 / 9 }}>
      <iframe
        title={video?.title || 'YouTube video'}
        src={`https://www.youtube.com/embed/${id}?${params.toString()}`}
        style={{ width: '100%', height: '100%', border: 0 }}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        onLoad={onReady}
      />
    </View>
  );
});

export default YouTubePlayer;
