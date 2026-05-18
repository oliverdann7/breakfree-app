import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/slices/authSlice';

const COLORS = {
  navy: '#0A2540',
  navyDeep: '#061829',
  royal: '#0072B0',
  cyan: '#14B8D4',
  cream: '#F4E8C8',
  gold: '#C9961A',
};

const styles = {
  container: {
    minHeight: '100vh',
    overflowX: 'hidden',
    backgroundColor: COLORS.navy,
    color: 'white',
    fontFamily: '"Manrope", system-ui, sans-serif',
    fontSmooth: 'antialiased',
    WebkitFontSmoothing: 'antialiased',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleSheet: `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700;800&display=swap');
    * { -webkit-font-smoothing: antialiased; }
    .font-display { font-family: 'Fraunces', Georgia, serif; }
    input::placeholder { color: rgba(255, 255, 255, 0.5); }
    input:focus { outline: none; }
  `,
  wrapper: {
    width: '100%',
    maxWidth: '28rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
  },
  card: {
    position: 'relative',
    borderRadius: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.04), transparent)',
    padding: '2rem',
    backdropFilter: 'blur(12px)',
  },
  closeButton: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  closeButtonHover: {
    color: 'white',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  logoSvg: {
    height: '2rem',
    width: '2rem',
  },
  title: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: '1.875rem',
    fontWeight: 300,
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  subtitle: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.875rem',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '1rem',
    transition: 'all 0.3s',
  },
  inputFocus: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  errorText: {
    color: '#f87171',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  },
  submitButton: {
    width: '100%',
    marginTop: '1.5rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    borderRadius: '9999px',
    backgroundColor: COLORS.gold,
    color: COLORS.navy,
    fontWeight: '600',
    fontSize: '0.875rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  submitButtonHover: {
    backgroundColor: COLORS.cream,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  backButton: {
    width: '100%',
    marginTop: '1rem',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
    borderRadius: '9999px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.875rem',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  backButtonHover: {
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.25)',
    marginTop: '1.5rem',
  },
  signupLink: {
    color: COLORS.gold,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  signupLinkHover: {
    color: COLORS.cream,
  },
};

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
        // Mock login for demo
        dispatch({
          type: 'auth/login/fulfilled',
          payload: {
            user: { uid: 'mock-uid', email, displayName: 'Demo Kullanıcı' },
            token: 'mock-token-123',
          },
        });
      }
    } catch (err) {
      setErrors({ submit: 'Giriş başarısız oldu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{styles.styleSheet}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        style={styles.wrapper}
      >
        <div style={styles.card}>
          {/* Close button */}
          <button
            onClick={onBack}
            style={styles.closeButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = styles.closeButtonHover.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = styles.closeButton.color;
            }}
            aria-label="Kapat"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Logo */}
          <div style={styles.logoContainer}>
            <svg style={styles.logoSvg} viewBox="0 0 178.9 263.7" xmlns="http://www.w3.org/2000/svg">
              <path d="M89.45 0C55.35 0 28.26 27.09 28.26 61.19c0 33.58 24.89 61.19 56.24 61.19 17.64 0 33.58-8.15 43.95-21.01v90.22c0 18.77-15.19 34.1-34.1 34.1-18.77 0-34.1-15.19-34.1-34.1h-28.26c0 34.61 28.26 62.87 62.36 62.87 34.1 0 62.36-28.26 62.36-62.87V61.19C150.64 27.09 123.55 0 89.45 0zm0 28.26c18.25 0 33.58 15.19 33.58 33.93 0 18.77-15.33 33.93-33.58 33.93-18.25 0-33.58-15.16-33.58-33.93 0-18.74 15.33-33.93 33.58-33.93z" fill={COLORS.royal}/>
              <path d="M89.45 131.62c17.64 0 33.58 8.15 43.95 21.01v28.26c-10.6 13.52-26.53 21.67-43.95 21.67-34.1 0-62.36-27.52-62.36-61.19v-28.26c13.18 20.49 35.88 33.58 62.36 33.51z" fill={COLORS.gold}/>
            </svg>
          </div>

          {/* Title */}
          <h2 style={styles.title}>Hoş geldin</h2>
          <p style={styles.subtitle}>Hesabına giriş yap</p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label}>E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                style={styles.input}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = styles.inputFocus.borderColor;
                  e.currentTarget.style.backgroundColor = styles.inputFocus.backgroundColor;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              {errors.email && <p style={styles.errorText}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = styles.inputFocus.borderColor;
                  e.currentTarget.style.backgroundColor = styles.inputFocus.backgroundColor;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              {errors.password && <p style={styles.errorText}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading && styles.submitButtonDisabled),
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = COLORS.gold;
                }
              }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Back button */}
          <button
            onClick={onBack}
            style={styles.backButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = styles.backButtonHover.borderColor;
              e.currentTarget.style.backgroundColor = styles.backButtonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Geri dön
          </button>

          {/* Footer */}
          <p style={styles.footerText}>
            Hesabın yok mu?{' '}
            <button
              style={styles.signupLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = styles.signupLinkHover.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = styles.signupLink.color;
              }}
            >
              Kaydol
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
