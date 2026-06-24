// Provider-agnostic video source helpers.
//
// A video declares where its media lives via `source` ('youtube' | 'mux' |
// 'vimeo' | 'url') plus a `sourceId` (or `sourceUrl` for direct files). These
// helpers translate that into the thumbnail / stream URLs the UI and players
// need, so screens never have to know which backend a given video uses.
//
// Back-compat: legacy docs only carry `muxPlaybackId` (no `source`). We treat
// those as Mux so existing content keeps working without a migration.

export const VIDEO_SOURCES = {
  YOUTUBE: 'youtube',
  MUX: 'mux',
  VIMEO: 'vimeo',
  URL: 'url',
};

/** Resolve the effective source, falling back to Mux for legacy docs. */
export function getSource(video) {
  if (!video) return null;
  if (video.source) return video.source;
  if (video.muxPlaybackId) return VIDEO_SOURCES.MUX;
  return null;
}

/** The provider-specific id (youtube id, mux playback id, vimeo id, ...). */
export function getSourceId(video) {
  if (!video) return null;
  return video.sourceId || video.muxPlaybackId || null;
}

/**
 * Thumbnail/poster image URL for cards and the player poster.
 * Returns null when no derivable thumbnail exists (caller shows a placeholder).
 */
export function getThumbnailUrl(video) {
  const source = getSource(video);
  const id = getSourceId(video);
  if (video?.thumbnailUrl) return video.thumbnailUrl;
  if (!id) return null;

  switch (source) {
    case VIDEO_SOURCES.YOUTUBE:
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    case VIDEO_SOURCES.MUX:
      return `https://image.mux.com/${id}/thumbnail.jpg?time=5&width=400`;
    case VIDEO_SOURCES.VIMEO:
      // Vimeo has no deterministic thumbnail URL from an id; rely on
      // `thumbnailUrl` set at publish time (handled above).
      return null;
    case VIDEO_SOURCES.URL:
      return null;
    default:
      return null;
  }
}

/**
 * Direct stream URL for the native (expo-av) player.
 * YouTube does NOT return a stream URL here — it must play through the iframe
 * player, so callers should branch on `getSource()` before reaching for this.
 */
export function getStreamUrl(video) {
  const source = getSource(video);
  const id = getSourceId(video);

  switch (source) {
    case VIDEO_SOURCES.MUX:
      return id ? `https://stream.mux.com/${id}.m3u8` : null;
    case VIDEO_SOURCES.VIMEO:
      // Progressive/HLS Vimeo URLs are signed and fetched at runtime; when a
      // resolved file URL is stored we use it, otherwise nothing to stream.
      return video?.sourceUrl || null;
    case VIDEO_SOURCES.URL:
      return video?.sourceUrl || null;
    case VIDEO_SOURCES.YOUTUBE:
      return null;
    default:
      return null;
  }
}

/** True when the video plays via the YouTube iframe rather than expo-av. */
export function isYouTube(video) {
  return getSource(video) === VIDEO_SOURCES.YOUTUBE;
}

/** Whether we have enough info to play this video at all. */
export function isPlayable(video) {
  if (isYouTube(video)) return Boolean(getSourceId(video));
  return Boolean(getStreamUrl(video));
}
