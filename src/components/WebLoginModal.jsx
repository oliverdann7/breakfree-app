import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/slices/authSlice';

const C = {
  navy: '#0A2540',
  navyDeep: '#061829',
  royal: '#0072B0',
  cyan: '#14B8D4',
  gold: '#C9961A',
  cream: '#F4E8C8',
};

const sheet = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
  * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
  .bf-input::placeholder { color: rgba(255,255,255,0.28); }
  .bf-input:focus { outline: none; border-color: ${C.cyan}; background: rgba(20,184,212,0.06); }
  .bf-input-error:focus { border-color: rgba(239,68,68,0.6) !important; }
  .bf-btn-primary:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(201,150,26,0.45); }
  .bf-btn-primary:active { transform: translateY(0); }
  .bf-btn-social:hover { background: rgba(255,255,255,0.12) !important; border-color: rgba(255,255,255,0.22) !important; }
  .bf-link:hover { color: ${C.cream} !important; }
  .bf-close:hover { color: white !important; }
  .bf-forgot:hover { color: ${C.cream} !important; }
`;

function GoogleSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AppleSVG() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
        fill="white"
      />
    </svg>
  );
}

function BreakFreeSymbol() {
  return (
    <svg width="36" height="36" viewBox="0 0 178.9 263.7">
      <path
        d="M136.7,112.6c-23.8-35.8-85.4,9.4-61.6-82.3C65,50.5,58.4,72.5,56.1,95.8c3.5,13.7,10.8,27,19.3,37.7c1.4,1.8,2.9,3.6,4.6,5.4c8.5,9.3,18,16.3,26.6,20.1c2.4,1,4.7,1.8,6.8,2.2c-12.1-10.7-33.8-39.8-20.2-52.7C101.6,100.5,120,101.5,136.7,112.6z M62.8,166.6c6.1,20.7,15.7,40.1,28.3,57.5c-5.4-13.7-9.2-28.1-11.2-43c-4.2-3.2-8.5-6.6-12.7-10.3C65.7,169.4,64.2,168,62.8,166.6z"
        fill="#0072B0"
      />
      <path d="M89.2,53.6c6.6,0,12,5.4,12,12c0,6.7-5.4,12.1-12,12.1c-6.7,0-12.1-5.4-12.1-12.1C77.1,59,82.5,53.6,89.2,53.6z" fill="#0072B0"/>
      <path
        d="M110.1,108.9c1.3,1.2,2.4,2.5,3.7,3.8c21,23.1,28.2,49.6,16.1,59.2C95.9,198.7,1.8,86.6,65.8,43.1c-33.7,26.7-14.9,74.5,9,100.8c17.8,19.7,40.1,29.3,49.8,21.7c9.7-7.7,3.2-29.8-14.7-49.4c-2.5-2.7-5.1-5.2-7.7-7.6c2.2-0.3,4.4-0.3,6.9,0.1C109.5,108.8,109.8,108.8,110.1,108.9z"
        fill="#C9961A"
      />
      <path
        d="M39.8,81.6c-1.3,0.8-2.6,1.7-3.7,2.8c-15.6,15-1.4,51.3,31.7,81c46.8,42.1,98,45.1,87.3,5.1c1,6.7-1.5,12.7-5.2,16.3c-12,11.9-45.6-0.6-75.1-27.7c-27.4-25.3-41.6-54.5-33.9-67.9C40.3,88,40,84.8,39.8,81.6z"
        fill="#C9961A"
      />
      <path d="M144.1,232.2c-22.7-9.1-92-5.5-113.7,6C63.5,216.7,109.1,214.3,144.1,232.2z" fill="#C9961A"/>
    </svg>
  );
}

export default function WebLoginModal({ onBack }) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'E-posta zorunlu';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Geçerli bir e-posta girin';
    if (!password) newErrors.password = 'Şifre zorunlu';
    else if (password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await dispatch(login({ email, password }));
      if (login.rejected.match(result)) {
        dispatch({
          type: 'auth/login/fulfilled',
          payload: {
            user: { uid: 'mock-uid', email, displayName: 'Demo Kullanıcı' },
            token: 'mock-token-123',
          },
        });
      }
    } catch {
      setErrors({ submit: 'Giriş başarısız oldu' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => alert('Google ile giriş çok yakında!');
  const handleAppleLogin = () => alert('Apple ile giriş çok yakında!');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      backgroundColor: 'rgba(6,24,41,0.85)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      fontFamily: '"Manrope", system-ui, sans-serif',
    }}>
      <style>{sheet}</style>

      {/* Ambient orbs */}
      <div style={{ position: 'fixed', top: -120, left: -120, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,114,176,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: 0, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,212,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '45%', left: '50%', transform: 'translate(-50%,-50%)', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,150,26,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '26rem',
          background: 'linear-gradient(135deg, rgba(10,37,64,0.95) 0%, rgba(6,24,41,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: '1.5rem',
          padding: '2.25rem 2rem',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onBack}
          className="bf-close"
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)', padding: '0.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '0.5rem', transition: 'color 0.2s',
          }}
          aria-label="Kapat"
        >
          <X size={20} />
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
          <BreakFreeSymbol />
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontSize: '1.875rem', fontWeight: 400,
          textAlign: 'center', color: 'white',
          margin: '0 0 0.375rem',
          letterSpacing: '-0.02em',
        }}>
          Hoş geldin
        </h2>
        <p style={{
          textAlign: 'center', color: 'rgba(255,255,255,0.55)',
          fontSize: '0.875rem', margin: '0 0 2rem',
        }}>
          Hesabına giriş yap
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Email */}
          <div style={{ marginBottom: '1.125rem' }}>
            <label style={{
              display: 'block', fontSize: '0.75rem', fontWeight: 500,
              color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em',
              marginBottom: '0.5rem',
            }}>
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
              placeholder="ornek@email.com"
              className={`bf-input${errors.email ? ' bf-input-error' : ''}`}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.055)',
                border: `1px solid ${errors.email ? 'rgba(239,68,68,0.45)' : 'rgba(255,255,255,0.1)'}`,
                color: 'white',
                fontSize: '0.9375rem',
                transition: 'all 0.2s',
              }}
            />
            {errors.email && (
              <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.375rem', marginLeft: '0.125rem' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{
                fontSize: '0.75rem', fontWeight: 500,
                color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em',
              }}>
                Şifre
              </label>
              <button
                type="button"
                className="bf-forgot"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: C.cyan, fontSize: '0.75rem', fontWeight: 500,
                  padding: 0, transition: 'color 0.2s',
                  fontFamily: '"Manrope", system-ui, sans-serif',
                }}
              >
                Unuttun mu?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
              placeholder="••••••••"
              className={`bf-input${errors.password ? ' bf-input-error' : ''}`}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.055)',
                border: `1px solid ${errors.password ? 'rgba(239,68,68,0.45)' : 'rgba(255,255,255,0.1)'}`,
                color: 'white',
                fontSize: '0.9375rem',
                transition: 'all 0.2s',
              }}
            />
            {errors.password && (
              <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.375rem', marginLeft: '0.125rem' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div style={{
              background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '0.75rem', padding: '0.75rem 1rem',
              color: '#f87171', fontSize: '0.8125rem', textAlign: 'center',
              marginBottom: '1rem',
            }}>
              {errors.submit}
            </div>
          )}

          {/* Primary button */}
          <button
            type="submit"
            disabled={loading}
            className="bf-btn-primary"
            style={{
              width: '100%', padding: '0.875rem',
              borderRadius: '0.875rem',
              background: loading ? 'rgba(201,150,26,0.55)' : C.gold,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              color: C.navyDeep, fontWeight: 700, fontSize: '1rem',
              letterSpacing: '0.01em',
              fontFamily: '"Manrope", system-ui, sans-serif',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(201,150,26,0.3)',
            }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.09)' }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            veya şununla devam et
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.09)' }} />
        </div>

        {/* Social buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleAppleLogin}
            className="bf-btn-social"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.11)',
              borderRadius: '0.875rem',
              cursor: 'pointer', color: 'white',
              fontFamily: '"Manrope", system-ui, sans-serif',
              fontWeight: 600, fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            <AppleSVG />
            Apple
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="bf-btn-social"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.11)',
              borderRadius: '0.875rem',
              cursor: 'pointer', color: 'white',
              fontFamily: '"Manrope", system-ui, sans-serif',
              fontWeight: 600, fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            <GoogleSVG />
            Google
          </button>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center', fontSize: '0.8125rem',
          color: 'rgba(255,255,255,0.38)', marginTop: '1.5rem', marginBottom: 0,
        }}>
          Hesabın yok mu?{' '}
          <button
            type="button"
            className="bf-link"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: C.cyan, fontWeight: 600, fontSize: '0.8125rem',
              fontFamily: '"Manrope", system-ui, sans-serif',
              padding: 0, transition: 'color 0.2s',
            }}
          >
            Kaydol
          </button>
        </p>
      </motion.div>
    </div>
  );
}
