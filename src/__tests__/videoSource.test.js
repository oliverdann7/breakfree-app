import {
  VIDEO_SOURCES,
  getSource,
  getSourceId,
  getThumbnailUrl,
  getStreamUrl,
  isYouTube,
  isPlayable,
} from '../utils/videoSource';

describe('videoSource', () => {
  describe('getSource', () => {
    it('uses explicit source', () => {
      expect(getSource({ source: 'youtube' })).toBe('youtube');
    });

    it('falls back to mux for legacy muxPlaybackId docs', () => {
      expect(getSource({ muxPlaybackId: 'abc' })).toBe(VIDEO_SOURCES.MUX);
    });

    it('returns null when nothing identifies the source', () => {
      expect(getSource({})).toBeNull();
      expect(getSource(null)).toBeNull();
    });
  });

  describe('getSourceId', () => {
    it('prefers sourceId then legacy muxPlaybackId', () => {
      expect(getSourceId({ sourceId: 'yt1' })).toBe('yt1');
      expect(getSourceId({ muxPlaybackId: 'mux1' })).toBe('mux1');
      expect(getSourceId({})).toBeNull();
    });
  });

  describe('getThumbnailUrl', () => {
    it('builds a YouTube thumbnail', () => {
      expect(getThumbnailUrl({ source: 'youtube', sourceId: 'abc' })).toBe(
        'https://img.youtube.com/vi/abc/hqdefault.jpg'
      );
    });

    it('builds a Mux thumbnail (incl. legacy field)', () => {
      expect(getThumbnailUrl({ muxPlaybackId: 'pb1' })).toBe(
        'https://image.mux.com/pb1/thumbnail.jpg?time=5&width=400'
      );
    });

    it('prefers an explicit thumbnailUrl', () => {
      expect(getThumbnailUrl({ source: 'vimeo', sourceId: '1', thumbnailUrl: 'x.jpg' })).toBe(
        'x.jpg'
      );
    });

    it('returns null when nothing derivable', () => {
      expect(getThumbnailUrl({ source: 'url', sourceUrl: 'a.mp4' })).toBeNull();
    });
  });

  describe('getStreamUrl', () => {
    it('builds a Mux HLS url', () => {
      expect(getStreamUrl({ source: 'mux', sourceId: 'pb1' })).toBe(
        'https://stream.mux.com/pb1.m3u8'
      );
    });

    it('returns the direct url for source=url', () => {
      expect(getStreamUrl({ source: 'url', sourceUrl: 'https://x/a.mp4' })).toBe(
        'https://x/a.mp4'
      );
    });

    it('never returns a stream url for YouTube', () => {
      expect(getStreamUrl({ source: 'youtube', sourceId: 'abc' })).toBeNull();
    });
  });

  describe('isYouTube / isPlayable', () => {
    it('detects YouTube', () => {
      expect(isYouTube({ source: 'youtube', sourceId: 'a' })).toBe(true);
      expect(isYouTube({ source: 'mux', sourceId: 'a' })).toBe(false);
    });

    it('YouTube is playable with an id', () => {
      expect(isPlayable({ source: 'youtube', sourceId: 'a' })).toBe(true);
      expect(isPlayable({ source: 'youtube', sourceId: null })).toBe(false);
    });

    it('native is playable only with a stream url', () => {
      expect(isPlayable({ source: 'mux', sourceId: 'pb1' })).toBe(true);
      expect(isPlayable({ source: 'mux', sourceId: null })).toBe(false);
    });
  });
});
