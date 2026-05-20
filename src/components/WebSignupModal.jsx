import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { signup } from '../store/slices/authSlice';

// Reusing CSS from WebLoginModal for consistency
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
  .bfl-close { position: absolute; top: 20px; right: 20px; background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.4); padding: 4px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; line-height: 1; }
  .bfl-close:hover { color: #fff; }
  .bfl-spinner { width: 16px; height: 16px; border: 2px solid rgba(6,24,41,0.3); border-top-color: #061829; border-radius: 50%; animation: bfl-spin 0.7s linear infinite; display: inline-block; }
  @keyframes bfl-spin { to { transform: rotate(360deg); } }
  .bfl-modal { animation: bfl-fade-in 0.28s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
  @keyframes bfl-fade-in { from { opacity: 0; transform: scale(0.96) translateY(16px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .bfl-link { background: none; border: none; cursor: pointer; color: #14B8D4; font-weight: 600; font-size: 13px; font-family: 'Manrope', system-ui, sans-serif; padding: 0; transition: color 0.2s; }
  .bfl-link:hover { color: #F4E8C8; }
`;

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

export default function WebSignupModal({ onBack, onLogin }) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!displayName) errs.displayName = 'İsim zorunlu';
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
      await dispatch(signup({ email, password, displayName })).unwrap();
    } catch (error) {
      setErrors((p) => ({ ...p, submit: error || 'Kayit başarısız oldu' }));
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onBack();
      }}
    >
      <style>{CSS}</style>
      <div
        className="bfl-modal"
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'linear-gradient(135deg, rgba(10,37,64,0.97) 0%, rgba(6,24,41,0.99) 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 24,
          padding: '36px 32px',
          position: 'relative',
        }}
      >
        <button className="bfl-close" onClick={onBack}>
          ✕
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <LogoSymbol />
        </div>
        <h2
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontSize: 30,
            textAlign: 'center',
            color: '#fff',
            margin: '0 0 6px',
          }}
        >
          Kaydol
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                marginBottom: 7,
              }}
            >
              İsim
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="İsmin"
              className="bfl-input"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                marginBottom: 7,
              }}
            >
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              className="bfl-input"
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                marginBottom: 7,
              }}
            >
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bfl-input"
            />
          </div>
          <button type="submit" disabled={loading} className="bfl-btn-primary">
            {loading ? <span className="bfl-spinner" /> : 'Kaydol'}
          </button>
        </form>
        <p
          style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'rgba(255,255,255,0.38)',
            margin: '22px 0 0',
          }}
        >
          Zaten hesabın var mı?{' '}
          <button type="button" className="bfl-link" onClick={onLogin}>
            Giriş Yap
          </button>
        </p>
      </div>
    </div>
  );
}
