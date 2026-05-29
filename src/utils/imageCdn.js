// Phase 3 Sprint 11 — Cloudinary/Imgix transform URL builder.
// Saves bandwidth on mobile by requesting exactly the rendered size with
// auto format (avif/webp) and quality.

// Read env at call time. babel-preset-expo inlines `process.env.EXPO_PUBLIC_*`
// at transform time, so the dynamic-key form below is what actually wins:
// `process.env[KEY]` survives the transformer and reads the live value.
const CLOUDINARY_KEY = 'EXPO_PUBLIC_CLOUDINARY_BASE';
const IMGIX_KEY = 'EXPO_PUBLIC_IMGIX_BASE';
const getCloudinaryBase = () => process.env[CLOUDINARY_KEY];
const getImgixBase = () => process.env[IMGIX_KEY];

export function cdnUrl(src, { width, height, dpr = 2, quality = 'auto', fit = 'cover' } = {}) {
  if (!src) return src;
  if (src.startsWith('data:') || src.startsWith('file:')) return src;

  const CLOUDINARY_BASE = getCloudinaryBase();
  const IMGIX_BASE = getImgixBase();

  if (CLOUDINARY_BASE) {
    const parts = ['f_auto', `q_${quality}`];
    if (width) parts.push(`w_${Math.round(width * dpr)}`);
    if (height) parts.push(`h_${Math.round(height * dpr)}`);
    if (fit === 'cover') parts.push('c_fill');
    if (fit === 'contain') parts.push('c_fit');
    return `${CLOUDINARY_BASE}/${parts.join(',')}/${encodeURIComponent(src)}`;
  }

  if (IMGIX_BASE && src.startsWith(IMGIX_BASE)) {
    const url = new URL(src);
    url.searchParams.set('auto', 'format,compress');
    url.searchParams.set('q', quality === 'auto' ? '75' : String(quality));
    if (width) url.searchParams.set('w', String(Math.round(width * dpr)));
    if (height) url.searchParams.set('h', String(Math.round(height * dpr)));
    if (fit) url.searchParams.set('fit', fit === 'cover' ? 'crop' : 'clip');
    return url.toString();
  }

  return src;
}

export function avatarUrl(src, size = 64) {
  return cdnUrl(src, { width: size, height: size, fit: 'cover' });
}

export function heroUrl(src, width = 800) {
  return cdnUrl(src, { width, quality: 80 });
}
