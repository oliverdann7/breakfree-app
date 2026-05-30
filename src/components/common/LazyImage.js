import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { cdnUrl } from '../../utils/imageCdn';
import { colors } from '../../constants/designTokens';

// Phase 3 Sprint 11 — lazy image with CDN transform + placeholder fade-in.
// On native, expo-image is preferred (better disk cache); when available we
// dynamically import it. Falls back to RN Image otherwise.

let ExpoImage = null;
try {
  // eslint-disable-next-line global-require
  ExpoImage = require('expo-image').Image;
} catch {
  // expo-image not installed — RN Image fallback.
}

export default function LazyImage({
  source,
  width,
  height,
  fit = 'cover',
  style,
  placeholderColor = colors.bgTertiary,
  ...rest
}) {
  const [loaded, setLoaded] = useState(false);
  const uri = typeof source === 'string' ? source : source?.uri;
  const transformed = uri ? cdnUrl(uri, { width, height, fit }) : null;

  const dims = { width, height };
  const ImageEl = ExpoImage || Image;

  return (
    <View style={[styles.wrap, dims, style]}>
      {!loaded && <View style={[styles.placeholder, { backgroundColor: placeholderColor }]} />}
      {transformed && (
        <ImageEl
          source={ExpoImage ? { uri: transformed } : { uri: transformed }}
          style={[StyleSheet.absoluteFill, { opacity: loaded ? 1 : 0 }]}
          resizeMode={fit === 'contain' ? 'contain' : 'cover'}
          contentFit={fit === 'contain' ? 'contain' : 'cover'}
          onLoad={() => setLoaded(true)}
          transition={ExpoImage ? 200 : undefined}
          {...rest}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', borderRadius: 8 },
  placeholder: { ...StyleSheet.absoluteFillObject },
});
