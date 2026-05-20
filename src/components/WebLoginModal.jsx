import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { login, loginWithGoogle, loginWithApple } from '../store/slices/authSlice';

const C = {
  navyDeep: '#061829',
  navy: '#0A2540',
  gold: '#C9961A',
  goldLight: '#E6B530',
  cyan: '#14B8D4',
  cream: '#F4E8C8',
};

const CSS = `
  .bfl-input {
    width: 100%; padding: 12px 16px; border-radius: 12px;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.1);
    color: #fff; font-size: 15px; font-family: 'Manrope', system-ui, sans-serif;
    transition: border-color 0.2s, background 0.2s; outline: none; box-sizing: border-box;
  }
  .bfl-input::placeholder { color: rgba(255,255,255,0.28); }
  .bfl-input:focus { border-color: #14B8D4; background: rgba(20,184,212,0.06); }
  .bfl-input-error { border-color: rgba(239,68,68,0.5) !important; }
  .bfl-btn-primary {
    width: 100%; padding: 14px; border-radius: 14px; border: none; cursor: pointer;
    background: #C9961A; color: #061829; font-weight: 700; font-size: 16px;
    font-family: 'Manrope', system-ui, sans-serif; transition: all 0.2s;
    box-shadow: 0 4px 20px rgba(201,150,26,0.3); letter-spacing: 0.01em;
  }
  .bfl-btn-primary:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(201,150,26,0.45); }
  .bfl-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
  .bfl-btn-social {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.11);
    border-radius: 14px; cursor: pointer; color: #fff; font-family: 'Manrope', system-ui, sans-serif;
    font-weight: 600; font-size: 14px; transition: all 0.2s;
  }
  .bfl-btn-social:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.22); }
  .bfl-link { background: none; border: none; cursor: pointer; color: #14B8D4; font-weight: 600; font-size: 13px; font-family: 'Manrope', system-ui, sans-serif; padding: 0; transition: color 0.2s; }
  .bfl-link:hover { color: #F4E8C8; }
  .bfl-close { position: absolute; top: 20px; right: 20px; background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.4); padding: 4px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; line-height: 1; }
  .bfl-close:hover { color: #fff; }
  .bfl-forgot { background: none; border: none; cursor: pointer; color: #14B8D4; font-size: 12px; font-weight: 500; font-family: 'Manrope', system-ui, sans-serif; padding: 0; transition: color 0.2s; }
  .bfl-forgot:hover { color: #F4E8C8; }
  @keyframes bfl-fade-in { from { opacity: 0; transform: scale(0.96) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .bfl-modal { animation: bfl-fade-in 0.28s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
  @keyframes bfl-spin { to { transform: rotate(360deg); } }
  .bfl-spinner { width: 16px; height: 16px; border: 2px solid rgba(6,24,41,0.3); border-top-color: #061829; border-radius: 50%; animation: bfl-spin 0.7s linear infinite; display: inline-block; }
`;

function GoogleSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
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

function LogoSymbol() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 178.9 263.7"
      width={52}
      height={52}
      style={{ display: 'block' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#0072B0"
        d="M136.7,112.6c-23.8-35.8-85.4,9.4-61.6-82.3C65,50.5,58.4,72.5,56.1,95.8c3.5,13.7,10.8,27,19.3,37.7c1.4,1.8,2.9,3.6,4.6,5.4c8.5,9.3,18,16.3,26.6,20.1c2.4,1,4.7,1.8,6.8,2.2c-12.1-10.7-33.8-39.8-20.2-52.7C101.6,100.5,120,101.5,136.7,112.6L136.7,112.6z M62.8,166.6c6.1,20.7,15.7,40.1,28.3,57.5c-5.4-13.7-9.2-28.1-11.2-43c-4.2-3.2-8.5-6.6-12.7-10.3C65.7,169.4,64.2,168,62.8,166.6L62.8,166.6z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#0072B0"
        d="M89.2,53.6c6.6,0,12,5.4,12,12c0,6.7-5.4,12.1-12,12.1c-6.7,0-12.1-5.4-12.1-12.1C77.1,59,82.5,53.6,89.2,53.6L89.2,53.6z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#C9961A"
        d="M110.1,108.9c1.3,1.2,2.4,2.5,3.7,3.8c21,23.1,28.2,49.6,16.1,59.2C95.9,198.7,1.8,86.6,65.8,43.1c-33.7,26.7-14.9,74.5,9,100.8c17.8,19.7,40.1,29.3,49.8,21.7c9.7-7.7,3.2-29.8-14.7-49.4c-2.5-2.7-5.1-5.2-7.7-7.6c2.2-0.3,4.4-0.3,6.9,0.1C109.5,108.8,109.8,108.8,110.1,108.9L110.1,108.9z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#C9961A"
        d="M39.8,81.6c-1.3,0.8-2.6,1.7-3.7,2.8c-15.6,15-1.4,51.3,31.7,81c46.8,42.1,98,45.1,87.3,5.1c1,6.7-1.5,12.7-5.2,16.3c-12,11.9-45.6-0.6-75.1-27.7c-27.4-25.3-41.6-54.5-33.9-67.9C40.3,88,40,84.8,39.8,81.6L39.8,81.6z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#C9961A"
        d="M144.1,232.2c-22.7-9.1-92-5.5-113.7,6C63.5,216.7,109.1,214.3,144.1,232.2L144.1,232.2z"
      />
    </svg>
  );
}

export default function WebLoginModal({ onBack, onSignup }) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Lock background scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBack]);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'E-posta zorunlu';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Geçerli bir e-posta girin';
    if (!password) errs.password = 'Şifre zorunlu';
    else if (password.length < 6) errs.password = 'Şifre en az 6 karakter olmalı';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors((p) => ({ ...p, submit: undefined }));

    try {
      await dispatch(login({ email, password })).unwrap();
      // On success, state updates automatically, and WebAppContent handles transition
    } catch (error) {
      setErrors((p) => ({ ...p, submit: error || 'Giriş başarısız oldu' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider) => {
    setLoading(true);
    setErrors((p) => ({ ...p, submit: undefined }));
    try {
      if (provider === 'google') await dispatch(loginWithGoogle()).unwrap();
      else if (provider === 'apple') await dispatch(loginWithApple()).unwrap();
    } catch (error) {
      setErrors((p) => ({ ...p, submit: error || 'Sosyal giriş başarısız' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(6,24,41,0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: "'Manrope', system-ui, sans-serif",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onBack();
      }}
    >
      <style>{CSS}</style>

      {/* Ambient orbs */}
      <div
        style={{
          position: 'fixed',
          top: -120,
          left: -120,
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,114,176,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,184,212,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="bfl-modal"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 420,
          background: 'linear-gradient(135deg, rgba(10,37,64,0.97) 0%, rgba(6,24,41,0.99) 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        <button className="bfl-close" onClick={onBack} aria-label="Kapat">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <LogoSymbol />
        </div>

        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 30,
            fontWeight: 400,
            textAlign: 'center',
            color: '#fff',
            margin: '0 0 6px',
            letterSpacing: '-0.02em',
          }}
        >
          Hoş geldin
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 14,
            margin: '0 0 28px',
          }}
        >
          Hesabına giriş yap
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.02em',
                marginBottom: 7,
              }}
            >
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="ornek@email.com"
              className={`bfl-input${errors.email ? ' bfl-input-error' : ''}`}
              autoComplete="email"
            />
            {errors.email && (
              <p style={{ color: '#f87171', fontSize: 12, margin: '5px 0 0 2px' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 7,
              }}
            >
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.55)',
                  letterSpacing: '0.02em',
                }}
              >
                Şifre
              </label>
              <button type="button" className="bfl-forgot">
                Unuttun mu?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="••••••••"
              className={`bfl-input${errors.password ? ' bfl-input-error' : ''}`}
              autoComplete="current-password"
            />
            {errors.password && (
              <p style={{ color: '#f87171', fontSize: 12, margin: '5px 0 0 2px' }}>
                {errors.password}
              </p>
            )}
          </div>

          {errors.submit && (
            <div
              style={{
                background: 'rgba(239,68,68,0.09)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 12,
                padding: '10px 14px',
                color: '#f87171',
                fontSize: 13,
                textAlign: 'center',
                marginBottom: 14,
              }}
            >
              {errors.submit}
            </div>
          )}

          <button type="submit" disabled={loading} className="bfl-btn-primary">
            {loading ? (
              <span
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              >
                <span className="bfl-spinner" /> Giriş yapılıyor...
              </span>
            ) : (
              'Giriş Yap'
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.09)' }} />
          <span
            style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: 12,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            veya şununla devam et
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.09)' }} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="bfl-btn-social" onClick={() => handleSocial('apple')}>
            <AppleSVG /> Apple
          </button>
          <button type="button" className="bfl-btn-social" onClick={() => handleSocial('google')}>
            <GoogleSVG /> Google
          </button>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'rgba(255,255,255,0.38)',
            margin: '22px 0 0',
          }}
        >
          Hesabın yok mu?{' '}
          <button type="button" className="bfl-link" onClick={onSignup}>
            Kaydol
          </button>
        </p>
      </div>
    </div>
  );
}
