describe('imageCdn', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('returns src unchanged when no CDN configured', () => {
    delete process.env['EXPO_PUBLIC_CLOUDINARY_BASE'];
    delete process.env['EXPO_PUBLIC_IMGIX_BASE'];
    const { cdnUrl } = require('../utils/imageCdn');
    expect(cdnUrl('https://example.com/a.jpg', { width: 200 })).toBe('https://example.com/a.jpg');
  });

  it('passes through data: URIs', () => {
    const { cdnUrl } = require('../utils/imageCdn');
    expect(cdnUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
  });

  it('handles null/undefined src', () => {
    const { cdnUrl } = require('../utils/imageCdn');
    expect(cdnUrl(null)).toBeNull();
    expect(cdnUrl(undefined)).toBeUndefined();
  });

  it('builds Cloudinary URL with transforms', () => {
    process.env['EXPO_PUBLIC_CLOUDINARY_BASE'] = 'https://res.cloudinary.com/breakfree/image/fetch';
    const { cdnUrl } = require('../utils/imageCdn');
    const url = cdnUrl('https://example.com/a.jpg', { width: 200, dpr: 2 });
    expect(url).toContain('f_auto');
    expect(url).toContain('q_auto');
    expect(url).toContain('w_400');
    expect(url).toContain(encodeURIComponent('https://example.com/a.jpg'));
  });

  it('avatarUrl uses square dimensions', () => {
    process.env['EXPO_PUBLIC_CLOUDINARY_BASE'] = 'https://res.cloudinary.com/x/image/fetch';
    const { avatarUrl } = require('../utils/imageCdn');
    const url = avatarUrl('https://example.com/a.jpg', 48);
    expect(url).toContain('w_96');
    expect(url).toContain('h_96');
  });
});
