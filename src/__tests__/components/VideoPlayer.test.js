import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import VideoPlayer from '../../components/features/players/VideoPlayer';
import VideoCard from '../../components/features/VideoCard';

// The native player libs need stubs under jsdom.
jest.mock(
  'expo',
  () => ({
    useEventListener: jest.fn(),
  }),
  { virtual: true }
);
jest.mock(
  'expo-video',
  () => ({
    VideoView: 'VideoView',
    useVideoPlayer: jest.fn(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      currentTime: 0,
      duration: 0,
    })),
  }),
  { virtual: true }
);
jest.mock('react-native-youtube-iframe', () => 'YoutubeIframe', { virtual: true });

describe('VideoPlayer dispatcher', () => {
  it('renders the YouTube iframe for source=youtube', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(
        <VideoPlayer video={{ source: 'youtube', sourceId: 'abc' }} paused rate={1} />
      );
    });
    expect(renderer.root.findAllByType('YoutubeIframe')).toHaveLength(1);
  });

  it('renders the native expo-video player for source=mux', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(
        <VideoPlayer video={{ source: 'mux', sourceId: 'pb1' }} paused rate={1} />
      );
    });
    expect(renderer.root.findAllByType('VideoView')).toHaveLength(1);
  });

  it('renders nothing playable for a Mux video without an id', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(
        <VideoPlayer video={{ source: 'mux', sourceId: null }} paused rate={1} />
      );
    });
    expect(renderer.root.findAllByType('VideoView')).toHaveLength(0);
  });
});

describe('VideoCard lock state', () => {
  const video = {
    videoId: 'v1',
    title: 'T',
    hostName: 'H',
    category: 'Zihin',
    source: 'youtube',
    sourceId: 'abc',
    durationSeconds: 60,
  };

  it('shows the Pro badge when locked', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<VideoCard video={video} locked onPress={() => {}} />);
    });
    const texts = renderer.root.findAllByType('Text').map((t) => t.props.children);
    expect(texts).toContain('Pro');
    // Lock icon renders as an Svg via the shared Icon component.
    expect(renderer.root.findAllByType('Svg').length).toBeGreaterThan(0);
  });

  it('hides the Pro badge when unlocked', () => {
    let renderer;
    act(() => {
      renderer = TestRenderer.create(<VideoCard video={video} locked={false} onPress={() => {}} />);
    });
    const texts = renderer.root.findAllByType('Text').map((t) => t.props.children);
    expect(texts).not.toContain('Pro');
  });
});
