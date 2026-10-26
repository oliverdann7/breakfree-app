// The web build's Content-Security-Policy (vercel.json) must let Firebase Auth
// load the scripts and frames it injects at runtime. When the browser blocks
// one, the SDK rejects with a bare `auth/internal-error` (its loadJS onerror),
// which is how web sign-in broke after script-src was locked to 'self'.
const vercel = require('../../vercel.json');

const csp = vercel.headers
  .flatMap((rule) => rule.headers)
  .find((h) => h.key === 'Content-Security-Policy').value;

const directive = (name) =>
  (csp.split(';').find((d) => d.trim().startsWith(`${name} `)) || '').trim().split(/\s+/).slice(1);

describe('vercel.json Content-Security-Policy', () => {
  it('allows the scripts Firebase Auth injects', () => {
    const scriptSrc = directive('script-src');
    // signInWithPopup (Google / Apple buttons)
    expect(scriptSrc).toContain('https://apis.google.com');
    // reCAPTCHA Enterprise / v2 for email-password sign-in when enforced
    expect(scriptSrc).toContain('https://www.google.com/recaptcha/');
    expect(scriptSrc).toContain('https://www.gstatic.com/recaptcha/');
  });

  it('allows the frames Firebase Auth and reCAPTCHA render', () => {
    const frameSrc = directive('frame-src');
    expect(frameSrc).toContain('https://*.firebaseapp.com');
    expect(frameSrc).toContain('https://www.google.com/recaptcha/');
    expect(frameSrc).toContain('https://recaptcha.google.com/recaptcha/');
  });

  it('lets Auth reach its endpoints', () => {
    const connectSrc = directive('connect-src');
    expect(connectSrc).toContain('https://*.googleapis.com');
    expect(connectSrc).toContain('https://www.google.com/recaptcha/');
  });

  it('keeps scripts otherwise locked down (no inline or eval)', () => {
    const scriptSrc = directive('script-src');
    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
    expect(scriptSrc).not.toContain('https:');
  });
});
